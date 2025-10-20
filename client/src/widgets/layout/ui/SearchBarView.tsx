// src/widgets/layout/ui/SearchBarView.tsx

'use client';

import Image from 'next/image';
import type { FormEvent } from 'react';

interface Props {
  searchQuery: string;
  onChange: (v: string) => void;
  onSubmit: (e: FormEvent) => void;
}

export function SearchBarView({ searchQuery, onChange, onSubmit }: Props) {
  return (
    <form
      className="flex items-center justify-between gap-4 bg-gray-100 p-2 rounded-md flex-1"
      onSubmit={onSubmit}
    >
      <input
        type="text"
        name="name"
        placeholder="Search"
        value={searchQuery}
        className="flex-1 bg-transparent outline-none"
        onChange={(e) => onChange(e.target.value)}
        data-testid="search-result"
      />
      <button className="cursor-pointer" type="submit">
        <Image src="/images/mall/search.png" alt="search" width={16} height={16} />
      </button>
    </form>
  );
}
