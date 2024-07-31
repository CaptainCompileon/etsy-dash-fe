'use client';

import type { IOrderTableFilters} from 'src/types/order';

import React, {useCallback} from 'react';

import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Stack from "@mui/material/Stack";
import Tooltip from '@mui/material/Tooltip';
import Divider from "@mui/material/Divider";
import {useTheme} from "@mui/material/styles";
import TableBody from '@mui/material/TableBody';
import IconButton from '@mui/material/IconButton';

import {paths} from 'src/routes/paths';
import {useRouter} from 'src/routes/hooks';

import {useBoolean} from 'src/hooks/use-boolean';
import {useSetState} from 'src/hooks/use-set-state';

import {sumBy} from 'src/utils/helper';
import {fIsAfter, fIsBetween} from 'src/utils/format-time';

import {varAlpha} from 'src/theme/styles';
import {DashboardContent} from 'src/layouts/dashboard';

import {Label} from 'src/components/label';
import {Iconify} from 'src/components/iconify';
import {Scrollbar} from 'src/components/scrollbar';
import {CustomBreadcrumbs} from 'src/components/custom-breadcrumbs';
import {
    useTable,
    emptyRows,
    rowInPage,
    TableNoData,
    getComparator,
    TableEmptyRows,
    TableHeadCustom,
    TableSelectedAction,
    TablePaginationCustom,
} from 'src/components/table';

import {OrderAnalytic} from "../order-analytic";
import {OrderTableRow} from '../order-table-row';
import {useApiShopReceiptsMock} from "../etsy/useApi";
import {OrderTableToolbar} from '../order-table-toolbar';
import {STATUSES, STATUS_OPTIONS} from '../etsy/etsy-api.types';
import {OrderTableFiltersResult} from '../order-table-filters-result';

import type {FinanceSheet} from "../etsy/etsy-utils";
import type {Status, StatusOption} from '../etsy/etsy-api.types';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
    { id: 'shopReceipt.receipt_id', label: 'Order', width: 88},
    {id: 'shopReceipt.name', label: 'Customer'},
    {id: 'shopReceipt.created_timestamp', label: 'Date', width: 140},
    { id: 'subTotal', label: 'Subtotal' },
    { id: 'netProfit', label: 'Net profit' },
    {
        id: 'totalQuantity',
        label: 'Items',
        width: 120,
        align: 'center',
    },
    {id: 'status', label: 'Status', width: 110},
    {id: '', width: 88},
];

// ----------------------------------------------------------------------

