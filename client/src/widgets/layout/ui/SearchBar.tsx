'use client';

import { SearchBarView } from '@/widgets/layout/ui/SearchBarView';
import {useSearchBar} from "@/widgets/layout/model/useSearchBar";

export default function SearchBar() {
  const { searchQuery, setSearchQuery, submit } = useSearchBar();
  return <SearchBarView searchQuery={searchQuery} onChange={setSearchQuery} onSubmit={submit} />;
}
