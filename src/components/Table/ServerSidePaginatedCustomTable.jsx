'use client'
import React from 'react'
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow } from '@mui/material'
import { useTranslation } from 'react-i18next'

const ServerSidePaginatedCustomTable = ({
  columns,
  rows,
  searchPlaceHolder,
  totalCount,
  page,
  pageSize,
  onPageChange,
  onPageSizeChange,
  loading = false
}) => {
  const { t } = useTranslation('common')

  // Handle page change
  const handleChangePage = (event, newPage) => {
    onPageChange(newPage + 1) // API uses 1-based indexing
  }

  // Handle rows per page change
  const handleChangeRowsPerPage = event => {
    onPageSizeChange(parseInt(event.target.value, 10))
  }

  return (
    <Paper>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              {columns.map(column => (
                <TableCell key={column.id} align={'center'}>
                  {t(column.label)}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map(row => (
              <TableRow key={row.id}>
                {columns.map(column => (
                  <TableCell key={column.id} align={'center'}>
                    {column.render ? column.render(row) : row[column.id]}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component='div'
        count={totalCount}
        page={page - 1} // Convert 1-based to 0-based for MUI
        rowsPerPage={pageSize}
        rowsPerPageOptions={[5, 10, 25, 50, 100]}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  )
}

export default ServerSidePaginatedCustomTable;
