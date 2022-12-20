/*
 * @Author: xinxu
 * @Date: 2022-12-17 19:49:49
 * @LastEditors: xinxu
 * @LastEditTime: 2022-12-17 21:32:28
 * @FilePath: /promise/2.promise/promise.js
 */
STATUS = { PENDING: "PENDING", FULFILLED: "FULFILLED", REJECTED: "REJECTED" };
class Promise {
  constructor(executor) {
    this.status = "PENDING";
    this.value = undefined;
    this.reason = undefined;
    this.onResolveCallbacks = []; // 存放成功的回调
    this.onRejectedCallbacks = []; // 存放失败的回调
    const resolve = (value) => {
      this.value = value;
      this.status = "FULFILLED";
      // 在promise状态确定下来时候就依次执行，数组里的函数（也就是发布）
      this.onResolveCallbacks.forEach((fn) => fn()); // 发布
    };
    const reject = (reason) => {
      this.reason = reason;
      this.status = "REJECTED";
      this.onRejectedCallbacks.forEach((fn) => fn());
    };
    try {
      executor(resolve, reject);
    } catch (e) {
      reject(e); // 走失败的逻辑
    }
  }
  then(onFulfilled, onRejected) {
    if (this.status === "FULFILLED") {
      onFulfilled(this.value);
    }
    if (this.status === "REJECTED") {
      onRejected(this.reason);
    }
    if (this.status === "PENDING") {
      // promise的状态处于pending，需要等promise的状态确定下来，再走then的onFulfilled/onRejected方法，
      // 所以需要把onFulfilled/onRejected，存到数组里，这里就是订阅

      this.onResolveCallbacks.push(() => {
        setTimeout(() => {
          // 订阅
          onFulfilled(this.value);
        }, 0);
      });

      this.onRejectedCallbacks.push(() => {
        setTimeout(() => {
          onRejected(this.reason);
        }, 0);
      });
    }
  }
}

module.exports = Promise;
