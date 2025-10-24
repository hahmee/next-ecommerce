export type SortOption = {
  name: string;
  href: string;
  current: boolean;
};

export type FilterOption = {
  value: string;
  label: string;
  hexCode?: string;
  checked: boolean;
};

export type FilterSection = {
  id: string;
  name: string;
  options: FilterOption[];
};
