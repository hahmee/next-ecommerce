import React from 'react';

import CategoryEditModal from '@/app/(admin)/@modal/(.)edit-category/[id]/page';
import CategoryPage from '@/app/(admin)/admin/category/page';

interface Props {
  params: { id: string };
}

export default function EditCategoryPage({ params }: Props) {
  return (
    <>
      <CategoryPage />
      <CategoryEditModal params={params} />
    </>
  );
}
