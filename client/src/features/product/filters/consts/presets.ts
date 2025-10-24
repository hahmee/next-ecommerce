import { FilterSection } from '@/features/product/filters';
import { Size } from '@/shared/constants/size';

export const filterPresets: FilterSection[] = [
  {
    id: 'size',
    name: 'Size',
    options: [
      { value: Size.XS, label: 'XS', checked: false },
      { value: Size.S, label: 'S', checked: false },
      { value: Size.M, label: 'M', checked: false },
      { value: Size.L, label: 'L', checked: false },
      { value: Size.XL, label: 'XL', checked: false },
      { value: Size.XXL, label: '2XL', checked: false },
      { value: Size.XXXL, label: '3XL', checked: false },
      { value: Size.FREE, label: 'FREE', checked: false },
    ],
  },
  {
    id: 'category',
    name: 'Category',
    options: [
      { value: 'new-arrivals', label: 'New Arrivals', checked: false },
      { value: 'sale', label: 'Sale', checked: false },
      { value: 'travel', label: 'Travel', checked: true },
      { value: 'organization', label: 'Organization', checked: false },
      { value: 'accessories', label: 'Accessories', checked: false },
    ],
  },
  {
    id: 'color',
    name: 'Color',
    options: [
      { value: 'white', label: 'White', hexCode: '#FFFFFF', checked: false },
      { value: 'red', label: 'Red', hexCode: '#FF6961', checked: false },
      { value: 'beige', label: 'Beige', hexCode: '#F5F5DC', checked: false },
      { value: 'blue', label: 'Blue', hexCode: '#AEC6CF', checked: false },
      { value: 'brown', label: 'Brown', hexCode: '#cebaa0', checked: false },
      { value: 'green', label: 'Green', hexCode: '#77DD77', checked: false },
      { value: 'purple', label: 'Purple', hexCode: '#C3B1E1', checked: false },
    ],
  },
];
