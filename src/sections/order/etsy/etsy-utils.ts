import type {ShopReceipt} from "./etsy-api.types";
import type { ShopWithUserId } from './useApi.js';

export const createFinanceSheet = (data: ShopReceipt[]): FinanceSheet[] =>
  data.map((item, index) => {
    const nameSplit = item.name ? item.name.split(' ') : null;
    const productQuantity =
      item?.transactions.length > 0
        ? item.transactions.reduce((acc, curr) => acc + (curr as { quantity: number }).quantity, 0)
        : null;

    const formatDate = (timestampInSeconds: number) => {
      const timestampInMilliseconds = timestampInSeconds * 1000;
      const date = new Date(timestampInMilliseconds);
      return date.toLocaleDateString();
    };

    const financeSheet: FinanceSheet = {
      firstName: nameSplit ? nameSplit[0] : '',
      middleName: nameSplit ? (nameSplit.length > 2 ? nameSplit[1] : '') : '',
      lastName: nameSplit ? (nameSplit.length > 2 ? nameSplit[2] : nameSplit[1]) : '',
      orderDate: formatDate(item.created_timestamp),
      itemPrice: item?.total_price?.amount ? item.total_price.amount / 100 : 0,
      discount: item?.discount_amt?.amount ? item.discount_amt.amount / 100 : 0,
      subTotal: item?.subtotal?.amount ? item.subtotal.amount / 100 : 0,
      totalShippingCost: item?.total_shipping_cost?.amount
        ? item.total_shipping_cost.amount / 100
        : 0,
      tax: item?.total_tax_cost?.amount ? item.total_tax_cost.amount / 100 : 0,
      total: item?.grandtotal?.amount ? item.grandtotal.amount / 100 : 0,
      transactionFees: item?.subtotal?.amount ? item.subtotal.amount * 0.00065 : 0,
      tfVAT: item?.subtotal?.amount ? item.subtotal.amount * 0.00065 * 0.2 : 0,
      processingFees: item?.grandtotal?.amount ? item.grandtotal.amount * 0.0004 + 0.3 : 0,
      pfVAT: item?.grandtotal?.amount ? item.grandtotal.amount * 0.00008 + 0.06 : 0,
      listingFee: productQuantity ? productQuantity * 0.18 : 0,
      lfVAT: productQuantity ? productQuantity * 0.04 : 0,
      shippingFee: item?.total_shipping_cost?.amount
        ? item.total_shipping_cost.amount * 0.00065
        : 0,
      sfVAT: item?.total_shipping_cost?.amount
        ? item.total_shipping_cost.amount * 0.00065 * 0.2
        : 0,
      shopReceipt: item,
      // TODO: find other solution
      avatarUrl: `/assets/images/avatars/avatar_${index + 1}.jpg`,
      netProfit: 0,
    };

    const netProfit =
        (financeSheet.subTotal ?? 0) +
        (financeSheet.totalShippingCost ?? 0) -
        (financeSheet.transactionFees ?? 0) -
        (financeSheet.tfVAT ?? 0) -
        (financeSheet.processingFees ?? 0) -
        (financeSheet.pfVAT ?? 0) -
        (financeSheet.listingFee ?? 0) -
        (financeSheet.lfVAT ?? 0) -
        (financeSheet.shippingFee ?? 0) -
        (financeSheet.sfVAT ?? 0);

    // TODO(Question): is it possible that the value is invalid or other than number?
    if (netProfit !== null) {
      financeSheet.netProfit = netProfit;
    }
    return financeSheet;
  });

export type FinanceSheet = {
  firstName: string;
  middleName: string;
  lastName: string;
  orderDate: string;
  itemPrice: number;
  discount: number;
  subTotal: number;
  totalShippingCost: number;
  tax: number;
  total: number;
  transactionFees: number;
  tfVAT: number;
  processingFees: number;
  pfVAT: number;
  listingFee: number;
  lfVAT: number;
  shippingFee: number;
  sfVAT: number;
  shopReceipt: ShopReceipt;
  avatarUrl: string;
  netProfit: number;
};

export type Shop = {
  icon?: string;
  name?: string;
  url?: string;
  shop_id: number;
};

export type UserData = {
  user: ShopWithUserId;
  data: FinanceSheet;
};
