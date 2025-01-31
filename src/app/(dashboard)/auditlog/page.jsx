'use client'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Card from '@mui/material/Card'
import React, { useEffect, useState } from 'react'
import api from '@/api_helper/api'
import { useTranslation } from 'react-i18next'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import ServerSidePaginatedCustomTable from '@components/Table/ServerSidePaginatedCustomTable'

export default function AuditLogsPage() {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [totalCount, setTotalCount] = useState(0)
  const { t } = useTranslation('common')

  const fetchData = async (currentPage, currentPageSize) => {
    setLoading(true)
    try {
      const response = await api.get(`/AuditLogs?page=${currentPage}&pageSize=${currentPageSize}`)
      setRows(response.data.logs)
      setTotalCount(response.data.totalCount)
    } catch (err) {
      console.error('Error fetching audit logs:', err)
      toast.error(t('Error fetching audit logs'))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData(page, pageSize)
  }, [page, pageSize])

  const columns = [
    { id: 'id', label: 'ID' },
    { id: 'timestamp', label: 'Timestamp',
      render: row => new Date(row.timestamp).toLocaleString()
    },
    { id: 'userName', label: 'User' },
    { id: 'actionType', label: 'Action' },
    { id: 'requestPath', label: 'Request Path' },
    { id: 'httpMethod', label: 'Method' },
    { id: 'ipAddress', label: 'IP Address' },
    { id: 'statusCode', label: 'Status' },
    {
      id: 'userAgent',
      label: 'User Agent',
      render: row => (
        <div style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {row.userAgent}
        </div>
      )
    }
  ]

  const handlePageChange = (newPage) => {
    setPage(newPage)
  }

  const handlePageSizeChange = (newPageSize) => {
    setPageSize(newPageSize)
    setPage(1)
  }

  return (
    <>
      <ToastContainer position='top-right' autoClose={3000} hideProgressBar={false} closeOnClick pauseOnHover />

      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Typography variant='h4'>{t('Audit Logs')}</Typography>
        </Grid>
        <Grid item xs={12}>
          <Card>
            <ServerSidePaginatedCustomTable
              rows={rows}
              columns={columns}
              totalCount={totalCount}
              page={page}
              pageSize={pageSize}
              onPageChange={handlePageChange}
              onPageSizeChange={handlePageSizeChange}
              loading={loading}
            />
          </Card>
        </Grid>
      </Grid>
    </>
  )
}
