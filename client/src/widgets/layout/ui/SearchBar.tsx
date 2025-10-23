'use client';

import { useSearchBar } from '@/widgets/layout/model/useSearchBar';
import { SearchBarView } from '@/widgets/layout/ui/SearchBarView';

export function SearchBar() {
  const { searchQuery, setSearchQuery, submit } = useSearchBar();
  return <SearchBarView searchQuery={searchQuery} onChange={setSearchQuery} onSubmit={submit} />;
}
