// "use server";
//
// import {DataResponse} from "@/interface/DataResponse";
// import {Product} from "@/interface/Product";
//
// export default async (prevState: any, formData: FormData) => {
//     try {
//
//         const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/member/searchAdminProduct?search=`, {
//             method: "GET",
//             credentials: 'include',
//         });
//
//         const data:DataResponse<Product> = await response.json();
//
//         if(!response.ok) {
//             return { message: data.message };
//         }
//
//     } catch (err) {
//         console.error(err);
//         return {message: 'unknown_error'};
//     }
//
//
//     return {message: null};
// };