import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import ListItemText from '@mui/material/ListItemText';

import CurrencyFormatter from 'src/components/currency-formatter/currency-formatter';

import { useApiFetchProductImageUrls } from './etsy/useApi';

import type { Transaction } from './etsy/etsy-api.types';

const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  textAlign: 'center',
  color: theme.palette.text.secondary,
  flexGrow: 1,
}));

interface TransactionListProps {
  items: Transaction[];
}

const TransactionList = ({ items }: TransactionListProps) => {
  // State to hold avatar URLs for each item
  const { productImageUrls } = useApiFetchProductImageUrls(items);
  return (
    <Stack spacing={1} sx={{ p: 1 }} marginRight="auto">
      {items &&
        items.map((item) => (
          <Item key={item.transaction_id} elevation={3} sx={{ px: 1 }}>
            <Stack
              direction="row"
              alignItems="center"
              spacing={6}
              useFlexGap
              flexWrap="wrap"
              justifyContent="space-between"
            >
              <Avatar
                alt={item.title || ''}
                src={productImageUrls[item.transaction_id] || ''}
                variant="rounded"
              />
              <ListItemText align="left">
                <Stack>
                  <Typography variant="body1" noWrap sx={{ maxWidth: '700px' }}>
                    {item.title}
                  </Typography>
                  <Typography variant="body2">{item.product_id}</Typography>
                </Stack>
              </ListItemText>
              <Typography>x{item.quantity}</Typography>
              <Typography>
                <CurrencyFormatter
                  value={item.price.amount / item.price.divisor}
                  currency={items[0].price.currency_code}
                />
              </Typography>
            </Stack>
          </Item>
        ))}
    </Stack>
  );
};

export default TransactionList;