export function OrderListView() {
    const theme = useTheme();

    const table = useTable({defaultOrderBy: 'orderNumber'});

    const router = useRouter();

    const confirm = useBoolean();

    const {financeSheets} = useApiShopReceiptsMock()

    // const [tableData, setTableData] = useState<FinanceSheet[]>(financeSheets);

    const filters = useSetState<IOrderTableFilters>({
        name: '',
        status: 'all',
        startDate: null,
        endDate: null,
    });

    const dateError = fIsAfter(filters.state.startDate, filters.state.endDate);

    const dataFiltered = applyFilter({
        inputData: financeSheets,
        comparator: getComparator(table.order, table.orderBy),
        filters: filters.state,
        dateError,
    });

    const dataInPage = rowInPage(dataFiltered, table.page, table.rowsPerPage);

    const canReset =
        !!filters.state.name ||
        filters.state.status !== 'all' ||
        (!!filters.state.startDate && !!filters.state.endDate);

    const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;

    const handleViewRow = useCallback(
        (id: string) => {
            router.push(paths.dashboard.order.details(id));
        },
        [router]
    );

    const handleFilterStatus = useCallback(
        (_: React.SyntheticEvent, newValue: Status) => {
            table.onResetPage();
            filters.setState({
                status: newValue
            });
        },
        [filters, table]
    );

    const getInvoiceLength = (status: string) =>
        financeSheets.filter((item) => item.shopReceipt?.status.toLowerCase() === status).length;

    const getTotalAmount = (status: string) =>
        sumBy(
            financeSheets.filter((item) => item.shopReceipt?.status.toLowerCase() === status),
            (invoice) => (invoice.total ?? 0)
        );

    const getPercentByStatus = (status: string) =>
        (getInvoiceLength(status) / financeSheets.length) * 100;


    return (
        <DashboardContent>
                <CustomBreadcrumbs
                    heading="List"
                    links={[
                        {name: 'Dashboard', href: paths.dashboard.root},
                        {name: 'Order', href: paths.dashboard.order.root},
                        {name: 'List'},
                    ]}
                    sx={{mb: {xs: 3, md: 5}}}
                />

                <Card sx={{mb: {xs: 3, md: 5}}}>
                    <Scrollbar sx={{minHeight: 108}}>
                        <Stack
                            direction="row"
                            divider={<Divider orientation="vertical" flexItem sx={{borderStyle: 'dashed'}}/>}
                            sx={{py: 2}}
                        >
                            <OrderAnalytic
                                title="Total"
                                total={financeSheets.length}
                                percent={100}
                                price={sumBy(financeSheets, (invoice) => invoice.total)}
                                icon="solar:bill-list-bold-duotone"
                                color={theme.vars.palette.info.main}
                            />

                            <OrderAnalytic
                                title="Paid"
                                total={getInvoiceLength('paid')}
                                percent={getPercentByStatus('paid')}
                                price={getTotalAmount('paid')}
                                icon="solar:file-check-bold-duotone"
                                color={theme.vars.palette.success.main}
                            />

                            <OrderAnalytic
                                title="Pending"
                                total={getInvoiceLength('pending')}
                                percent={getPercentByStatus('pending')}
                                price={getTotalAmount('pending')}
                                icon="solar:sort-by-time-bold-duotone"
                                color={theme.vars.palette.warning.main}
                            />

                            <OrderAnalytic
                                title="Overdue"
                                total={getInvoiceLength('overdue')}
                                percent={getPercentByStatus('overdue')}
                                price={getTotalAmount('overdue')}
                                icon="solar:bell-bing-bold-duotone"
                                color={theme.vars.palette.error.main}
                            />

                            <OrderAnalytic
                                title="Draft"
                                total={getInvoiceLength('draft')}
                                percent={getPercentByStatus('draft')}
                                price={getTotalAmount('draft')}
                                icon="solar:file-corrupted-bold-duotone"
                                color={theme.vars.palette.text.secondary}
                            />
                        </Stack>
                    </Scrollbar>
                </Card>

                <Card>
                    <Tabs
                        value={filters.state.status}
                        onChange={handleFilterStatus}
                        sx={{
                            px: 2.5,
                            boxShadow: (themee) =>
                                `inset 0 -2px 0 0 ${varAlpha(themee.vars.palette.grey['500Channel'], 0.08)}`,
                        }}
                    >
                        {STATUS_OPTIONS.map((tab: StatusOption) => (
                            <Tab
                                key={tab.value}
                                iconPosition="end"
                                value={tab.value}
                                label={tab.label}
                                disabled={tab.value !== 'all' && financeSheets.filter((user) => user.shopReceipt.status.toLowerCase() === tab.value).length === 0}
                                icon={
                                    <Label
                                        variant={
                                            ((tab.value === 'all' || tab.value === filters.state.status) && 'filled') ||
                                            'soft'
                                        }
                                        color={
                                            (tab.value === 'completed' && 'success') ||
                                            (tab.value === 'fully refunded' && 'warning') ||
                                            (tab.value === 'canceled' && 'error') ||
                                            'default'
                                        }
                                    >
                                        {STATUSES.filter(item => item !== 'all').includes(tab.value)
                                            ? financeSheets.filter((user) => user.shopReceipt?.status.toLowerCase() === tab.value).length
                                            : tab.value === 'all' ? financeSheets.length : 0}
                                    </Label>
                                }
                            />
                        ))}
                    </Tabs>

                    <OrderTableToolbar
                        filters={filters}
                        onResetPage={table.onResetPage}
                        dateError={dateError}
                    />

                    {canReset && (
                        <OrderTableFiltersResult
                            filters={filters}
                            totalResults={dataFiltered.length}
                            onResetPage={table.onResetPage}
                            sx={{p: 2.5, pt: 0}}
                        />
                    )}

                    <Box sx={{position: 'relative'}}>
                        <TableSelectedAction
                            dense={table.dense}
                            numSelected={table.selected.length}
                            rowCount={dataFiltered.length}
                            onSelectAllRows={(checked) =>
                                table.onSelectAllRows(
                                    checked,
                                    dataFiltered.map((row) => row.shopReceipt.receipt_id.toString())
                                )
                            }
                            action={
                                <Tooltip title="Delete">
                                    <IconButton color="primary" onClick={confirm.onTrue}>
                                        <Iconify icon="solar:trash-bin-trash-bold"/>
                                    </IconButton>
                                </Tooltip>
                            }
                        />

                        <Scrollbar sx={{minHeight: 444}}>
                            <Table size={table.dense ? 'small' : 'medium'} sx={{minWidth: 960}}>
                                <TableHeadCustom
                                    order={table.order}
                                    orderBy={table.orderBy}
                                    headLabel={TABLE_HEAD}
                                    rowCount={dataFiltered.length}
                                    numSelected={table.selected.length}
                                    onSort={table.onSort}
                                    onSelectAllRows={(checked) =>
                                        table.onSelectAllRows(
                                            checked,
                                            dataFiltered.map((row) => row.shopReceipt.receipt_id.toString())
                                        )
                                    }
                                />

                                <TableBody>
                                    {dataFiltered
                                        .slice(
                                            table.page * table.rowsPerPage,
                                            table.page * table.rowsPerPage + table.rowsPerPage
                                        )
                                        .map((row) => (
                                            <OrderTableRow
                                                key={row.shopReceipt.receipt_id}
                                                row={row}
                                                selected={table.selected.includes(row.shopReceipt.receipt_id.toString())}
                                                onSelectRow={() => table.onSelectRow(row.shopReceipt.receipt_id.toString())}
                                                onViewRow={() => handleViewRow(row.shopReceipt.receipt_id.toString())}
                                            />
                                        ))}

                                    <TableEmptyRows
                                        height={table.dense ? 56 : 56 + 20}
                                        emptyRows={emptyRows(table.page, table.rowsPerPage, dataFiltered.length)}
                                    />

                                    <TableNoData notFound={notFound}/>
                                </TableBody>
                            </Table>
                        </Scrollbar>
                    </Box>

                    <TablePaginationCustom
                        page={table.page}
                        dense={table.dense}
                        count={dataFiltered.length}
                        rowsPerPage={table.rowsPerPage}
                        onPageChange={table.onChangePage}
                        onChangeDense={table.onChangeDense}
                        onRowsPerPageChange={table.onChangeRowsPerPage}
                    />
                </Card>
            </DashboardContent>
    );
}

// ----------------------------------------------------------------------

type ApplyFilterProps = {
    dateError: boolean;
    inputData: FinanceSheet[];
    filters: IOrderTableFilters;
    comparator: (a: any, b: any) => number;
};

function applyFilter({inputData, comparator, filters, dateError}: ApplyFilterProps) {
    const {status, name, startDate, endDate} = filters;

    const stabilizedThis = inputData.map((el, index) => [el, index] as const);

    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });

    inputData = stabilizedThis.map((el) => el[0]);

    if (name) {
        inputData = inputData.filter(
            (order) =>
                order.shopReceipt?.receipt_id.toString().toLowerCase().indexOf(name.toLowerCase()) !== -1 ||
                order.lastName?.toLowerCase().indexOf(name.toLowerCase()) !== -1 ||
                order.firstName?.toLowerCase().indexOf(name.toLowerCase()) !== -1
        );
    }

    if (status !== 'all') {
        inputData = inputData.filter((order) => order.shopReceipt?.status.toLowerCase() === status);
    }

    if (!dateError) {
        if (startDate && endDate) {
            inputData = inputData.filter((order) => fIsBetween(order.orderDate, startDate, endDate));
        }
    }

    return inputData;
}
