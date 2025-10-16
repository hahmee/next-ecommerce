import React from 'react';

import CategoryEditModal from "@/pages/(admin)/@modal/(.)edit-category/[id]";
import CategoryPage from "@/pages/(admin)/admin/category";


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
