import { useEffect, useState } from 'react'
import {
  Badge,
  Box,
  Card,
  CardContent,
  CardHeader,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from '@mui/material'
import { Cell, Pie, PieChart } from 'recharts'

const SupportTrackerWidget = ({ tickets, timeFilter, onTimeFilterChange }) => {
  const [openTickets, setOpenTickets] = useState(0)
  const [newTickets, setNewTickets] = useState(0)
  const [closedTickets, setClosedTickets] = useState(0)
  const [completionRate, setCompletionRate] = useState(0)
  const [dialogOpen, setDialogOpen] = useState(false)

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
    }
    else {
      setOpenTickets(filteredTickets.filter(t => !t.closeTime).length)
      setNewTickets(filteredTickets.length)
      setClosedTickets(filteredTickets.filter(t => t.closeTime).length)
    }

    const total = filteredTickets.length
    setCompletionRate(total ? (closedTickets / total) * 100 : 0)
  }

  useEffect(() => {
    fillData()
  }, [tickets, timeFilter])

  useEffect(() => {
    fillData()
  }, [])

  const pieData = [
    { name: 'Completed', value: completionRate },
    { name: 'Remaining', value: 100 - completionRate }
  ]

  return (
    <>
      <Card sx={{ height: '100%', cursor: 'pointer' }} onClick={() => setDialogOpen(true)}>
        <CardHeader
          title='Support Tracker'
          action={
            <FormControl variant='standard' sx={{ minWidth: 120 }}>
              <Select
                value={timeFilter}
                onChange={e => onTimeFilterChange(e.target.value)}
                onClick={e => e.stopPropagation()}
              >
                <MenuItem value='week'>Last Week</MenuItem>
                <MenuItem value='month'>Last Month</MenuItem>
                <MenuItem value='all'>All Time</MenuItem>
              </Select>
            </FormControl>
          }
        />
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={8}>
              <Box sx={{ mb: 2 }}>
                <Typography variant='h6' color='text.secondary'>
                  New Tickets
                </Typography>
                <Typography variant='h4'>{newTickets}</Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant='h6' color='text.secondary'>
                  Open Tickets
                </Typography>
                <Typography variant='h4'>{openTickets}</Typography>
              </Box>
              <Box>
                <Typography variant='h6' color='text.secondary'>
                  Closed Tickets
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

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth='md' fullWidth>
        <DialogTitle>Support Tracker Details</DialogTitle>
        <DialogContent>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Ticket ID</TableCell>
                  <TableCell>Created Date</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Assigned To</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {tickets.map(ticket => (
                  <TableRow key={ticket.id}>
                    <TableCell>{ticket.id}</TableCell>
                    <TableCell>{new Date(ticket.createdDate).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Badge color={ticket.closeTime ? 'success' : 'warning'} variant='dot'>
                        {ticket.closeTime ? 'Closed' : 'Open'}
                      </Badge>
                    </TableCell>
                    <TableCell>{ticket.assignedToUserId}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default SupportTrackerWidget
