import { Footer, Navbar } from '@/widgets/layout';

export default function HomeLayout({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
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
