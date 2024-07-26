'use client';

import type { ValueType } from 'rsuite/DateRangePicker';

import { useState } from 'react';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';

import TableNoData from '../table-no-data';
import UserTableRow from '../user-table-row';
import UserTableHead from '../user-table-head';
import TableEmptyRows from '../table-empty-rows';
import UserTableToolbar from '../user-table-toolbar';
import { useApiShopReceiptsMock } from '../etsy/useApi';
import { emptyRows, applyFilter, getComparator } from '../utils';

import type { Transaction } from '../etsy/etsy-api.types';

// ----------------------------------------------------------------------

export default function ProductsV2View() {
  const { userData } = useApiShopReceiptsMock();

  const [dateRange, setDateRange] = useState<null | ValueType>(null);

  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [selected, setSelected] = useState<number[]>([]);

  const [orderBy, setOrderBy] = useState('name');

  const [filterName, setFilterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [statuses, setStatuses] = useState([]);

  const handleStatusesChange = (event, newStatuses) => {
    setPage(0);
    setStatuses(newStatuses);
  };

  const handledateRangeChange = (dateRange) => {
    setPage(0);
    setDateRange(dateRange);
  };

  const headLabel = [
    { id: 'shopReceipt.receipt_id', label: 'Order' },
    { id: 'shopReceipt.name', label: 'Customer' },
    { id: 'shopReceipt.created_timestamp', label: 'Date' },
    { id: 'subTotal', label: 'Subtotal' },
    { id: 'netProfit', label: 'Net profit' },
    { id: 'shopReceipt.status', label: 'Status' },
    { id: '' },
    { id: 'n' },
  ];

  const handleSort = (event, id) => {
    const isAsc = orderBy === id && order === 'asc';
    if (id !== '') {
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(id);
    }
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelectedIds = userData.flatMap(({ data }) =>
        data.map((data2) => data2?.shopReceipt.receipt_id)
      );
      setSelected(newSelectedIds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, receipt_id) => {
    const selectedIndex = selected.indexOf(receipt_id);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, receipt_id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const handleFilterByName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  const dataFiltered = applyFilter({
    inputData: userData.flatMap((item) => item.data.map((d) => ({ ...d, user: item.user }))),
    comparator: getComparator(order, orderBy),
    filterName,
    statuses,
    // dateRange,
  });

  const notFound = !dataFiltered.length && !!filterName;

  return (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">Products</Typography>

        <Button variant="contained" color="inherit" startIcon={<Iconify icon="eva:plus-fill" />}>
          New User
        </Button>
      </Stack>

      <Card>
        <UserTableToolbar
          numSelected={selected.length}
          filterName={filterName}
          onFilterName={handleFilterByName}
          statuses={statuses}
          onStatusesChange={handleStatusesChange}
          // dateRange={dateRange}
          // onDateRangeChange={handledateRangeChange}
        />

        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 800 }}>
              <UserTableHead
                order={order}
                orderBy={orderBy}
                rowCount={dataFiltered.length}
                numSelected={selected.length}
                onRequestSort={handleSort}
                onSelectAllClick={handleSelectAllClick}
                headLabel={headLabel}
              />
              <TableBody>
                {dataFiltered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(
                  (row: {
                    shopReceipt: {
                      receipt_id: number;
                      name: string;
                      status: string;
                      transactions: Transaction[];
                    };
                    orderDate: string;
                    subTotal: number;
                    netProfit: number;
                    avatarUrl: string;
                  }) => {
                    console.log('row', row);
                    return (
                      <UserTableRow
                        key={row.shopReceipt.receipt_id}
                        orderId={row.shopReceipt.receipt_id}
                        customer={row.shopReceipt.name}
                        date={row.orderDate}
                        subtotal={row.subTotal}
                        netProfit={row.netProfit}
                        status={row.shopReceipt.status}
                        avatarUrl={row.avatarUrl}
                        items={row.shopReceipt.transactions}
                        selected={selected.indexOf(row.shopReceipt.receipt_id) !== -1}
                        handleClick={(event) => handleClick(event, row.shopReceipt.receipt_id)}
                      />
                    );
                  }
                )}

                <TableEmptyRows
                  height={77}
                  emptyRows={emptyRows(page, rowsPerPage, dataFiltered.length)}
                />

                {notFound && <TableNoData query={filterName} />}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <TablePagination
          page={page}
          component="div"
          count={dataFiltered.length}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Card>
    </Container>
  );
}
