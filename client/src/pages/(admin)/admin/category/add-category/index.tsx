// src/pages/(admin)/admin/category/add-category/index.tsx

import CategoryAddModal from "@/pages/(admin)/@modal/(.)add-category/[id]/add-category-page";
import CategoryPage from "@/pages/(admin)/admin/category";


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
