import type { ChangeEvent } from 'react';
import type { IconButtonProps } from '@mui/material/IconButton';

import { useState } from 'react';

import Stack from '@mui/material/Stack';
import { Collapse } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Popover from '@mui/material/Popover';
import Checkbox from '@mui/material/Checkbox';
import MenuItem from '@mui/material/MenuItem';
import { styled } from '@mui/material/styles';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import CurrencyFormatter from 'src/components/currency-formatter/currency-formatter';

import TransactionList from './transaction-list';

import type { Transaction } from './etsy/etsy-api.types';

// ----------------------------------------------------------------------
interface ExpandMoreProps extends IconButtonProps {
  expand: boolean;
}

export const ExpandMore = styled((props: ExpandMoreProps) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));

interface UserTableRowProps {
  selected: boolean;
  orderId: number;
  customer: string;
  date: string;
  items: Transaction[];
  subtotal: number;
  netProfit: number;
  status: string;
  avatarUrl: string;
  handleClick: (event: ChangeEvent<HTMLInputElement>, checked: boolean) => void;
}
export default function UserTableRow({
  selected,
  orderId,
  customer,
  date,
  items,
  subtotal,
  netProfit,
  status,
  avatarUrl,
  handleClick,
}: UserTableRowProps) {
  const [open, setOpen] = useState<null | Element>(null);
  const [expanded, setExpanded] = useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const handleOpenMenu = (event: Event) => {
    setOpen(event?.currentTarget as Element);
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };

  return (
    <>
      <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox disableRipple checked={selected} onChange={handleClick} />
        </TableCell>

        <TableCell>{orderId.toString()}</TableCell>

        <TableCell component="th" scope="row" padding="none">
          <Stack direction="row" alignItems="center" spacing={2}>
            <Avatar alt={customer} src={avatarUrl} />
            <Typography variant="subtitle2" noWrap>
              {customer}
            </Typography>
          </Stack>
        </TableCell>

        <TableCell>{date}</TableCell>
        <TableCell>
          <CurrencyFormatter value={subtotal} currency={items[0].price.currency_code} />
        </TableCell>
        <TableCell>
          <CurrencyFormatter
            value={Number(netProfit.toFixed(2))}
            currency={items[0].price.currency_code}
          />
        </TableCell>

        <TableCell>
          <Label
            color={
              (status === 'cancelled' && 'error') ||
              (status === 'pending' && 'warning') ||
              'success'
            }
          >
            {status}
          </Label>
        </TableCell>
        <TableCell>
          <ExpandMore
            expand={expanded}
            onClick={handleExpandClick}
            aria-expanded={expanded}
            aria-label="show more"
          >
            <Iconify icon="eva:arrow-ios-downward-outline" />
          </ExpandMore>
        </TableCell>

        <TableCell align="right">
          <IconButton onClick={handleOpenMenu}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      <Popover
        open={!!open}
        anchorEl={open}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        slotProps={{
          paper: {
            sx: { width: 140 },
          },
        }}
      >
        <MenuItem onClick={handleCloseMenu}>
          <Iconify icon="eva:edit-fill" sx={{ mr: 2 }} />
          Edit
        </MenuItem>

        <MenuItem onClick={handleCloseMenu} sx={{ color: 'error.main' }}>
          <Iconify icon="eva:trash-2-outline" sx={{ mr: 2 }} />
          Delete
        </MenuItem>
      </Popover>
      {/* Collapsible section */}
      <TableRow>
        <TableCell sx={{ p: 0 }} colSpan={9}>
          <Collapse in={expanded} timeout="auto" unmountOnExit>
            <TransactionList items={items} />
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}
