// app/(admin)/@modal/(.)edit-category/[id]/page.tsx

import {EditCategoryPage} from '@/pages/admin/category/edit-category';

interface Props {
  params: { id: string };
}

export default function Page({ params }: Props) {
  return <EditCategoryPage id={params.id}/>;
}
