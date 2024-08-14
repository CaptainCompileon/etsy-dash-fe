import type { CardProps } from '@mui/material/Card';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import { useTheme } from '@mui/material/styles';

import { useTabs } from 'src/hooks/use-tabs';

import { fPercent, fCurrency } from 'src/utils/format-number';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { Chart, useChart } from 'src/components/chart';
import { CustomTabs } from 'src/components/custom-tabs';

import { BookingCheckInWidgets } from '../booking/booking-check-in-widgets';

// ----------------------------------------------------------------------

const TABS = [
  {
    value: 'income',
    label: 'Income',
    percent: 78.2,
    total: 9990,
    chart: { series: [{ data: [5, 31, 33, 50, 100, 76, 72, 76, 89] }] },
  },
  {
    value: 'expenses',
    label: 'Expenses',
    percent: -33.6,
    total: 1989,
    chart: { series: [{ data: [10, 41, 35, 51, 49, 62, 69, 91, 148] }] },
  },
];

export function BankingOverview({ sx, ...other }: CardProps) {
  const theme = useTheme();

  const tabs = useTabs('income');

  const chartColors =
    tabs.value === 'income' ? [theme.palette.primary.light] : [theme.palette.warning.light];

  const chartOptions = useChart({
    colors: chartColors,
    xaxis: { categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'] },
    stroke: { width: 3 },
    tooltip: {
      y: { formatter: (value: number) => fCurrency(value), title: { formatter: () => '' } },
    },
  });

  const renderBalance = (
    <Box sx={{ flexGrow: 1 }}>
      <Box
        sx={{
          mb: 1,
          gap: 0.5,
          display: 'flex',
          alignItems: 'center',
          color: 'text.secondary',
          typography: 'subtitle2',
        }}
      >
        Total balance
        <Tooltip title="Vestibulum ullamcorper mauris">
          <Iconify width={16} icon="eva:info-outline" sx={{ color: 'text.disabled' }} />
        </Tooltip>
      </Box>
      <Box sx={{ typography: 'h3' }}>{fCurrency(49990)}</Box>
    </Box>
  );

  const renderActions = (
    <Box sx={{ gap: 1, display: 'flex' }}>
      <Button
        variant="soft"
        size="small"
        startIcon={<Iconify width={16} icon="eva:arrow-upward-fill" />}
      >
        Send
      </Button>
      <Button
        variant="soft"
        size="small"
        startIcon={<Iconify width={16} icon="mingcute:add-line" />}
      >
        Add card
      </Button>
      <Button
        variant="soft"
        size="small"
        startIcon={<Iconify width={16} icon="eva:arrow-downward-fill" />}
      >
        Request
      </Button>
    </Box>
  );

  const renderTabs = (
    <CustomTabs
      value={tabs.value}
      onChange={tabs.onChange}
      variant="fullWidth"
      sx={{ my: 3, borderRadius: 2, p:1, mx:0}}
      slotProps={{
        indicator: { borderRadius: 1.5, boxShadow: theme.customShadows.z4 },
        tab: { p: 1},
      }}
    >
      {TABS.map((tab) => {
        const isNegative = tab.percent < 0;

        // Angle calculations
        const startAngle = isNegative ? 360 - (Math.abs(tab.percent) * 360) / 100 : 0; // Start at 0° for positive values
        const endAngle = isNegative
          ? (tab.percent * 360) / 100 // End at the percentage-based angle for positive values
          : 360; // End at 360° for negative values

        const startColor = isNegative ? theme.palette.warning.light : theme.palette.primary.light;
        const endColor = isNegative ? theme.palette.error.main : theme.palette.success.main;

        return (
          <Tab
            key={tab.value}
            value={tab.value}
            label={
              <Box
                sx={{
                  width: 1,
                  display: 'flex',
                  gap: { xs: 1, md: 2.5 },
                  flexDirection: { xs: 'column', md: 'row' },
                  alignItems: { xs: 'center', md: 'flex-start' },
                }}
              >
                <Box sx={{ position: 'relative', width: 140, height: 140 }}>
                  <Chart
                    type="radialBar"
                    series={[Math.abs(tab.percent)]}
                    options={{
                      ...chartOptions,
                      chart: {
                        sparkline: { enabled: true },
                      },
                      plotOptions: {
                        radialBar: {
                          startAngle,
                          endAngle,
                          inverseOrder: true,
                          hollow: {
                            size: '60%',
                          },
                          track: {
                            background: theme.palette.background.neutral,
                            strokeWidth: '100%',
                            startAngle: 1,
                            endAngle: 0, 
                          },
                          dataLabels: {
                            name: { show: false },
                            value: {
                              offsetY: 6,
                              fontSize: theme.typography.subtitle2.fontSize as string,
                              fontWeight: theme.typography.subtitle2.fontWeight,
                              color: theme.palette.text.primary,
                              formatter: (val: number) => `${tab.percent}%`,
                            },
                          },
                        },
                      },
                      fill: {
                        type: 'gradient',
                        gradient: {
                          shade: 'dark',
                          type: 'circle',
                          shadeIntensity: 0.5,
                          gradientToColors: [endColor],
                          inverseColors: false,
                          opacityFrom: 1,
                          opacityTo: 1,
                          stops: [0, 100],
                        },
                      },
                      stroke: {
                        lineCap: 'round',
                        dashArray: 0,
                      },
                      colors: [startColor],
                    }}
                    width="100%"
                    height="100%"
                  />
                </Box>

                <div>
                  <Box
                    sx={{
                      mb: 1,
                      gap: 0.5  ,
                      display: 'flex',
                      alignItems: 'center',
                      typography: 'subtitle2',
                    }}
                  >
                    {tab.label}
                    <Tooltip title={tab.label} placement="top">
                      <Iconify width={16} icon="eva:info-outline" sx={{ color: 'text.disabled' }} />
                    </Tooltip>
                  </Box>

                  <Box sx={{ typography: 'h4' }}>{fCurrency(tab.total)}</Box>
                </div>

                <Label
                  color={isNegative ? 'error' : 'success'}
                  startIcon={
                    <Iconify
                      width={24}
                      icon={
                        isNegative
                          ? 'solar:double-alt-arrow-down-bold-duotone'
                          : 'solar:double-alt-arrow-up-bold-duotone'
                      }
                    />
                  }
                  sx={{ top: 8, right: 8, position: { md: 'absolute' } }}
                >
                  {fPercent(tab.percent)}
                </Label>
              </Box>
            }
          />
        );
      })}
    </CustomTabs>
  );

  return (
    <Card sx={{ p: 3, ...sx }} {...other}>
      <Box
        sx={{
          gap: 2,
          display: 'flex',
          alignItems: 'flex-start',
          flexDirection: { xs: 'column', md: 'row' },
        }}
      >
        {renderBalance}
        {renderActions}
      </Box>

      {renderTabs}

      <Chart
        type="line"
        series={tabs.value === 'income' ? TABS[0].chart.series : TABS[1].chart.series}
        options={chartOptions}
        height={270}
      />
    </Card>
  );
}
