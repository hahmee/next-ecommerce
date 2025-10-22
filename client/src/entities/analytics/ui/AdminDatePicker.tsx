// src/entities/analytics/ui/AdminDatePicker.tsx

﻿// src/entities/analytics/ui/AdminDatePicker.tsx

import dayjs from 'dayjs';
import React from 'react';
import Datepicker from 'react-tailwindcss-datepicker';
import { DateType, DateValueType } from 'react-tailwindcss-datepicker/dist/types';

import { DatepickType } from '@/shared/model/DatepickType';

const AdminDatePicker = ({
  date,
  dateChange,
  maxDate,
}: {
  date: DatepickType;
  dateChange: (value: DateValueType) => void;
  maxDate?: DateType;
}) => {
  const value = {
    startDate: dayjs(date.startDate).toDate(),
    endDate: dayjs(date.endDate).toDate(),
  };

  return (
    <Datepicker
      value={value}
      onChange={(value) => dateChange(value)}
      showShortcuts
      maxDate={maxDate}
    />
  );
};

export default AdminDatePicker;
