import { useState, useEffect } from 'react';

import { fetchShopListingMock } from './etsy-api';
import { createFinanceSheet } from './etsy-utils';

import type { Shop, UserData, FinanceSheet } from './etsy-utils';
import type { ShopReceipt, Transaction, EtsyApiResponse } from './etsy-api.types';

export type ShopWithUserId = Shop & { user_id?: number };
// TODO(Adam): Throwing errors like this is in general not a good practice,
// we could create some Provider who will handle these errors and show a toast
// or something similar to the user
export function useApiShopReceipts(
  apiUrl = process.env.API_URL || 'http://localhost:3003' // Default URL if environment variable not set
) {
  const [userData, setUserData] = useState<
    { user: { shop_id: number; user_id: number }; data: FinanceSheet }[]
  >([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<unknown | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const users: { shop_id: number; user_id: number }[] = await fetch(`${apiUrl}/users`).then(
          (res) => res.json()
        );

        if (!users || users.length === 0) {
          throw new Error('No users found');
        }

        const allData: {
          user: { shop_id: number; user_id: number };
          data: FinanceSheet;
        }[] = [];

        for (const user of users) {
          const response = await fetch(
            `${apiUrl}/users/${user.user_id}/shops/${user.shop_id}/receipts`
          );

          if (!response.ok) {
            throw new Error('Failed to fetch data');
          }
          const json: EtsyApiResponse<ShopReceipt> = await response.json();
          // console.log('fetching data', json);
          const results: ShopReceipt[] = json?.results ? json?.results : [];
          const financeSheet = createFinanceSheet(results);
          allData.push({ user, data: financeSheet });
        }

        setUserData(allData);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    }

    fetchData();

    return () => {
      // Cleanup function if needed
    };
  }, [apiUrl]);

  return { userData, loading, error };
}

export function useApiShop(
  apiUrl = process.env.API_URL || 'http://localhost:3003' // Default URL if environment variable not set
) {
  const [shops, setShops] = useState<ShopWithUserId[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<unknown | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const users: { shop_id: number; user_id: number }[] = await fetch(`${apiUrl}/users`).then(
          (res) => res.json()
        );

        if (!users || users.length === 0) {
          throw new Error('No users found');
        }

        const fetchedShops: ShopWithUserId[] = [];
        for (const user of users) {
          const response = await fetch(`${apiUrl}/shops/${user.shop_id}`);
          if (!response.ok) {
            throw new Error('Failed to fetch data');
          }
          const shop: ShopWithUserId = await response.json();
          shop.user_id = Number(user.user_id);
          fetchedShops.push(shop);
        }
        setShops(fetchedShops);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    }

    fetchData();

    return () => {
      // Cleanup function if needed
    };
  }, [apiUrl]);

  const deleteShop = (userId: number) => {
    const newShops = shops.filter((shop) => shop.user_id !== userId);
    setShops(newShops);
  };

  return { shops, loading, error, deleteShop };
}

export function getShopLoginLink(
  apiUrl = process.env.API_URL || 'http://localhost:3003' // Default URL if environment variable not set
) {
  const [error, setError] = useState<unknown | null>(null);

  const fetchShopLink = async function () {
    try {
      const response = await fetch(`${apiUrl}/genLink`);
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }

      const result: string = await response.text();
      console.log(result);
      return result;
    } catch (error) {
      setError(error);
    }
  };

  return { fetchShopLink, error };
}

export function useApiShopReceiptsMock() {
  const [userData, setoUserData] = useState<UserData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchDataMock() {
      try {
        const response = await fetchShopListingMock();
        const results = response?.results ? response?.results : [];
        const financeSheet = createFinanceSheet(results);
        const uData: UserData[] = [
          {
            user: { shop_id: 1, user_id: 2 },
            data: financeSheet,
          },
        ];
        setoUserData(uData);
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    }

    fetchDataMock();

    return () => {
      // Cleanup function if needed
    };
  }, []);

  return { userData, loading };
}

export function useDeleteUserById(apiUrl = process.env.API_URL || 'http://localhost:3003') {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<unknown | null>(null);

  const deleteUser = async (userId: number) => {
    setLoading(true);
    try {
      console.log('Deleting user', userId);
      const response = await fetch(`${apiUrl}/users/${userId}/delete`, {
        method: 'GET',
      });
      // TODO: I dont think this is needed as we dont do any special error handling
      // on BE, for this to run we would need to use special 2xx status codes (and we dont)
      // If you get something else than 2xx status in response it will automatically
      // redirect to catch block. I would delete this block if it is not needed.
      // What do you think?
      if (!response.ok) {
        throw new Error('Failed to delete user');
      }

      setLoading(false);
    } catch (error) {
      setError(error);
      setLoading(false);
    }
  };

  return { deleteUser, loading, error };
}

export function useApiFetchProductImageUrls(
  items: Transaction[],
  apiUrl = process.env.API_URL || 'http://localhost:3003'
) {
  const [productImageUrls, setProductImageUrls] = useState<{ [key: number]: string }>([]);

  useEffect(() => {
    // Function to fetch avatar URL for each item
    const fetchProductImageUrls = async () => {
      try {
        const productImageUrlsCopy = { ...productImageUrls };

        for (const item of items) {
          const response = await fetch(
            `${apiUrl}/users/${item.seller_user_id}/listings/${item.listing_id}/images/${item.listing_image_id}`
          );
          const data = await response.json();

          productImageUrlsCopy[item.transaction_id] = data['url_75x75' || 'url_170x135'];
        }

        setProductImageUrls(productImageUrlsCopy);
      } catch (error) {
        console.error('Error fetching avatar URLs:', error);
      }
    };

    fetchProductImageUrls();
  }, [items]);

  return { productImageUrls };
}
