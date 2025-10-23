// src/pages/admin/category/edit-category/ui/edit-category-page.tsx


import React from 'react';
import {CategoryPage} from "@/pages/admin/category";
import {CategoryEditModalPage} from "@/pages/admin/category/modal/edit-category";



export function EditCategoryPage({ id }: {id: string}) {
  return (
    <>
      <CategoryPage />
      <CategoryEditModalPage id={id}  />
    </>
  );
}
