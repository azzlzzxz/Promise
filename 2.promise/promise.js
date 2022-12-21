/*
 * @Author: xinxu
 * @Date: 2022-12-17 17:58:15
 * @LastEditors: xinxu
 * @LastEditTime: 2022-12-20 21:14:19
 * @FilePath: /Promise/2.promise/promise.js
 */
const STATUS = {
  PENDING: "PENDING",
  FULFILLED: "FULFILLED",
  REJECTED: "REJECTED",
};
class Promise {
  constructor(executor) {
    // 类中的构造函数会传入一个executor
    this.status = STATUS.PENDING;
    this.value = undefined;
    this.reason = undefined;
    const resolve = (val) => {
      // executor的参数resolve函数
      if (this.status == STATUS.PENDING) {
        this.status = STATUS.FULFILLED;
        this.value = val;
      }
    };
    const reject = (reason) => {
      //executor的参数reject函数
      if (this.status == STATUS.PENDING) {
        this.status = STATUS.REJECTED;
        this.reason = reason;
      }
    };
    try {
      // executor会默认执行
      executor(resolve, reject);
    } catch (e) {
      // 出错走失败逻辑
      reject(e);
    }
  }
  // 同步状态
  // promise实例的then方法，有两个参数onFulfilled函数，onRejected函数
  then(onFulfilled, onRejected) {
    onFulfilled =
      typeof onFulfilled === "function" ? onFulfilled : (value) => value;
    onRejected =
      typeof onRejected === "function"
        ? onRejected
        : (reason) => {
            throw reason;
          };

    if (this.status == STATUS.FULFILLED) {
      // 如果promise，resolve，就走then的onFulfilled函数
      onFulfilled(this.value);
    }
    if (this.status == STATUS.REJECTED) {
      // 如果promise，reject，就走then的onRejected函数
      onRejected(this.reason);
    }
  }
}
module.exports = Promise;
