/*
 * @Author: xinxu
 * @Date: 2022-12-20 22:24:08
 * @LastEditors: xinxu
 * @LastEditTime: 2022-12-20 22:33:49
 * @FilePath: /Promise/4.promise/test4.js
 */
// const Promise = require("./promise.js");

let p = new Promise((resolve, reject) => {
  resolve("成功");
});
// 判断返回值和promise2的关系，这个返回值决定promise2的成功还是失败
let promise2 = p.then((data) => {
  // 判断当前成功/失败返回的是不是一个promise
  return new Promise((resolve, reject) => {
    resolve(
      new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve(data);
        }, 1000);
      })
    );
  });
});

promise2.then(
  (data) => {
    console.log(data);
  },
  (err) => {
    console.log("err", err);
  }
);
