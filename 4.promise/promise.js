const STATUS = {
  PENDING: "PENDING",
  FULFILLED: "FULFILLED",
  REJECTED: "REJECTED",
};

class Promise {
  constructor(executor) {
    this.status = "PENDING";
    this.value = undefined;
    this.reason = undefined;
    this.onResolveCallbacks = [];
    this.onRejectCallbacks = [];
    const resolve = (val) => {
      this.status = STATUS.FULFILLED;
      this.value = val;
      // 执行成功回调
      this.onResolveCallbacks.forEach((fn) => fn());
    };
    const reject = (reason) => {
      this.status = STATUS.REJECTED;
      this.reason = reason;
      // 执行失败回调
      this.onRejectCallbacks.forEach((fn) => fn());
    };
    // executor会默认执行
    try {
      executor(resolve, reject);
    } catch (e) {
      reject(e);
    }
  }

  then(onFulfilled, onRejected) {
    // 2.2.7规范 then 方法必须返回一个 promise 对象
    let promise2 = new Promise((resolve, reject) => {
      if (this.status === STATUS.FULFILLED) {
        /**
         * 为什么这里要加定时器setTimeout？
         * 2.2.4规范 onFulfilled 和 onRejected 只有在执行环境堆栈仅包含平台代码时才可被调用 注1
         * 这里的平台代码指的是引擎、环境以及 promise 的实施代码。
         * 实践中要确保 onFulfilled 和 onRejected 方法异步执行，且应该在 then 方法被调用的那一轮事件循环之后的新执行栈中执行。
         * 这个事件队列可以采用“宏任务（macro-task）”机制，比如setTimeout 或者 setImmediate； 也可以采用“微任务（micro-task）”机制来实现， 比如 MutationObserver 或者process.nextTick。
         */
        setTimeout(() => {
          try {
            if (typeof onFulfilled !== "function") {
              // 2.2.7.3规范 如果 onFulfilled 不是函数且 promise1 成功执行， promise2 必须成功执行并返回相同的值
              resolve(this.value);
            } else {
              // 2.2.7.1规范 如果 onFulfilled 或者 onRejected 返回一个值 x ，则运行下面的 Promise 解决过程：[[Resolve]](promise2, x)，即运行resolvePromise()
              let x = onFulfilled(this.value);
              resolvePromise(x, promise2, resolve, reject);
            }
          } catch (e) {
            // 2.2.7.2规范 如果 onFulfilled 或者 onRejected 抛出一个异常 e ，则 promise2 必须拒绝执行，并返回拒绝原因 e
            reject(e); // 捕获前面onFulfilled中抛出的异常
          }
        });
      }
      if (this.status === STATUS.REJECTED) {
        setTimeout(() => {
          try {
            if (typeof onRejected !== "function") {
              // 2.2.7.4规范 如果 onRejected 不是函数且 promise1 拒绝执行， promise2 必须拒绝执行并返回相同的拒绝原因
              reject(this.reason);
            } else {
              let x = onRejected(this.reason);
              resolvePromise(x, promise2, resolve, reject);
            }
          } catch (e) {
            reject(e);
          }
        });
      }
      if (this.status === STATUS.PENDING) {
        // pending 状态保存的 onFulfilled() 和 onRejected() 回调也要符合 2.2.7.1，2.2.7.2，2.2.7.3 和 2.2.7.4 规范
        this.onResolveCallbacks.push(() => {
          setTimeout(() => {
            try {
              if (typeof onFulfilled !== "function") {
                resolve(this.value);
              } else {
                let x = onFulfilled(this.value);
                resolvePromise(x, promise2, resolve, reject);
              }
            } catch (e) {
              reject(e);
            }
          });
        });
        this.onRejectCallbacks.push(() => {
          setTimeout(() => {
            try {
              if (typeof onRejected !== "function") {
                reject(this.reason);
              } else {
                let x = onRejected(this.reason);
                resolvePromise(x, promise2, resolve, reject);
              }
            } catch (e) {
              reject(e);
            }
          });
        });
      }
    });
    return promise2;
  }
}

/**
 * 对resolve()、reject() 进行改造增强 针对resolve()和reject()中不同值情况 进行处理
 * @param  {promise} promise2 promise1.then方法返回的新的promise对象
 * @param  {[type]} x         promise1中onFulfilled或onRejected的返回值
 * @param  {[type]} resolve   promise2的resolve方法
 * @param  {[type]} reject    promise2的reject方法
 */
function resolvePromise(x, promise2, resolve, reject) {
  // 2.3.1规范 如果 promise 和 x 指向同一对象，以 TypeError 为据因拒绝执行 promise
  if (x === promise2) {
    throw new TypeError("Chaining cycle detected for promise");
  }

  if (x instanceof Promise) {
    /**
     * 2.3.2 如果 x 为 Promise ，则使 promise2 接受 x 的状态
     *       也就是继续执行x，如果执行的时候拿到一个y，还要继续解析y
     */
    x.then((y) => {
      resolvePromise(y, promise2, resolve, reject);
    }, reject);
  } else if (x !== null && (typeof x === "object" || typeof x === "function")) {
    // 2.3.3 如果 x 为对象或函数
    try {
      // 2.3.3.1 把 x.then 赋值给 then
      var then = x.then;
    } catch (e) {
      // 2.3.3.2 如果取 x.then 的值时抛出错误 e ，则以 e 为据因拒绝 promise
      return reject(e);
    }

    /**
     * 2.3.3.3
     * 如果 then 是函数，将 x 作为函数的作用域 this 调用之。
     * 传递两个回调函数作为参数，
     * 第一个参数叫做 `resolvePromise` ，第二个参数叫做 `rejectPromise`
     */
    if (typeof then === "function") {
      // 2.3.3.3.3 如果 resolvePromise 和 rejectPromise 均被调用，或者被同一参数调用了多次，则优先采用首次调用并忽略剩下的调用
      let called = false; // 避免多次调用
      try {
        then.call(
          x,
          // 2.3.3.3.1 如果 resolvePromise 以值 y 为参数被调用，则运行 [[Resolve]](promise, y)
          (y) => {
            if (called) return;
            called = true;
            resolvePromise(y, promise2, resolve, reject);
          },
          // 2.3.3.3.2 如果 rejectPromise 以据因 r 为参数被调用，则以据因 r 拒绝 promise
          (r) => {
            if (called) return;
            called = true;
            reject(r);
          }
        );
      } catch (e) {
        /**
         * 2.3.3.3.4 如果调用 then 方法抛出了异常 e
         * 2.3.3.3.4.1 如果 resolvePromise 或 rejectPromise 已经被调用，则忽略之
         */
        if (called) return;
        called = true;

        // 2.3.3.3.4.2 否则以 e 为据因拒绝 promise
        reject(e);
      }
    } else {
      // 2.3.3.4 如果 then 不是函数，以 x 为参数执行 promise
      resolve(x);
    }
  } else {
    // 2.3.4 如果 x 不为对象或者函数，以 x 为参数执行 promise
    return resolve(x);
  }
}

Promise.deferred = function () {
  let result = {};
  result.promise = new Promise((resolve, reject) => {
    result.resolve = resolve;
    result.reject = reject;
  });
  return result;
};

module.exports = Promise;
