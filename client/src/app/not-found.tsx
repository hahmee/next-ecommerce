import Link from 'next/link'

export default function NotFound() {
    return (
        <div>
            <h2>해당하는 페이지를 찾을 수 없습니다.</h2>
            <p>Could not find requested resource</p>
            <Link href="/">메인화면으로</Link>
        </div>
    )
}