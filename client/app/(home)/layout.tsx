// app/(home)/layout.tsx
import { Footer, Navbar } from '@/widgets/layout';

export default function HomeLayout({
                                     children,
                                     modal,            // ★ 추가
                                   }: {
  children: React.ReactNode;
  modal: React.ReactNode; // ★ 타입 명시
}) {
  return (
    <>
      <Navbar />
      {children}
      {modal ?? null}
      <Footer />
    </>
  );
}
