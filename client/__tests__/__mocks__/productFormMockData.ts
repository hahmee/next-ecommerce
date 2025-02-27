import {DataResponse} from "@/interface/DataResponse";

export const mockProducts: DataResponse<any> = {
    success: true,
    code: 0,
    message: "OK",
    data:
        {
            pno: 49,
            pname: "asdfasdf",
            price: 12312,
            pdesc: "<p>123</p>",
            delFlag: false,
            // brand: "brand-option3",
            sizeList: [
                "S"
            ],
            colorList: [
                {
                    id: 113,
                    text: "123",
                    color: "#771b1b"
                }
            ],
            sku: "123",
            salesStatus: "ONSALE",
            refundPolicy: "123",
            changePolicy: "12312",
            categoryId: 66,
            files: null,
            uploadFileNames: [
                {
                    file: "https://e-commerce-nextjs.s3.ap-northeast-2.amazonaws.com/product/ccb0d12a-71d7-4b2f-a1a1-5e63cf015b31_5da3970f-1b26-4640-84de-bec8fe543c8f_5711c80a8e070bfed1712e9bb6f02500 - ë³µì¬ë³¸.jpg",
                    ord: 0
                }
            ],
            uploadFileKeys: [
                {
                    file: "product/ccb0d12a-71d7-4b2f-a1a1-5e63cf015b31_5da3970f-1b26-4640-84de-bec8fe543c8f_5711c80a8e070bfed1712e9bb6f02500 - ë³µì¬ë³¸.jpg",
                    ord: 0
                }
            ],
            averageRating: null,
            reviewCount: null,
            category: {
                cno: 66,
                cname: "3번째 카테고리",
                cdesc: "ㅇㅋㅋㅋ",
                delFlag: false,
                parentCategoryId: null,
                subCategories: null,
                file: null,
                uploadFileName: null,
                uploadFileKey: null
            },
            owner: {
                password: "$2a$10$33DFffwoE5NiABf..JAwYeM2JknqnMB168umr2/5h/mfzBJkZc9xK",
                username: "dodo@aaa.com",
                authorities: [
                    {
                        authority: "ROLE_ADMIN"
                    }
                ],
                accountNonExpired: true,
                accountNonLocked: true,
                credentialsNonExpired: true,
                enabled: true,
                email: "dodo@aaa.com",
                nickname: "dodo",
                social: false,
                roleNames: [
                    "ADMIN"
                ],
                encryptedId: "123c0ec0cc072a2d4ff01594d6dd8869daf815bd8778e1b18c8541d019ecad51",
                claims: {
                    password: "$2a$10$33DFffwoE5NiABf..JAwYeM2JknqnMB168umr2/5h/mfzBJkZc9xK",
                    social: false,
                    encryptedId: "123c0ec0cc072a2d4ff01594d6dd8869daf815bd8778e1b18c8541d019ecad51",
                    nickname: "dodo",
                    roleNames: [
                        "ADMIN"
                    ],
                    email: "dodo@aaa.com"
                }
            }
        },
};


export const mockCategoryPaths: DataResponse<any>  =
    {
        success: true,
        code: 0,
        message: "OK",
        data: [
            {
                cno: 63,
                cname: "ㅁㄴㅇㄹ",
                cdesc: "ㅁㄴㅇㄹ",
                delFlag: false,
                parentCategoryId: null,
                subCategories: [
                    {
                        cno: 65,
                        cname: "ㅇㅇㅇㅇ",
                        cdesc: "ㅁㄴㅇㄹㄴㅇ",
                        delFlag: false,
                        parentCategoryId: null,
                        subCategories: null,
                        file: null,
                        uploadFileName: "https://e-commerce-nextjs.s3.ap-northeast-2.amazonaws.com/category/c8024893-26dc-42ff-905c-e2bd2276a91e_3ca0b8b0-c89a-4ef9-9225-5224d8b51c87_476b12cf1a3623bc4cd2060495bef990 (1).jpg",
                        uploadFileKey: "category/c8024893-26dc-42ff-905c-e2bd2276a91e_3ca0b8b0-c89a-4ef9-9225-5224d8b51c87_476b12cf1a3623bc4cd2060495bef990 (1).jpg"
                    }
                ],
                file: null,
                uploadFileName: "https://e-commerce-nextjs.s3.ap-northeast-2.amazonaws.com/category/7b3db926-43a1-4ac2-84bf-cd72428f82d2_ë¤í¨2_ë³µì¬ë³¸-001.png",
                uploadFileKey: "category/7b3db926-43a1-4ac2-84bf-cd72428f82d2_ë¤í¨2_ë³µì¬ë³¸-001.png"
            },
            {
                cno: 65,
                cname: "ㅇㅇㅇㅇ",
                cdesc: "ㅁㄴㅇㄹㄴㅇ",
                delFlag: false,
                parentCategoryId: null,
                subCategories: null,
                file: null,
                uploadFileName: "https://e-commerce-nextjs.s3.ap-northeast-2.amazonaws.com/category/c8024893-26dc-42ff-905c-e2bd2276a91e_3ca0b8b0-c89a-4ef9-9225-5224d8b51c87_476b12cf1a3623bc4cd2060495bef990 (1).jpg",
                uploadFileKey: "category/c8024893-26dc-42ff-905c-e2bd2276a91e_3ca0b8b0-c89a-4ef9-9225-5224d8b51c87_476b12cf1a3623bc4cd2060495bef990 (1).jpg"
            }
        ],
    }


