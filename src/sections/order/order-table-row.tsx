import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import MenuList from '@mui/material/MenuList';
import Collapse from '@mui/material/Collapse';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';

import {useBoolean} from 'src/hooks/use-boolean';

import {fCurrency} from 'src/utils/format-number';
import {fDate, fTime} from 'src/utils/format-time';

import {Label} from 'src/components/label';
import {Iconify} from 'src/components/iconify';
import {CustomPopover, usePopover} from 'src/components/custom-popover';

import {useApiFetchProductImageUrls} from "../products-v2/etsy/useApi";

import type {FinanceSheet} from "./etsy/etsy-utils";
import type {Transaction} from "./etsy/etsy-api.types";

// ----------------------------------------------------------------------

type Props = {
    row: FinanceSheet;
    selected: boolean;
    onViewRow: () => void;
    onSelectRow: () => void;
};

export function OrderTableRow({row, selected, onViewRow, onSelectRow}: Props) {
    const confirm = useBoolean();

    const collapse = useBoolean();

    const popover = usePopover();

    const {productImageUrls} = useApiFetchProductImageUrls(row.shopReceipt.transactions);

    function getTotalQuantity(transactions: Array<Transaction>) {
        return transactions.reduce((total, transaction) => total + transaction.quantity, 0);
    }

    const renderPrimary = (
        <TableRow hover selected={selected}>
            <TableCell padding="checkbox">
                <Checkbox
                    checked={selected}
                    onClick={onSelectRow}
                    inputProps={{id: `row-checkbox-${row.shopReceipt.receipt_id}`, 'aria-label': `Row checkbox`}}
                />
            </TableCell>

            <TableCell>
                <Link color="inherit" onClick={onViewRow} underline="always" sx={{cursor: 'pointer'}}>
                    {row.shopReceipt.receipt_id}
                </Link>
            </TableCell>

            <TableCell>
                <Stack spacing={2} direction="row" alignItems="center">
                    <Avatar alt={`${row.firstName} ${row.middleName} ${row.lastName}`} src={row.avatarUrl}/>

                    <Stack sx={{typography: 'body2', flex: '1 1 auto', alignItems: 'flex-start'}}>
                        <Box component="span">{`${row.firstName} ${row.middleName} ${row.lastName}`}</Box>
                        <Box component="span" sx={{color: 'text.disabled'}}>
                            {row.shopReceipt.buyer_email}
                        </Box>
                    </Stack>
                </Stack>
            </TableCell>

            <TableCell>
                <ListItemText
                    primary={fDate(row.shopReceipt.created_timestamp)}
                    secondary={fTime(row.shopReceipt.created_timestamp)}
                    primaryTypographyProps={{typography: 'body2', noWrap: true}}
                    secondaryTypographyProps={{mt: 0.5, component: 'span', typography: 'caption'}}
                />
            </TableCell>

            <TableCell> {fCurrency(row.subTotal)} </TableCell>
            <TableCell> {fCurrency(row.netProfit)} </TableCell>

            <TableCell align="center"> {getTotalQuantity(row.shopReceipt.transactions as Transaction[])} </TableCell>

            <TableCell>
                <Label
                    variant="soft"
                    color={
                        (row.shopReceipt.status.toLowerCase() === 'completed' && 'success') ||
                        (row.shopReceipt.status.toLowerCase() === 'fully refunded' && 'warning') ||
                        (row.shopReceipt.status.toLowerCase() === 'canceled' && 'error') ||
                        'default'
                    }
                >
                    {row.shopReceipt.status}
                </Label>
            </TableCell>

            <TableCell align="right" sx={{px: 1, whiteSpace: 'nowrap'}}>
                <IconButton
                    color={collapse.value ? 'inherit' : 'default'}
                    onClick={collapse.onToggle}
                    sx={{...(collapse.value && {bgcolor: 'action.hover'})}}
                >
                    <Iconify icon="eva:arrow-ios-downward-fill"/>
                </IconButton>

                <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
                    <Iconify icon="eva:more-vertical-fill"/>
                </IconButton>
            </TableCell>
        </TableRow>
    );

    const renderSecondary = (
        <TableRow>
            <TableCell sx={{p: 0, border: 'none'}} colSpan={9}>
                <Collapse
                    in={collapse.value}
                    timeout="auto"
                    unmountOnExit
                    sx={{bgcolor: 'background.neutral'}}
                >
                    <Paper sx={{m: 1.5}}>
                        {row.shopReceipt.transactions.map((item: Transaction) => (
                            <Stack
                                key={item.product_id}
                                direction="row"
                                alignItems="center"
                                sx={{
                                    p: (theme) => theme.spacing(1.5, 2, 1.5, 1.5),
                                    '&:not(:last-of-type)': {
                                        borderBottom: (theme) => `solid 2px ${theme.vars.palette.background.neutral}`,
                                    },
                                }}
                            >
                                <Avatar
                                    src={productImageUrls[item.transaction_id] || ''}
                                    variant="rounded"
                                    sx={{width: 48, height: 48, mr: 2}}
                                />

                                <ListItemText
                                    primary={item.title}
                                    secondary={item.sku}
                                    primaryTypographyProps={{typography: 'body2'}}
                                    secondaryTypographyProps={{component: 'span', color: 'text.disabled', mt: 0.5}}
                                />

                                <div>x{item.quantity} </div>

                                <Box
                                    sx={{width: 110, textAlign: 'right'}}>{fCurrency(item.price.amount, {currency: item.price.currency_code})}</Box>
                            </Stack>
                        ))}
                    </Paper>
                </Collapse>
            </TableCell>
        </TableRow>
    );

    return (
        <>
            {renderPrimary}

            {renderSecondary}

            <CustomPopover
                open={popover.open}
                anchorEl={popover.anchorEl}
                onClose={popover.onClose}
                slotProps={{arrow: {placement: 'right-top'}}}
            >
                <MenuList>
                    <MenuItem
                        onClick={() => {
                            confirm.onTrue();
                            popover.onClose();
                        }}
                        sx={{color: 'error.main'}}
                    >
                        <Iconify icon="solar:trash-bin-trash-bold"/>
                        Delete
                    </MenuItem>

                    <MenuItem
                        onClick={() => {
                            onViewRow();
                            popover.onClose();
                        }}
                    >
                        <Iconify icon="solar:eye-bold"/>
                        View
                    </MenuItem>
                </MenuList>
            </CustomPopover>
        </>
    );
}
