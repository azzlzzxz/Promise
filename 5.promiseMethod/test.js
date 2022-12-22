/*
 * @Author: xinxu
 * @Date: 2022-12-21 11:08:49
 * @LastEditors: xinxu
 * @LastEditTime: 2022-12-21 22:26:56
 * @FilePath: /Promise/5.promise/test.js
 */
// const Promise = require("./promise");

const promise1 = Promise.resolve(3);
const promise2 = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve("success");
  }, 1000);
});
const promise3 = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve("yes");
  }, 2000);
});

Promise.all([1, promise1, promise2]).then((values) => {
  console.log(values);
});

Promise.race([1, promise1, promise2]).then((data) => {
  console.log(data);
});

Promise.resolve(123)
  .finally(() => {
    // 这里传入的函数 无论如何都会执行
    console.log("finally");
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        reject("ok");
      }, 5000);
    });
  })
  .then(
    (data) => {
      console.log("s:" + data);
    },
    (err) => {
      console.log("e:" + err);
    }
  );