export const mockCategories: DataResponse<any> =

    {
        success: true,
        code: 0,
        message: "OK",
        data:
            [
                {
                    cno: 57,
                    cname: "ㄴㅇㄹ",
                    cdesc: "ㄴㅇㄹ",
                    delFlag: false,
                    parentCategoryId: null,
                    subCategories: null,
                    file: null,
                    uploadFileName: "https://e-commerce-nextjs.s3.ap-northeast-2.amazonaws.com/category/d64b1523-b625-4622-8c83-8a0dc3471db9_75b617c1cbbd0a0c90724c14b8834352.jpg",
                    uploadFileKey: "category/d64b1523-b625-4622-8c83-8a0dc3471db9_75b617c1cbbd0a0c90724c14b8834352.jpg"
                },
                {
                    cno: 63,
                    cname: "ㅁㄴㅇㄹ",
                    cdesc: "ㅁㄴㅇㄹ",
                    delFlag: false,
                    parentCategoryId: null,
                    subCategories: [
                        {
                            cno: 65,
                            cname: "ㅇㅇㅇㅇ",
                            cdesc: "ㅁㄴㅇㄹㄴㅇ",
                            delFlag: false,
                            parentCategoryId: null,
                            subCategories: null,
                            file: null,
                            uploadFileName: "https://e-commerce-nextjs.s3.ap-northeast-2.amazonaws.com/category/c8024893-26dc-42ff-905c-e2bd2276a91e_3ca0b8b0-c89a-4ef9-9225-5224d8b51c87_476b12cf1a3623bc4cd2060495bef990 (1).jpg",
                            uploadFileKey: "category/c8024893-26dc-42ff-905c-e2bd2276a91e_3ca0b8b0-c89a-4ef9-9225-5224d8b51c87_476b12cf1a3623bc4cd2060495bef990 (1).jpg"
                        }
                    ],
                    file: null,
                    uploadFileName: "https://e-commerce-nextjs.s3.ap-northeast-2.amazonaws.com/category/7b3db926-43a1-4ac2-84bf-cd72428f82d2_ë¤í¨2_ë³µì¬ë³¸-001.png",
                    uploadFileKey: "category/7b3db926-43a1-4ac2-84bf-cd72428f82d2_ë¤í¨2_ë³µì¬ë³¸-001.png"
                },
                {
                    cno: 66,
                    cname: "3번째 카테고리",
                    cdesc: "ㅇㅋㅋㅋ",
                    delFlag: false,
                    parentCategoryId: null,
                    subCategories: null,
                    file: null,
                    uploadFileName: "https://e-commerce-nextjs.s3.ap-northeast-2.amazonaws.com/category/b044f9e7-55a4-4a93-8daf-09f088ced748_3ca0b8b0-c89a-4ef9-9225-5224d8b51c87_476b12cf1a3623bc4cd2060495bef990 (2).jpg",
                    uploadFileKey: "category/b044f9e7-55a4-4a93-8daf-09f088ced748_3ca0b8b0-c89a-4ef9-9225-5224d8b51c87_476b12cf1a3623bc4cd2060495bef990 (2).jpg"
                }
            ]
    };
