/*
 * @Author: xinxu
 * @Date: 2022-12-17 19:49:42
 * @LastEditors: xinxu
 * @LastEditTime: 2022-12-20 16:15:48
 * @FilePath: /promise/4.promise/test.js
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

setTimeout(function () {
  console.log("宏事件3");
}, 0);

new Promise((resolve) => {
  console.log("宏事件1");
  setTimeout(() => {
    console.log("宏事件4");
    resolve(1);
  }, 0);
})
  .then(function (data) {
    console.log("微事件1", data);
  })
  .then(function () {
    console.log("微事件2");
  });

console.log("宏事件2");
