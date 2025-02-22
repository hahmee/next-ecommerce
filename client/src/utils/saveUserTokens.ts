//
// // Define a function named 'saveUserTokens' that takes a 'Tokens' object as a parameter
// import {cookies} from "next/headers";
//
// export default function saveUserTokens(newCookie: string) {
//     // Convert the 'credentials' object to a JSON string
//     const data = JSON.stringify(newCookie);
//     cookies().set('member', data, {expires: 1});
//
//     // Set a cookie named 'user' with the JSON stringified 'credentials' data
//     // Cookie.set('user', data);
// }