import type { Dayjs } from 'dayjs';
import type { DateRange } from '@mui/x-date-pickers-pro';
import type { SelectChangeEvent } from '@mui/material';

import dayjs from 'dayjs';
import * as React from 'react';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DemoItem, DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// eslint-disable-next-line import/no-extraneous-dependencies
import { StaticDateRangePicker } from '@mui/x-date-pickers-pro/StaticDateRangePicker';
import { Box, Select, Popover, MenuItem, FormControl } from '@mui/material';
import { useRef } from 'react';

const dateRanges = {
  today: { start: () => dayjs(), end: () => dayjs() },
  yesterday: {
    start: () => dayjs().subtract(1, 'day'),
    end: () => dayjs().subtract(1, 'day'),
  },
  thisWeek: {
    start: () => dayjs().startOf('week'),
    end: () => dayjs().endOf('week'),
  },
  thisMonth: {
    start: () => dayjs().startOf('month'),
    end: () => dayjs().endOf('month'),
  },
  lastQuarter: {
    start: () => dayjs().subtract(3, 'month').startOf('quarter'),
    end: () => dayjs().subtract(3, 'month').endOf('quarter'),
  },
  thisYear: {
    start: () => dayjs().startOf('year'),
    end: () => dayjs().endOf('year'),
  },
  last7Days: { start: () => dayjs().subtract(6, 'day'), end: () => dayjs() },
  last90Days: { start: () => dayjs().subtract(89, 'day'), end: () => dayjs() },
  last365Days: {
    start: () => dayjs().subtract(364, 'day'),
    end: () => dayjs(),
  },
} as const;

type DateRangeKey = keyof typeof dateRanges;

const getMenuItemString = (value: DateRangeKey | 'custom') =>
  ({
    today: 'Today',
    yesterday: 'Yesterday',
    thisWeek: 'This week',
    thisMonth: 'This month',
    lastQuarter: 'Last quarter',
    thisYear: 'This year',
    last7Days: 'Last 7 days',
    last90Days: 'Last 90 days',
    last365Days: 'Last 365 days',
    custom: 'Custom Range',
  })[value] || 'Invalid value';

interface ResponsiveDateRangePickersProps {
  dateRange: DateRange<Dayjs>;
  selectedOption: string;
  onDateRangeChange: (newDateRange: DateRange<Dayjs>, newSelectedOption: string) => void;
}

export default function ResponsiveDateRangePickers({
    dateRange,
    selectedOption,
    onDateRangeChange,
  }: ResponsiveDateRangePickersProps) {
    const anchorRef = useRef<HTMLDivElement>(null);
    const [open, setOpen] = React.useState(false);
  
    const handleQuickSelect = (event: SelectChangeEvent<string>) => {
      const value = event.target.value as DateRangeKey | 'custom';
  
      if (value in dateRanges) {
        const { start, end } = dateRanges[value as DateRangeKey];
        onDateRangeChange([start(), end()], value);
        setOpen(false);

      } else if (value === 'custom') {
        onDateRangeChange(dateRange, 'custom');
        setOpen(true);
      }
    };
  
    const handleClose = () => {
      setOpen(false);
    };
  
    const handleDateRangeAccept = (newDateRange: DateRange<Dayjs>) => {
      onDateRangeChange(newDateRange, 'custom');
      handleClose();
    };
  
    const handleSelectClick = () => {
      if (selectedOption === 'custom') {
        setOpen(true);
      }
    };
  
    return (
    //   <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DemoContainer components={['StaticDateRangePicker']}>
          <Box sx={{ minWidth: 220 }} ref={anchorRef}>
            <FormControl fullWidth>
              <Select
                value={selectedOption}
                onChange={handleQuickSelect}
                // onClick={handleSelectClick}
                displayEmpty
              renderValue={(selected) => {
                if (selected === 'custom' && dateRange[0] && dateRange[1]) {
                  return `${dateRange[0].format(
                    'YYYY-MM-DD'
                  )} to ${dateRange[1].format('YYYY-MM-DD')}`;
                }
                return selected
                  ? getMenuItemString(selected as DateRangeKey | 'custom')
                  : 'Select date range';
              }}
            >
              <MenuItem value="" disabled>
                Select date range
              </MenuItem>
              {Object.keys(dateRanges).map((key) => (
                <MenuItem key={key} value={key}>
                  {getMenuItemString(key as DateRangeKey)}
                </MenuItem>
              ))}
              <MenuItem value="custom">Custom Range</MenuItem>
              </Select>
          </FormControl>
        </Box>
        <Popover
          open={open}
          anchorEl={anchorRef.current}
          onClose={handleClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
        >
          <StaticDateRangePicker
            value={dateRange}
            onChange={(newDateRange) => onDateRangeChange(newDateRange, 'custom')}
            onAccept={handleDateRangeAccept}
          />
        </Popover>
        <p>Selected Date Range: {dateRange[0]?.format('YYYY-MM-DD')} to {dateRange[1]?.format('YYYY-MM-DD')}</p>
      <p>Selected Option: {selectedOption}</p>
      </DemoContainer>
    // </LocalizationProvider>
  );
}