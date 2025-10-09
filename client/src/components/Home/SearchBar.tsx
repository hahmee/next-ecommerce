'use client';

import { useSearchBar } from '@/hooks/useSearchBar';
import { SearchBarView } from './SearchBarView';

export default function SearchBar() {
  const { searchQuery, setSearchQuery, submit } = useSearchBar();
  return (
    <SearchBarView
      searchQuery={searchQuery}
      onChange={setSearchQuery}
      onSubmit={submit}
    />
  );
}
