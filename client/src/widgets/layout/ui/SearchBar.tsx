// src/widgets/layout/ui/SearchBar.tsx

// src/widgets/layout/ui/SearchBar.tsx

'use client';

import { useSearchBar } from '@/widgets/layout/model/useSearchBar';
import { SearchBarView } from '@/widgets/layout/ui/SearchBarView';

export default function SearchBar() {
  const { searchQuery, setSearchQuery, submit } = useSearchBar();
  return <SearchBarView searchQuery={searchQuery} onChange={setSearchQuery} onSubmit={submit} />;
}
