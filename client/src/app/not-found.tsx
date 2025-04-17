import Link from "next/link";

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-black2 text-center p-6">
            <h1 className="text-6xl font-bold text-red-600 mb-4">404</h1>
            <p className="text-xl text-white mb-4">이 페이지는 존재하지 않습니다.</p>
            <Link
                href="/"
                className="text-lg text-white hover:text-blue-700 transition-all duration-200"
            >
                홈으로 돌아가기
            </Link>
        </div>
    );
}
