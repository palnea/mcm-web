import React, { useMemo, useState } from 'react'
import { Box, Card, CardContent, FormControl, Grid, MenuItem, Select, TextField, Typography } from '@mui/material'
import { ArrowBack } from '@mui/icons-material'
import CustomTable from '../../../../components/Table/CustomTable'
import IconButton from '@mui/material/IconButton'
import { useRouter } from 'next/navigation'

const SupportTrackerDialogContent = ({ tickets, t }) => {
  const [timeFilter, setTimeFilter] = useState('all')
  const [startDate, setStartDate] = useState(
    !!tickets && tickets.length > 0 ? tickets.slice(-1)[0].createdDate?.toISOString().split('T')[0] : ''
  )
  const [endDate, setEndDate] = useState(
    !!tickets && tickets.length > 0 ? tickets[0].createdDate?.toISOString().split('T')[0] : ''
  )
  const router = useRouter()

  const filteredTickets = useMemo(() => {
    let result = tickets

    // Date range filter
    if (startDate || endDate) {
      result = result.filter(ticket => {
        const ticketDate = new Date(ticket.createdDate)
        const start = startDate ? new Date(startDate) : null
        const end = endDate ? new Date(endDate) : null

        if (start && end) return ticketDate >= start && ticketDate <= end
        if (start) return ticketDate >= start
        if (end) return ticketDate <= end
        return true
      })
    }

    return result
  }, [tickets, startDate, endDate])

  const columns = [
    {
      id: 'id',
      label: t('Ticket ID')
    },
    {
      id: 'createdDate',
      label: t('Created Date'),
      render: row => new Date(row.createdDate).toLocaleDateString()
    },
    {
      id: 'status',
      label: t('Status'),
      render: row => (row.closeTime ? t('Closed') : t('Open'))
    },
    {
      id: 'assignedTo',
      label: t('Assigned To'),
      render: row => row.assignedToUserId
    }
  ]

  const statusSummary = useMemo(() => {
    return {
      total: filteredTickets.length,
      open: filteredTickets.filter(t => !t.closeTime).length,
      closed: filteredTickets.filter(t => t.closeTime).length
    }
  }, [filteredTickets])

  const onPeriodChange = event => {
    const newTimeFilter = event.target.value
    setTimeFilter(event.target.value)
    const now = new Date()
    if (newTimeFilter === 'week') {
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
      setStartDate(weekAgo.toISOString().split('T')[0])
      setEndDate(now.toISOString().split('T')[0])
    } else if (newTimeFilter === 'month') {
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
      setStartDate(monthAgo.toISOString().split('T')[0])
      setEndDate(now.toISOString().split('T')[0])
    } else {
      setStartDate(!!tickets && tickets.length > 0 ? tickets.slice(-1)[0].createdDate?.toISOString().split('T')[0] : '')
      setEndDate(!!tickets && tickets.length > 0 ? tickets[0].createdDate?.toISOString().split('T')[0] : '')
    }
  }

  return (
    <>
      <IconButton onClick={() => router.back()} sx={{ mr: 2 }}>
        <ArrowBack />
      </IconButton>
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={6} alignItems='center'>
            <Grid item xs={12} sm={4}>
              <Box sx={{ display: 'flex', gap: 4 }}>
                <Typography variant='h6'>
                  {t('Total Tickets')}: {statusSummary.total}
                </Typography>
                <Typography variant='h6'>
                  {t('Open')}: {statusSummary.open}
                </Typography>
                <Typography variant='h6'>
                  {t('Closed')}: {statusSummary.closed}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={3}>
              <FormControl fullWidth variant='standard'>
                <Select value={timeFilter} onChange={onPeriodChange} variant={'standard'}>
                  <MenuItem value='week'>{t('Last Week')}</MenuItem>
                  <MenuItem value='month'>{t('Last Month')}</MenuItem>
                  <MenuItem value='all'>{t('All Time')}</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={2}>
              <TextField
                label={t('Start Date')}
                type='date'
                value={startDate}
                onChange={e => setStartDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
                fullWidth
                variant='standard'
                inputProps={{ max: endDate || undefined }}
                sx={{ minWidth: '120px' }}
              />
            </Grid>
            <Grid item xs={12} sm={2}>
              <TextField
                label={t('End Date')}
                type='date'
                value={endDate}
                onChange={e => setEndDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
                fullWidth
                variant='standard'
                inputProps={{ min: startDate || undefined }}
                sx={{ minWidth: '120px', mx: '20px' }}
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <CustomTable rows={filteredTickets} columns={columns} />
    </>
  )
}

export default SupportTrackerDialogContent
