'use client';

import { Paging } from '@/entities/order';

export const PageComponent = ({
  pagingData,
  size,
  search,
  changePage,
}: {
  pagingData: Paging;
  size: number;
  search: string;
  changePage: (page: number) => void;
}) => {
  if (pagingData.totalCount < size) {
    return null;
  }

  return (
    <>
      <div className="flex flex-1 justify-between sm:hidden">
        {pagingData.current > 1 ? (
          <span
            className="relative inline-flex items-center rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-500 dark:text-gray-50 dark:hover:bg-gray-700"
            onClick={() => changePage(pagingData.current - 1)}
          >
            이전
          </span>
        ) : (
          <span className="cursor-not-allowed opacity-40 relative ml-3 inline-flex items-center rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 dark:border-gray-500 dark:text-gray-50">
            이전
          </span>
        )}

        {pagingData.current < pagingData.totalPage ? (
          <span
            className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-500 dark:text-gray-50 dark:hover:bg-gray-700"
            onClick={() => changePage(pagingData.current + 1)}
          >
            다음
          </span>
        ) : (
          <span className="cursor-not-allowed opacity-40 relative ml-3 inline-flex items-center rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 dark:border-gray-500 dark:text-gray-50">
            다음
          </span>
        )}
      </div>

      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-gray-700 dark:text-gray-200">
            Showing <span className="font-medium">{pagingData.current}</span> to{' '}
            <span className="font-medium">{pagingData.totalPage}</span> of{' '}
            <span className="font-medium">{pagingData.totalCount}</span> results
          </p>
        </div>
        <div>
          <nav
            aria-label="Pagination"
            className="isolate inline-flex -space-x-px rounded-md dark:border-gray-500 dark:text-gray-50 dark:hover:bg-gray-700"
          >
            {pagingData.prevPage ? (
              <div
                className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                onClick={() => changePage(pagingData.prevPage)}
              >
                <span className="sr-only">Previous</span>
                <svg
                  className="w-5 h-5"
                  aria-hidden="true"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            ) : (
              <div className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0  ">
                <span className="sr-only">Previous</span>
                <svg
                  className="w-5 h-5"
                  aria-hidden="true"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            )}
            {pagingData?.pageNumList?.map((num) => (
              <div
                key={num}
                className={
                  num !== pagingData.current
                    ? 'relative text-gray-500 inline-flex items-center px-4 py-2 text-sm font-semibold ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0'
                    : ' relative z-10 inline-flex items-center bg-gray-900 dark:bg-gray-400 ring-1 ring-inset ring-gray-300  bg-opacity-20 px-4 py-2 text-sm font-semibold text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
                }
                onClick={() => changePage(num)}
              >
                {num}
              </div>
            ))}
            {pagingData.next ? (
              <div
                className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                onClick={() => changePage(pagingData.nextPage)}
              >
                <span className="sr-only">Next</span>
                <svg
                  className="w-5 h-5"
                  aria-hidden="true"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            ) : (
              <div className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0">
                <span className="sr-only">Next</span>
                <svg
                  className="w-5 h-5"
                  aria-hidden="true"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            )}
          </nav>
        </div>
      </div>
    </>
  );
};

