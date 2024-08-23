import fs from 'fs';
import path from 'path';
import { faker } from '@faker-js/faker';

import type { Shop, UserData, ShopReceipt, FinanceSheet, EtsyApiData } from './etsy-api.types';

interface GenerateMockDataOptions {
  startDate?: Date;
  numDays?: number;
  numFinanceSheets?: number;
  itemPriceRange?: [number, number];
  discountRange?: [number, number];
  shippingCostRange?: [number, number];
  taxRange?: [number, number];
  transactionFeesRange?: [number, number];
  tfVATRange?: [number, number];
  processingFeesRange?: [number, number];
  pfVATRange?: [number, number];
  listingFeeRange?: [number, number];
  lfVATRange?: [number, number];
  shippingFeeRange?: [number, number];
  sfVATRange?: [number, number];
  netProfitRange?: [number, number];
  costOfGoodsRange?: [number, number];
  subTotalRange?: [number, number];
  totalPriceRange?: [number, number];
  totalShippingCostRange?: [number, number];
  totalTaxCostRange?: [number, number];
  totalVatCostRange?: [number, number];
  discountAmtRange?: [number, number];
  giftWrapPriceRange?: [number, number];
}

export function generateMockData(options: GenerateMockDataOptions = {}): EtsyApiData {
  const {
    startDate = new Date(),
    numDays = 30,
    numFinanceSheets = 5,
    itemPriceRange = [10, 100],
    discountRange = [0, 20],
    shippingCostRange = [5, 20],
    taxRange = [0, 10],
    transactionFeesRange = [1, 5],
    tfVATRange = [0, 2],
    processingFeesRange = [1, 3],
    pfVATRange = [0, 1],
    listingFeeRange = [1, 3],
    lfVATRange = [0, 1],
    shippingFeeRange = [1, 3],
    sfVATRange = [0, 1],
    netProfitRange = [10, 50],
    costOfGoodsRange = [5, 30],
    totalPriceRange = [30, 200],
    totalShippingCostRange = [5, 20],
    totalTaxCostRange = [0, 15],
    totalVatCostRange = [0, 5],
    discountAmtRange = [0, 20],
    giftWrapPriceRange = [0, 10],
  } = options;

  const users: UserData[] = [];
  const shops: Shop[] = [];
  const shopReceipts: ShopReceipt[] = [];

  for (let i = 0; i < numDays; i++) {
    const currentDate = new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000);
    const formattedOrderDate = currentDate.toISOString().slice(0, 10);

    for (let j = 0; j < numFinanceSheets; j++) {
      const shop: Shop = {
        icon: faker.internet.url(),
        name: faker.company.name(),
        url: faker.internet.url(),
        shop_id: faker.datatype.number(),
      };
      shops.push(shop);

      const financeSheet: FinanceSheet = {
        firstName: faker.name.firstName(),
        middleName: faker.name.middleName(),
        lastName: faker.name.lastName(),
        orderDate: formattedOrderDate,
        itemPrice: faker.datatype.number({ min: itemPriceRange[0], max: itemPriceRange[1] }),
        discount: faker.datatype.number({ min: discountRange[0], max: discountRange[1] }),
        subTotal: 0,
        totalShippingCost: faker.datatype.number({ min: shippingCostRange[0], max: shippingCostRange[1] }),
        tax: faker.datatype.number({ min: taxRange[0], max: taxRange[1] }),
        total: 0,
        transactionFees: faker.datatype.number({ min: transactionFeesRange[0], max: transactionFeesRange[1] }),
        tfVAT: faker.datatype.number({ min: tfVATRange[0], max: tfVATRange[1] }),
        processingFees: faker.datatype.number({ min: processingFeesRange[0], max: processingFeesRange[1] }),
        pfVAT: faker.datatype.number({ min: pfVATRange[0], max: pfVATRange[1] }),
        listingFee: faker.datatype.number({ min: listingFeeRange[0], max: listingFeeRange[1] }),
        lfVAT: faker.datatype.number({ min: lfVATRange[0], max: lfVATRange[1] }),
        shippingFee: faker.datatype.number({ min: shippingFeeRange[0], max: shippingFeeRange[1] }),
        sfVAT: faker.datatype.number({ min: sfVATRange[0], max: sfVATRange[1] }),
        shopReceipt: {
          receipt_id: faker.datatype.number(),
          receipt_type: faker.datatype.number(),
          seller_user_id: shop.shop_id,
          buyer_user_id: faker.datatype.number(),
          name: `${faker.name.firstName()} ${faker.name.lastName()}`,
          first_line: faker.address.streetAddress(),
          second_line: faker.address.secondaryAddress(),
          city: faker.address.city(),
          state: faker.address.stateAbbr(),
          zip: faker.address.zipCode(),
          status: faker.helpers.arrayElement(['paid', 'completed', 'open', 'canceled']),
          formatted_address: `${faker.address.streetAddress()}, ${faker.address.city()}, ${faker.address.stateAbbr()} ${faker.address.zipCode()}`,
          country_iso: faker.address.countryCode(),
          payment_method: faker.helpers.arrayElement([
            'cc',
            'paypal',
            'check',
            'mo',
            'bt',
            'other',
            'ideal',
            'sofort',
            'apple_pay',
            'google',
            'android_pay',
            'google_pay',
            'klarna',
            'k_pay_in_4',
            'k_pay_in_3',
            'k_financing',
          ]),
          is_paid: faker.datatype.boolean(),
          is_shipped: faker.datatype.boolean(),
          create_timestamp: currentDate.getTime(),
          created_timestamp: currentDate.getTime(),
          update_timestamp: currentDate.getTime(),
          updated_timestamp: currentDate.getTime(),
          is_gift: faker.datatype.boolean(),
          gift_message: faker.lorem.sentence(),
          gift_sender: `${faker.name.firstName()} ${faker.name.lastName()}`,


          grandtotal: {
            amount: financeSheet.total,
            divisor: 1,
            currency_code: 'USD',
            currency_formatted_short: '$',
            currency_formatted_long: 'USD',
            is_discounted: false,
            discount_formatted_short: '',
            discount_formatted_long: '',
          },
          subtotal: {
            amount: financeSheet.subTotal,
            divisor: 1,
            currency_code: 'USD',
            currency_formatted_short: '$',
            currency_formatted_long: 'USD',
            is_discounted: false,
            discount_formatted_short: '',
            discount_formatted_long: '',
          },

          total_price: {
            amount: faker.datatype.number({ min: totalPriceRange[0], max: totalPriceRange[1] }),
            divisor: 1,
            currency_code: 'USD',
            currency_formatted_short: '$',
            currency_formatted_long: 'USD',
            is_discounted: false,
            discount_formatted_short: '',
            discount_formatted_long: '',
          },
          total_shipping_cost: {
            amount: faker.datatype.number({ min: totalShippingCostRange[0], max: totalShippingCostRange[1] }),
            divisor: 1,
            currency_code: 'USD',
            currency_formatted_short: '$',
            currency_formatted_long: 'USD',
            is_discounted: false,
            discount_formatted_short: '',
            discount_formatted_long: '',
          },
          total_tax_cost: {
            amount: faker.datatype.number({ min: totalTaxCostRange[0], max: totalTaxCostRange[1] }),
            divisor: 1,
            currency_code: 'USD',
            currency_formatted_short: '$',
            currency_formatted_long: 'USD',
            is_discounted: false,
            discount_formatted_short: '',
            discount_formatted_long: '',
          },
          total_vat_cost: {
            amount: faker.datatype.number({ min: totalVatCostRange[0], max: totalVatCostRange[1] }),
            divisor: 1,
            currency_code: 'USD',
            currency_formatted_short: '$',
            currency_formatted_long: 'USD',
            is_discounted: false,
            discount_formatted_short: '',
            discount_formatted_long: '',
          },
          discount_amt: {
            amount: faker.datatype.number({ min: discountAmtRange[0], max: discountAmtRange[1] }),
            divisor: 1,
            currency_code: 'USD',
            currency_formatted_short: '$',
            currency_formatted_long: 'USD',
            is_discounted: false,
            discount_formatted_short: '',
            discount_formatted_long: '',
          },
          gift_wrap_price: {
            amount: faker.datatype.number({ min: giftWrapPriceRange[0], max: giftWrapPriceRange[1] }),
            divisor: 1,
            currency_code: 'USD',
            currency_formatted_short: '$',
            currency_formatted_long: 'USD',
            is_discounted: false,
            discount_formatted_short: '',
            discount_formatted_long: '',
          },
        },
        avatarUrl: faker.internet.url(),
        netProfit: faker.datatype.number({ min: netProfitRange[0], max: netProfitRange[1] }),
        costOfGoods: faker.datatype.number({ min: costOfGoodsRange[0], max: costOfGoodsRange[1] }),
        shipments: [],
        transactions: [],
        refundsts: [],
      };

      financeSheet.subTotal =
      financeSheet.itemPrice - financeSheet.discount + financeSheet.totalShippingCost + financeSheet.tax;
    financeSheet.total =
      financeSheet.subTotal +
      financeSheet.transactionFees +
      financeSheet.tfVAT +
      financeSheet.processingFees +
      financeSheet.pfVAT +
      financeSheet.listingFee +
      financeSheet.lfVAT +
      financeSheet.shippingFee +
      financeSheet.sfVAT;

    users.push({ user: { ...shop, user_id: shop.shop_id }, data: financeSheet });


      const shopReceipt: ShopReceipt = {
        receipt_id: faker.datatype.number(),
        receipt_type: faker.datatype.number(),
        seller_user_id: shop.shop_id,
        buyer_user_id: faker.datatype.number(),
        name: `${faker.name.firstName()} ${faker.name.lastName()}`,
        first_line: faker.address.streetAddress(),
        second_line: faker.address.secondaryAddress(),
        city: faker.address.city(),
        state: faker.address.stateAbbr(),
        zip: faker.address.zipCode(),
        status: faker.helpers.arrayElement(['paid', 'completed', 'open', 'canceled']),
        formatted_address: `${faker.address.streetAddress()}, ${faker.address.city()}, ${faker.address.stateAbbr()} ${faker.address.zipCode()}`,
        country_iso: faker.address.countryCode(),
        payment_method: faker.helpers.arrayElement([
          'cc',
          'paypal',
          'check',
          'mo',
          'bt',
          'other',
          'ideal',
          'sofort',
          'apple_pay',
          'google',
          'android_pay',
          'google_pay',
          'klarna',
          'k_pay_in_4',
          'k_pay_in_3',
          'k_financing',
        ]),
        is_paid: faker.datatype.boolean(),
        is_shipped: faker.datatype.boolean(),
        create_timestamp: currentDate.getTime(),
        created_timestamp: currentDate.getTime(),
        update_timestamp: currentDate.getTime(),
        updated_timestamp: currentDate.getTime(),
        is_gift: faker.datatype.boolean(),
        gift_message: faker.lorem.sentence(),
        gift_sender: `${faker.name.firstName()} ${faker.name.lastName()}`,


        grandtotal: {
          amount: financeSheet.total,
          divisor: 1,
          currency_code: 'USD',
          currency_formatted_short: '$',
          currency_formatted_long: 'USD',
          is_discounted: false,
          discount_formatted_short: '',
          discount_formatted_long: '',
        },
        subtotal: {
          amount: financeSheet.subTotal,
          divisor: 1,
          currency_code: 'USD',
          currency_formatted_short: '$',
          currency_formatted_long: 'USD',
          is_discounted: false,
          discount_formatted_short: '',
          discount_formatted_long: '',
        },

        total_price: {
          amount: faker.datatype.number({ min: totalPriceRange[0], max: totalPriceRange[1] }),
          divisor: 1,
          currency_code: 'USD',
          currency_formatted_short: '$',
          currency_formatted_long: 'USD',
          is_discounted: false,
          discount_formatted_short: '',
          discount_formatted_long: '',
        },
        total_shipping_cost: {
          amount: faker.datatype.number({ min: totalShippingCostRange[0], max: totalShippingCostRange[1] }),
          divisor: 1,
          currency_code: 'USD',
          currency_formatted_short: '$',
          currency_formatted_long: 'USD',
          is_discounted: false,
          discount_formatted_short: '',
          discount_formatted_long: '',
        },
        total_tax_cost: {
          amount: faker.datatype.number({ min: totalTaxCostRange[0], max: totalTaxCostRange[1] }),
          divisor: 1,
          currency_code: 'USD',
          currency_formatted_short: '$',
          currency_formatted_long: 'USD',
          is_discounted: false,
          discount_formatted_short: '',
          discount_formatted_long: '',
        },
        total_vat_cost: {
          amount: faker.datatype.number({ min: totalVatCostRange[0], max: totalVatCostRange[1] }),
          divisor: 1,
          currency_code: 'USD',
          currency_formatted_short: '$',
          currency_formatted_long: 'USD',
          is_discounted: false,
          discount_formatted_short: '',
          discount_formatted_long: '',
        },
        discount_amt: {
          amount: faker.datatype.number({ min: discountAmtRange[0], max: discountAmtRange[1] }),
          divisor: 1,
          currency_code: 'USD',
          currency_formatted_short: '$',
          currency_formatted_long: 'USD',
          is_discounted: false,
          discount_formatted_short: '',
          discount_formatted_long: '',
        },
        gift_wrap_price: {
          amount: faker.datatype.number({ min: giftWrapPriceRange[0], max: giftWrapPriceRange[1] }),
          divisor: 1,
          currency_code: 'USD',
          currency_formatted_short: '$',
          currency_formatted_long: 'USD',
          is_discounted: false,
          discount_formatted_short: '',
          discount_formatted_long: '',
        },
        shipments: [
          {
            shipping_id: faker.datatype.number(),
            shipping_date: faker.date.recent().toISOString().slice(0, 10),
            shipping_method: faker.helpers.arrayElement(['USPS', 'FedEx', 'UPS', 'DHL']),
            tracking_code: faker.random.alphaNumeric(10),
          },
        ],
        transactions: [
          {
            transaction_id: faker.datatype.number(),
            seller_user_id: 0,
            buyer_user_id: 0,
            create_timestamp: 0,
            created_timestamp: 0,
            quantity: 0,
            receipt_id: 0,
            is_digital: false,
            file_data: '',
            transaction_type: '',
            price: {
              amount: 0,
              divisor: 0,
              currency_code: ''
            },
            shipping_cost: {
              amount: 0,
              divisor: 0,
              currency_code: ''
            },
            variations: [],
            product_data: [],
            buyer_coupon: 0,
            shop_coupon: 0
          },
        ],
        refunds: [
          {
            transaction_id: 0,
            seller_user_id: 0,
            buyer_user_id: 0,
            create_timestamp: 0,
            created_timestamp: 0,
            quantity: 0,
            receipt_id: 0,
            is_digital: false,
            file_data: '',
            transaction_type: '',
            price: {
              amount: 0,
              divisor: 0,
              currency_code: ''
            },
            shipping_cost: {
              amount: 0,
              divisor: 0,
              currency_code: ''
            },
            variations: [],
            product_data: [],
            buyer_coupon: 0,
            shop_coupon: 0
          },
        ],
      };


      shopReceipts.push(shopReceipt);
    }
  }

  const apiData: EtsyApiData = {
    users,
    shops,
  };

  // Write the mock shop receipts to a file
  const mockShopReceiptsFilePath = path.join(__dirname, 'mock_shop_receiptsG.ts');
  fs.writeFileSync(
    mockShopReceiptsFilePath,
    `export const mockShopReceipts: ShopReceipt[] = ${JSON.stringify(shopReceipts, null, 2)};`
  );

  return apiData;
}
