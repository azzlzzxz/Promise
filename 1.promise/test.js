/*
 * @Author: xinxu
 * @Date: 2022-12-20 17:04:22
 * @LastEditors: xinxu
 * @LastEditTime: 2022-12-20 17:09:17
 * @FilePath: /promise/promise/test.js
 */
const Promise = require("./promise.js");

let promise = new Promise((resolve, reject) => {
  resolve("成功");
});

console.log(promise);
