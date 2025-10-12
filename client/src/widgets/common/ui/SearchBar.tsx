'use client';

import { SearchBarView } from '@/components/Home/Search/SearchBarView';
import { useSearchBar } from '@/hooks/home/search/useSearchBar';

export default function SearchBar() {
  const { searchQuery, setSearchQuery, submit } = useSearchBar();
  return <SearchBarView searchQuery={searchQuery} onChange={setSearchQuery} onSubmit={submit} />;
}
