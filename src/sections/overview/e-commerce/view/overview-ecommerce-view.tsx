'use client';

import { useMemo } from 'react';

import Button from '@mui/material/Button';
import { useTheme } from '@mui/material/styles';
import Grid from '@mui/material/Unstable_Grid2';

import { DashboardContent } from 'src/layouts/dashboard';
import { MotivationIllustration } from 'src/assets/illustrations';
import {
  _ecommerceNewProducts,
  _ecommerceSalesOverview,
  _ecommerceLatestProducts,
} from 'src/_mock';

import { useMockedUser } from 'src/auth/hooks';

import { EcommerceWelcome } from '../ecommerce-welcome';
import { EcommerceNewProducts } from '../ecommerce-new-products';
import { EcommerceYearlySales } from '../ecommerce-yearly-sales';
import { useApiShopReceiptsMock } from "../../../order/etsy/useApi";
import { EcommerceSaleByGender } from '../ecommerce-sale-by-gender';
import { EcommerceSalesOverview } from '../ecommerce-sales-overview';
import { EcommerceWidgetSummary } from '../ecommerce-widget-summary';
import { EcommerceLatestProducts } from '../ecommerce-latest-products';

import type { FinanceSheet } from '../../../order/etsy/etsy-utils';
// import type { ShopReceipt } from "../../../order/etsy/etsy-api.types";


const calculateRevenue = (orders: FinanceSheet[]): number => orders.reduce((total, order) => total + (order.shopReceipt?.grandtotal?.amount ?? 0) / (order.shopReceipt?.grandtotal?.divisor ?? 1), 0);

const calculateSales = (orders: FinanceSheet[]): number => orders.length;

// const calculateProfit = (orders: FinanceSheet[]): number => orders.reduce((total, order) => total + order.netProfit, 0);

const extractMonthlyData = (orders: FinanceSheet[]) => {
  const monthlyData = orders.reduce((acc, order) => {
    const date = new Date(order.orderDate);
    const month = date.toLocaleString('default', { month: 'short' });

    if (!acc[month]) {
      acc[month] = { revenue: 0, sales: 0, profit: 0 };
    }

    const amount = order.shopReceipt?.grandtotal?.amount ?? 0;
    const divisor = order.shopReceipt?.grandtotal?.divisor ?? 1;
    const revenue = amount / divisor;
    const profit = order.netProfit ?? 0;

    acc[month].revenue += revenue;
    acc[month].sales += 1;
    acc[month].profit += profit;

    return acc;
  }, {} as Record<string, { revenue: number; sales: number; profit: number }>);

  const categories = Object.keys(monthlyData);
  const revenueSeries = categories.map((month) => monthlyData[month].revenue);
  const salesSeries = categories.map((month) => monthlyData[month].sales);
  const profitSeries = categories.map((month) => monthlyData[month].profit);

  return { categories, revenueSeries, salesSeries, profitSeries };
};
// ----------------------------------------------------------------------


export function OverviewEcommerceView() {
  const { user } = useMockedUser();

  const theme = useTheme();

  const { financeSheets } = useApiShopReceiptsMock();

  console.log("PRETEBA",financeSheets);

  const totalRevenue = useMemo(() => calculateRevenue(financeSheets), [financeSheets]);
  const totalSales = useMemo(() => calculateSales(financeSheets), [financeSheets]);
  // const totalProfit = useMemo(() => calculateProfit(financeSheets), [financeSheets]);

  const { categories, revenueSeries, salesSeries, profitSeries } = useMemo(
    () => extractMonthlyData(financeSheets),
    [financeSheets]
  );


  return (
    <DashboardContent maxWidth="xl">
      <Grid container spacing={3}>
        <Grid xs={12} md={8}>
          <EcommerceWelcome
            title={`Congratulations 🎉  \n ${user?.displayName}`}
            description="Best seller of the month you have done 57.6% more sales today."
            img={<MotivationIllustration hideBackground />}
            action={
              <Button variant="contained" color="primary">
                Go now
              </Button>
            }
          />
        </Grid>

        <Grid xs={12} md={4}>
          <EcommerceNewProducts list={_ecommerceNewProducts} />
        </Grid>

        <Grid xs={12} md={4}>
          <EcommerceWidgetSummary
            title="Revenue"
            percent={2.6}
            total={totalRevenue}
            chart={{
              colors: [theme.vars.palette.warning.light, theme.vars.palette.warning.main],
              categories,
              series: revenueSeries,
            }}
          />
        </Grid>

        <Grid xs={12} md={4}>
          <EcommerceWidgetSummary
            title="Sales"
            percent={-0.1}
            total={totalSales}
            chart={{
              colors: [theme.vars.palette.warning.light, theme.vars.palette.warning.main],
              categories,
              series: salesSeries,
            }}
          />
        </Grid>

        <Grid xs={12} md={4}>
          <EcommerceWidgetSummary
            title="totalProfit"
            percent={0.6}
            total={4876}
            chart={{
              colors: [theme.vars.palette.error.light, theme.vars.palette.error.main],
              categories,
              series: profitSeries,
            }}
          />
        </Grid>

          <Grid xs={12} md={6} lg={8}>
            <EcommerceYearlySales
              title="Sales Overview"
              subheader="(+43%) than last year"
              chart={{
                categories: [
                  'Jan',
                  'Feb',
                  'Mar',
                  'Apr',
                  'May',
                  'Jun',
                  'Jul',
                  'Aug',
                  'Sep',
                  'Oct',
                  'Nov',
                  'Dec',
                ],
                series: [
                  {
                    name: '2022',
                    data: [
                      {
                        name: 'Revenue',
                        data: [10, 41, 35, 51, 49, 62, 69, 91, 148, 35, 51, 49],
                      },
                      {
                        name: 'Profit',
                        data: [10, 34, 13, 56, 77, 88, 99, 77, 45, 13, 56, 77],
                      },
                    ],
                  },
                  {
                    name: '2023',
                    data: [
                      {
                        name: 'Total income',
                        data: [51, 35, 41, 10, 91, 69, 62, 148, 91, 69, 62, 49],
                      },
                      {
                        name: 'Total expenses',
                        data: [56, 13, 34, 10, 77, 99, 88, 45, 77, 99, 88, 77],
                      },
                    ],
                  },
                ],
              }}
            />
          </Grid>

        <Grid xs={12} md={6} lg={4} display="grid">
          <EcommerceLatestProducts title="Etsy Timeline" list={_ecommerceLatestProducts} />
        </Grid>

        <Grid xs={12} md={6} lg={4} display="grid">
          <EcommerceSaleByGender
            title="Users Geogeraphy"
            total={2324}
            chart={{
              series: [
                { label: 'Mens', value: 25 },
                { label: 'Womens', value: 50 },
                { label: 'Kids', value: 75 },
              ],
            }}
          />
        </Grid>

        <Grid xs={12} md={6} lg={8} display="grid">
          <EcommerceSalesOverview title="Sales overview" data={_ecommerceSalesOverview} />
        </Grid>
      </Grid>
    </DashboardContent>
  );
}

