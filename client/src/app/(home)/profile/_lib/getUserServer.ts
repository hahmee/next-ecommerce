import {fetchWithInterceptor} from "@/utils/jwtUtils";

export const getUserServer = async (accessToken: string, email:string) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/profile?email=${email}`, {
        method: "POST",
        credentials: 'include', //cookie
        // headers: {Authorization: `Bearer ${accessToken}`},
        // cache: 'no-store',
    });
    // The return value is *not* serialized
    // You can return Date, Map, Set, etc.

    if (!res.ok) {
        // This will activate the closest `error.js` Error Boundary
        throw new Error('Failed to fetch data')
    }

    return res.json()
}


// export const getUserServer = async (accessToken: string, email:string) => {
//     const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/profile?email=${email}`, {
//         next: {
//             //  tags: ['users', username],
//         },
//         credentials: 'include',
//         headers: {Authorization: `Bearer ${accessToken}`},
//         cache: 'no-store',
//     });
//     // The return value is *not* serialized
//     // You can return Date, Map, Set, etc.
//
//     if (!res.ok) {
//         // This will activate the closest `error.js` Error Boundary
//         throw new Error('Failed to fetch data')
//     }
//
//     return res.json()
// }


// export const getUserServer = async (accessToken: string, email:string) => {
//     const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/profile?email=${email}`, {
//         next: {
//             //  tags: ['users', username],
//         },
//         credentials: 'include',
//         headers: {Authorization: `Bearer ${accessToken}`},
//         cache: 'no-store',
//     });
//     // The return value is *not* serialized
//     // You can return Date, Map, Set, etc.
//
//     if (!res.ok) {
//         // This will activate the closest `error.js` Error Boundary
//         throw new Error('Failed to fetch data')
//     }
//
//     return res.json()
// }
//
//
// // export const getUserServer = async (accessToken: string, email:string) => {
// //     const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/profile?email=${email}`, {
// //         next: {
// //             //  tags: ['users', username],
// //         },
// //         credentials: 'include',
// //         headers: {Authorization: `Bearer ${accessToken}`},
// //         cache: 'no-store',
// //     });
// //     // The return value is *not* serialized
// //     // You can return Date, Map, Set, etc.
// //
// //     if (!res.ok) {
// //         // This will activate the closest `error.js` Error Boundary
// //         throw new Error('Failed to fetch data')
// //     }
// //
// //     return res.json()
// // }