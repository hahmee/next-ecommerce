import React from 'react';
import CategoryPage from '@/app/(admin)/admin/category/page';
import CategoryEditModal from '@/app/(admin)/@modal/(.)edit-category/[id]/page';

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
