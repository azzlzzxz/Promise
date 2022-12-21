/*
 * @Author: xinxu
 * @Date: 2022-12-17 19:49:42
 * @LastEditors: xinxu
 * @LastEditTime: 2022-12-20 23:31:06
 * @FilePath: /Promise/4.promise/test.js
 */
const Promise = require("./promise.js");
setTimeout(() => {
  console.log("宏任务3");
}, 0);

let p1 = new Promise((resolve, reject) => {
  console.log("宏任务1");
  setTimeout(() => {
    console.log("宏任务4");
    resolve(1);
    // reject(1);
  }, 0);
});

p1.then(
  (data) => {
    console.log("微任务1", data);
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(2);
        // reject(3);
      }, 1000);
    });
  },
  (err) => {
    return err;
  }
).then(
  (data) => {
    console.log("微任务2", data);
  },
  (err) => {
    console.log(err);
  }
);

console.log("宏任务2");

let p2 = new Promise((resolve, reject) => {
  resolve("ok");
});

p2.then((data) => {
  console.log(data);
});
