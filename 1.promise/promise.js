/*
 * @Author: xinxu
 * @Date: 2022-12-17 17:58:15
 * @LastEditors: xinxu
 * @LastEditTime: 2022-12-20 17:34:33
 * @FilePath: /Promise/1.promise/promise.js
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
}

module.exports = Promise;
