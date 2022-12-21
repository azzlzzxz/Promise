/*
 * @Author: xinxu
 * @Date: 2022-12-20 22:11:50
 * @LastEditors: xinxu
 * @LastEditTime: 2022-12-20 22:13:32
 * @FilePath: /Promise/4.promise/test2.js
 */
const Promise = require("./promise.js");

let p2 = new Promise((resolve, reject) => {
  resolve("ok");
});

p2.then()
  .then()
  .then()
  .then((data) => {
    console.log(data);
  });
