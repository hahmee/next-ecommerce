// src/widgets/admin/table-kit/ui/TableAddButton.tsx

import Link from 'next/link';

const TableAddButton = ({
  content,
  location,
  ariaLabel = '',
}: {
  content: string;
  location: string;
  ariaLabel?: string;
}) => {
  return (
    <Link href={location}>
      <button
        aria-label={ariaLabel}
        type="button"
        className="w-full flex items-center justify-center text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-primary-600 dark:hover:bg-primary-700 focus:outline-none dark:focus:ring-primary-800"
      >
        <svg
          className="h-3.5 w-3.5 mr-2"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            clipRule="evenodd"
            fillRule="evenodd"
            d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
          />
        </svg>
        {content}
      </button>
    </Link>
  );
};
export default TableAddButton;
