'use client';

import { useSearchBar } from '@/widgets/layout';
import { SearchBarView } from '@/widgets/layout';

export function SearchBar() {
  const { searchQuery, setSearchQuery, submit } = useSearchBar();
  return <SearchBarView searchQuery={searchQuery} onChange={setSearchQuery} onSubmit={submit} />;
}
