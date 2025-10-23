// app/(admin)/admin/page.tsx
import { redirect } from 'next/navigation';

export default function Page() {
  redirect('/admin/products');
}
