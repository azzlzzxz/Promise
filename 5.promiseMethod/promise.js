/*
 * @Author: xinxu
 * @Date: 2022-12-21 14:13:30
 * @LastEditors: xinxu
 * @LastEditTime: 2022-12-21 22:36:43
 * @FilePath: /Promise/5.promise/promise.js
 */
const STATUS = {
  PENDING: "PENDING",
  FULFILLED: "FULFILLED",
  REJECTED: "REJECTED",
};

class Promise {
  constructor(executor) {
    this.status = STATUS.PENDING;
    this.value = undefined;
    this.reason = undefined;
    this.onResolveCallbacks = [];
    this.onRejectCallbacks = [];
    const resolve = (val) => {
      this.status = STATUS.FULFILLED;
      this.value = val;
      this.onResolveCallbacks.forEach((fn) => fn());
    };
    const reject = (reason) => {
      this.status = STATUS.REJECTED;
      this.reason = reason;
      this.onRejectCallbacks.forEach((fn) => fn());
    };
    try {
      executor(resolve, reject);
    } catch (e) {
      reject(e);
    }
  }

  then(onFulfilled, onRejected) {
    let promise2 = new Promise((resolve, reject) => {
      if (this.status === STATUS.FULFILLED) {
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
      }
      if (this.status === STATUS.REJECTED) {
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
      }
      if (this.status === STATUS.PENDING) {
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

  catch(err) {
    // catch就是then的简写，只有失败没有成功
    return this.then(null, err);
  }

  finally(callback) {
    return this.then(
      (data) => {
        // 返回promise等待其执行完毕
        return Promise.resolve(callback()).then(() => data);
      },
      (err) => {
        return Promise.resolve(callback()).then(() => {
          throw err;
        });
      }
    );
  }

  static resolve(value) {
    return new Promise((resolve, reject) => {
      resolve(value);
    });
  }

  static reject(reason) {
    return new Promise((resolve, reject) => {
      reject(reason);
    });
  }

  static all(promises) {
    return new Promise((resolve, reject) => {
      if (Array.isArray(promises)) {
        let result = [];
        let times = 0;
        const processData = (i, val) => {
          result[i] = val;
          if (result.length === promises.length) {
            resolve(result);
          }
        };
        for (let i = 0; i < promises.length; i++) {
          if (isPromise(promises[i])) {
            promises[i].then((data) => {
              processData(i, data);
            }, reject);
          } else {
            processData(i, promises[i]);
          }
        }
      } else {
        return reject(new TypeError("参数错误"));
      }
    });
  }

  static race(promises) {
    return new Promise((resolve, reject) => {
      if (Array.isArray(promises)) {
        if (promises.length > 0) {
          for (let i = 0; i < promises.length; i++) {
            let result = promises[i];
            if (isPromise(result)) {
              return result.then(resolve, reject);
            } else {
              return resolve(result);
            }
          }
        }
      } else {
        return reject(new TypeError("参数错误"));
      }
    });
  }
}

// 判断是不是promise
function isPromise(val) {
  return val && typeof val.then === "function";
}

function resolvePromise(x, promise2, resolve, reject) {
  if (x === promise2) {
    throw new TypeError("出错了");
  }

  if (x !== null && (typeof x === "object" || typeof x === "function")) {
    try {
      var then = x.then;
    } catch (e) {
      return reject(e);
    }

    if (typeof then === "function") {
      let called = false;
      try {
        then.call(
          x,
          (y) => {
            if (called) return;
            called = true;
            resolvePromise(y, promise2, resolve, reject);
          },
          (r) => {
            if (called) return;
            called = true;
            reject(r);
          }
        );
      } catch (e) {
        if (called) return;
        called = true;
        reject(e);
      }
    } else {
      resolve(x);
    }
  } else {
    return resolve(x);
  }
}

module.exports = Promise;
