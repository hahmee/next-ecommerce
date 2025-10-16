import React from 'react';

import CategoryAddModal from '@/app/(admin)/@modal/(.)add-category/[id]/page';
import CategoryPage from '@/app/(admin)/admin/category/page';

interface Props {
  params: { id: string };
}
export default function AddCategoryPage({ params }: Props) {
  return (
    <>
      <CategoryPage />
      <CategoryAddModal params={params} />
    </>
  );
}
