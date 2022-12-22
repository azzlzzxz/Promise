/*
 * @Author: xinxu
 * @Date: 2022-12-17 18:09:42
 * @LastEditors: xinxu
 * @LastEditTime: 2022-12-20 17:13:37
 * @FilePath: /promise/1.promise/test.js
 */
const Promise = require("./promise.js");
console.log(1);
let p = new Promise((resolve, reject) => {
  // throw new Error('')
  // reject('失败了');
  console.log(2);
  resolve("成功了");
});
p.then(
  (data) => {
    // 成功的回调 onfulfilled
    console.log("success", data);
  },
  (reason) => {
    // 失败的回调 onrejected
    console.log("fail", reason);
  }
);
console.log(3);

// p.then(undefined, (reason) => {
//   console.log(reason);
// });
