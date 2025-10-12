'use client';

import { SearchBarView } from '@/widgets/common/ui/SearchBarView';
import { useSearchBar } from '@/features/common/model/useSearchBar';

export default function SearchBar() {
  const { searchQuery, setSearchQuery, submit } = useSearchBar();
  return <SearchBarView searchQuery={searchQuery} onChange={setSearchQuery} onSubmit={submit} />;
}
