import { useEffect, useMemo, useState } from 'react'
import { Box, Card, CardContent, CardHeader, FormControl, Grid, MenuItem, Select, Typography } from '@mui/material'
import { Cell, Pie, PieChart } from 'recharts'

const SupportTrackerWidget = ({ tickets, timeFilter, onTimeFilterChange, t }) => {
  const [openTickets, setOpenTickets] = useState(0)
  const [newTickets, setNewTickets] = useState(0)
  const [closedTickets, setClosedTickets] = useState(0)

  const fillData = () => {
    const startDate = new Date()
    if (timeFilter === 'week') {
      startDate.setDate(startDate.getDate() - 7)
    } else if (timeFilter === 'month') {
      startDate.setDate(startDate.getDate() - 30)
    }

    const filteredTickets =
      timeFilter === 'all' ? tickets : tickets.filter(ticket => new Date(ticket.createdDate) >= startDate)

    if (timeFilter !== 'all') {
      setOpenTickets(filteredTickets.filter(t => !t.closeTime).length)
      setNewTickets(filteredTickets.filter(t => new Date(t.createdDate) >= startDate).length)
      setClosedTickets(filteredTickets.filter(t => t.closeTime && new Date(t.closeTime) >= startDate).length)
    } else {
      setOpenTickets(filteredTickets.filter(t => !t.closeTime).length)
      setNewTickets(filteredTickets.length)
      setClosedTickets(filteredTickets.filter(t => t.closeTime).length)
    }
  }

  useEffect(() => {
    fillData()
  }, [tickets, timeFilter])

  const pieData = useMemo(() => {
    return [
      { name: t('Closed'), value: closedTickets },
      { name: t('Open'), value: openTickets }
    ]
  }, [openTickets, closedTickets, t])

  const completionRate = useMemo(() => {
    return openTickets + closedTickets > 0 ? (closedTickets / (openTickets + closedTickets)) * 100 : 0
  }, [openTickets, closedTickets])

  return (
    <>
      <Card sx={{ height: '100%', cursor: 'pointer' }}>
        <CardHeader
          title={t('Support Tracker')}
          action={
            <FormControl variant='standard' sx={{ minWidth: 120 }}>
              <Select
                value={timeFilter}
                onChange={e => onTimeFilterChange(e.target.value)}
                onClick={e => e.stopPropagation()}
                variant={'standard'}
              >
                <MenuItem value='week'>{t('Last Week')}</MenuItem>
                <MenuItem value='month'>{t('Last Month')}</MenuItem>
                <MenuItem value='all'>{t('All Time')}</MenuItem>
              </Select>
            </FormControl>
          }
        />
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={8}>
              <Box sx={{ mb: 2 }}>
                <Typography variant='h6' color='text.secondary'>
                  {t('New Tickets')}
                </Typography>
                <Typography variant='h4'>{newTickets}</Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant='h6' color='text.secondary'>
                  {t('Open Tickets')}
                </Typography>
                <Typography variant='h4'>{openTickets}</Typography>
              </Box>
              <Box>
                <Typography variant='h6' color='text.secondary'>
                  {t('Closed Tickets')}
                </Typography>
                <Typography variant='h4'>{closedTickets}</Typography>
              </Box>
            </Grid>
            <Grid item xs={4}>
              <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                <PieChart width={160} height={160}>
                  <Pie data={pieData} innerRadius={60} outerRadius={80} dataKey='value'>
                    <Cell fill='#4caf50' />
                    <Cell fill='#f5f5f5' />
                  </Pie>
                </PieChart>
                <Box
                  sx={{
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0,
                    position: 'absolute',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Typography variant='h6' component='div'>
                    {Math.round(completionRate)}%
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </>
  )
}

export default SupportTrackerWidget
