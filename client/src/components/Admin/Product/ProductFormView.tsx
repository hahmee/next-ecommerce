'use client';

import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb';
import ImageUploadForm from '@/components/Admin/Product/ImageUploadForm';
import MultiSelect from '@/components/Admin/Product/MultiSelect';
import BackButton from '@/components/Admin/Product/BackButton';
import ColorSelector from '@/components/Admin/Product/ColorSelector';
import RadioButton from '@/components/Admin/Product/RadioButton';
import QuillEditor from '@/components/Admin/Product/QuillEditor';
import CategorySelect from '@/components/Admin/Product/CategorySelect';
import Link from 'next/link';
import { sizeOptions, salesOptions } from './presets';
import { Mode } from '@/types/mode';
import type { Category } from '@/interface/Category';
import type { Product } from '@/interface/Product';

export function ProductFormView(props: {
  type: Mode;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  quillRef: any;
  pdesc: string;
  setPdesc: (v: string) => void;
  categories: Category[];
  categoryPaths: Category[];
  setLeafCategory: (c: Category | null) => void;
  original?: Product;
  submitting: boolean;
}) {
  const {
    type,
    onSubmit,
    quillRef,
    pdesc,
    categories,
    categoryPaths,
    setLeafCategory,
    original,
    submitting,
  } = props;

  return (
    <form onSubmit={onSubmit} data-testid="product-form">
      <div className="mx-auto">
        <Breadcrumb pageName={type === Mode.ADD ? '제품 등록' : '제품 수정'} />
        <div className="mb-6 flex gap-3 justify-end sm:flex-row">
          <BackButton />
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center rounded justify-center gap-2.5 bg-primary-700 px-8 py-3 text-center font-medium text-white hover:bg-opacity-90 lg:px-6 xl:px-8 disabled:opacity-60"
          >
            {type === Mode.ADD ? '저장하기' : '수정하기'}
          </button>
        </div>

        <div className="grid grid-cols-1 gap-9">
          {/* 카테고리 */}
          <section className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <header className="flex justify-between border-b border-stroke px-6.5 py-4 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white">카테고리</h3>
              <Link href="/admin/category" className="underline text-sm">카테고리 추가/변경</Link>
            </header>
            <div className="p-6.5 mb-6">
              <CategorySelect
                categories={categories}
                setSelectedCategory={setLeafCategory}
                categoryPaths={categoryPaths}
              />
            </div>
          </section>

          {/* 이미지 */}
          <section className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <header className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white">이미지</h3>
            </header>
            <div className="p-6.5"><ImageUploadForm /></div>
          </section>

          {/* 기본정보 */}
          <section className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <header className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white">기본정보</h3>
            </header>
            <div className="p-6.5">
              <div className="mb-4.5">
                <label className="mb-3 block text-sm font-medium">상품명 <span className="text-meta-1">*</span></label>
                <input
                  name="pname" required defaultValue={original?.pname ?? ''}
                  placeholder="상품명을 입력해주세요."
                  className="w-full rounded border-[1.5px] px-5 py-3"
                />
              </div>

              <div className="mb-4.5">
                <label className="mb-3 block text-sm font-medium">판매상태 <span className="text-meta-1">*</span></label>
                <RadioButton name="salesStatus" options={salesOptions} originalData={original?.salesStatus} />
              </div>

              <div className="mb-4.5">
                <label className="mb-3 block text-sm font-medium">판매 가격 <span className="text-meta-1">*</span></label>
                <input
                  type="number" name="price" required defaultValue={original?.price ?? ''}
                  placeholder="판매가격을 입력해주세요." className="w-full rounded border-[1.5px] px-5 py-3"
                />
              </div>

              <div className="mb-6">
                <label className="mb-3 block text-sm font-medium">SKU <span className="text-meta-1">*</span></label>
                <input
                  name="sku" required defaultValue={original?.sku ?? ''}
                  placeholder="SKU를 입력해주세요." className="w-full rounded border-[1.5px] px-5 py-3"
                />
              </div>
            </div>
          </section>

          {/* 옵션정보 */}
          <section className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <header className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white">옵션정보</h3>
            </header>
            <div className="p-6.5">
              <div className="mb-4.5">
                <MultiSelect
                  label="사이즈"
                  optionList={sizeOptions}
                  id="multiSizeSelect"
                  name="sizeList"
                  defaultOption="사이즈를 선택해주세요."
                  originalData={original?.sizeList}
                />
              </div>
              <div className="mb-4.5">
                <ColorSelector label="컬러" defaultOption="컬러를 선택해주세요." originalData={original?.colorList}/>
              </div>
            </div>
          </section>

          {/* 상세 */}
          <section className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <header className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white">상품 상세</h3>
            </header>
            <div className="p-6.5">
              <div className="mb-6">
                <label className="mb-3 block text-sm font-medium">상품 설명 <span className="text-meta-1">*</span></label>
                <QuillEditor quillRef={quillRef} originalData={pdesc} />
              </div>

              <div className="mb-6">
                <label className="mb-3 block text-sm font-medium">환불 정책</label>
                <textarea name="refundPolicy" rows={3} required defaultValue={original?.refundPolicy ?? ''} className="w-full rounded border-[1.5px] px-5 py-3"/>
              </div>

              <div className="mb-6">
                <label className="mb-3 block text-sm font-medium">교환 정책</label>
                <textarea name="changePolicy" rows={3} required defaultValue={original?.changePolicy ?? ''} className="w-full rounded border-[1.5px] px-5 py-3"/>
              </div>
            </div>
          </section>
        </div>
      </div>
    </form>
  );
}
