//
// 'use client';
//
// import { useUserStore } from "@/store/userStore";
// import { toast } from "react-hot-toast";
// import { useRouter } from "next/navigation";
//
// // 클라이언트에서 직접 실행할 logout 함수 (hooks처럼 사용)
// export const useLogout = () => {
//   const resetUser = useUserStore((s) => s.resetUser);
//   const router = useRouter();
//
//   const logout = async () => {
//     try {
//       const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/member/logout`, {
//         method: "POST",
//         credentials: "include",
//       });
//
//       if (!response.ok) throw new Error();
//
//       resetUser(); // 상태 초기화
//       toast.success("로그아웃되었습니다.");
//       router.replace("/login"); // 로그인 페이지로 이동
//     } catch (e) {
//       toast.error("로그아웃에 실패했습니다.");
//     }
//   };
//
//   return logout;
// };
