const {SHA256} = require('crypto-js');
const jwt  = require('jsonwebtoken');
// let text  = 'hello world';
let data = {
    id:10
};
let signedString = jwt.sign(data,'abc123');
console.log(signedString+1);
data = {
    id:6
}
let decoded = jwt.verify(signedString,'abc1234');
console.log(decoded);
// let text = 'hello everyone';
// let enctext = SHA256(text);
// console.log(enctext.toString());
// console.log(typeof enctext);

// let data = {
//     id:5
// };
// let token = SHA256(JSON.stringify(data)+'hello world').toString();
// console.log(token);
// let response = {
//     data,
//     token
// }
// console.log(response);
// // response.data = {
// //     id:6
// // }
// // response.token = SHA256(JSON.stringify(response.data)).toString();
// requestToken = SHA256(JSON.stringify(response.data)+'hello world').toString();
// if(response.token === requestToken) {
//     console.log("Token matched");
// } else {
//     console.log("Token not matched");
// }