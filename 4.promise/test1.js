/*
 * @Author: xinxu
 * @Date: 2022-12-20 22:11:44
 * @LastEditors: xinxu
 * @LastEditTime: 2022-12-20 22:13:05
 * @FilePath: /Promise/4.promise/test1.js
 */
const Promise = require("./promise.js");

let p1 = new Promise((resolve, reject) => {
  resolve();
});

let p2 = p1.then(() => {
  return p2;
});

p2.then(null, (err) => {
  console.log(err);
});
