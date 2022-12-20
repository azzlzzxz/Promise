/*
 * @Author: xinxu
 * @Date: 2022-12-17 19:49:42
 * @LastEditors: xinxu
 * @LastEditTime: 2022-12-17 21:03:43
 * @FilePath: /promise/2.promise/test.js
 */
const Promise = require("./promise.js");
console.log(1);
let p = new Promise((resolve, reject) => {
  console.log(2);
  setTimeout(() => {
    console.log(4);
    resolve("success");
    console.log(5);
  }, 1000);
});
p.then(
  (data) => {
    console.log(data);
  },
  (err) => {
    console.log(err);
  }
);
console.log(3);
