// app/(admin)/@modal/(.)add-category/[id]/page.tsx

import { AddCategoryPage } from '@/pages/admin/category/add-category';

interface Props {
  params: { id: string };
}
export default function Page({ params }: Props) {
  return <AddCategoryPage id={params.id} />;
}
