/*
 * @Author: xinxu
 * @Date: 2022-12-21 11:08:49
 * @LastEditors: xinxu
 * @LastEditTime: 2022-12-21 15:13:55
 * @FilePath: /Promise/5.promise/test.js
 */
const Promise = require("./promise");
const fs = require("fs");

const getName = fs.readFile("name.txt", "utf8", (err, data) => {});
const getAge = fs.readFile("age.txt", "utf8", (err, data) => {});
Promise.all([1, getName, getAge, 2]).then((data) => {
  console.log("data", data);
});
