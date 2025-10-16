import React from 'react';
import CategoryPage from "@/pages/(admin)/admin/category";
import CategoryEditModal from "@/pages/(admin)/@modal/(.)edit-category/[id]";


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
