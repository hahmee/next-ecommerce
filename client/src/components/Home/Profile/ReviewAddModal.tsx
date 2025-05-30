"use client";

import {useQuery} from "@tanstack/react-query";
import Image from "next/image";
import {Order} from "@/interface/Order";
import {StarIcon, XMarkIcon} from "@heroicons/react/20/solid";
import React, {useState} from "react";
import {fetchJWT} from "@/utils/fetchJWT";
import {Review} from "@/interface/Review";
import {useRouter} from "next/navigation";
import {getOrder} from "@/apis/mallAPI";
import toast from "react-hot-toast";
import {unwrap} from "@/utils/unwrap";


const ReviewAddModal = ({id, orderId}:{ id: string; orderId: string;}) => {
    const [rating, setRating] = useState<number>(0);  // 선택한 별점
    const [hover, setHover] = useState<number>(0);    // 호버 중인 별점
    const [content, setContent] = useState<string>("");
    const router = useRouter();

    const {data: order, isLoading} = useQuery<Order, Object, Order>({
        queryKey: ['order', id],
        queryFn: () => getOrder({id: id}),
        staleTime: 60 * 1000,
        gcTime: 300 * 1000,
        throwOnError: true,
    });

    // 리뷰 입력 변경 처리
    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const value = e.target.value;
        setContent(value);
    };

    const closeModal = () => {

        router.push(`/order/${orderId}`);  // 모달 닫기 시 이 경로로 이동

    };

    const reviewSave = async (event: React.FormEvent) => {
        event.preventDefault();

        try {
            const reviewData: Review = {
                content: content,
                rating: rating + 1,
                orderId: orderId,
                pno: order?.productInfo.pno || 0,
                oid: Number(id),
                owner: null,
                order: null,
                createdAt: null,
                updatedAt: null
            };

            // 실패하면 여기서 throw, 성공하면 반환값 넘어감
            const res = unwrap(await fetchJWT(`/api/reviews/`, {
                method: "POST",
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(reviewData),
            }));

            toast.success("리뷰를 작성했습니다.");
            router.push(`/order/${orderId}`);  // 모달 닫기 시 이 경로로 이동

        }catch (error) {
            console.error(error);
            toast.error(`업로드 중 에러가 발생했습니다. ${(error as Error).message}`);
        }

    }

    if (!order) {
        return null;
    }

    return (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50" onClick={closeModal}>
            <div className="bg-white w-full max-w-lg p-6 rounded-lg shadow-lg" onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-end"><XMarkIcon className="w-7 h-7 cursor-pointer" onClick={closeModal}/>
                </div>
                <h2 className="text-lg font-semibold mb-4 text-center">리뷰쓰기</h2>
                <form onSubmit={reviewSave}>
                    <div className="flex items-center gap-4 mb-4">
                        <Image src={order.productInfo.thumbnailUrl} alt={"상품 대표이미지"} width={500} height={500} className="w-20 h-20 object-cover rounded-md"/>
                        <div>
                            <p className="text-gray-600 text-sm">{order?.productInfo.pname}</p>
                            <p className="text-gray-500 text-xs">{order?.productInfo.price.toLocaleString()} 원</p>
                            <p className="text-gray-500 text-xs">{order?.productInfo.qty} 개</p>
                            <p className="text-gray-500 text-xs">{order?.productInfo.size}</p>
                            <p className="text-gray-500 text-xs">{order?.productInfo.color.text}</p>
                        </div>
                    </div>

                    <div className="mb-6">
                        <p className="font-medium">별점 평가</p>
                        <div className="grid grid-cols-2 gap-4 mt-2">
                            <div>
                                <label className="text-gray-700 text-sm">별점</label>
                                <div className="flex space-x-2">
                                    {Array.from({length: 5}).map((_, star) => (
                                        <button
                                            key={star}
                                            type="button"
                                            onClick={() => setRating(star)}  // 클릭 시 별점 설정
                                            onMouseEnter={() => setHover(star)}  // 마우스가 별 위에 있을 때
                                            onMouseLeave={() => setHover(0)}     // 마우스가 별을 떠났을 때
                                        >
                                            {star <= (hover || rating) ? (
                                                <StarIcon className="w-9 h-9 text-ecom"/>
                                            ) : (
                                                <StarIcon className="w-9 h-9 text-gray-300"/>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>

                        </div>
                    </div>


                    <div className="mb-6">
                        <label className="block text-gray-700 font-medium mb-2">리뷰 작성</label>
                        <textarea onChange={handleInputChange} required className="w-full p-2 border rounded-md text-sm"
                                  placeholder="자세하고 솔직한 리뷰는 다른 고객에게 도움이 됩니다. (최소 10자 이상)" rows={4}></textarea>
                    </div>

                    <div className="flex">
                        <button className="w-full px-4 py-2 bg-ecom text-white rounded-md text-sm hover:bg-ecomHigh">
                            완료
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ReviewAddModal;