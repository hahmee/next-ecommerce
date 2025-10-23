import { CategoryPage } from '@/pages/admin/category';
import { CategoryAddModalPage } from '@/pages/admin/category/modal/add-category';

export function AddCategoryPage({ id }: { id: string }) {
  return (
    <>
      <CategoryPage />
      <CategoryAddModalPage id={id} />
    </>
  );
}
