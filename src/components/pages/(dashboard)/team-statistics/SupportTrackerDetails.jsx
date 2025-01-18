import React, { useEffect, useState } from 'react'
import {
  Avatar,
  Box,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from '@mui/material'

export const SupportTrackerDetails = ({ tickets, timeFilter }) => {
  const [ticketStats, setTicketStats] = useState({
    dailyTickets: [],
    priorityDistribution: {},
    averageResponseTime: 0
  })
  const [activeTab, setActiveTab] = useState(0)

  useEffect(() => {
    // Calculate daily ticket statistics
    const dailyStats = tickets.reduce((acc, ticket) => {
      const date = new Date(ticket.createdDate).toLocaleDateString()
      if (!acc[date]) acc[date] = { date, total: 0, closed: 0 }
      acc[date].total++
      if (ticket.closeTime) acc[date].closed++
      return acc
    }, {})

    // Calculate priority distribution
    const priorities = tickets.reduce((acc, ticket) => {
      acc[ticket.priority] = (acc[ticket.priority] || 0) + 1
      return acc
    }, {})

    // Calculate average response time
    const avgResponse =
      tickets.reduce((acc, ticket) => {
        if (ticket.firstResponseTime) {
          const responseTime = new Date(ticket.firstResponseTime) - new Date(ticket.createdDate)
          return acc + responseTime
        }
        return acc
      }, 0) / tickets.length

    setTicketStats({
      dailyTickets: Object.values(dailyStats),
      priorityDistribution: priorities,
      averageResponseTime: avgResponse / (1000 * 60 * 60) // Convert to hours
    })
  }, [tickets])

  return (
    <Box sx={{ mt: 2 }}>
      <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)} sx={{ mb: 2 }}>
        <Tab label='Overview' />
        <Tab label='Tickets List' />
        <Tab label='Analytics' />
      </Tabs>

      <TabPanel value={activeTab} index={0}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant='h6'>Ticket Volume</Typography>
                <ResponsiveContainer width='100%' height={300}>
                  <BarChart data={ticketStats.dailyTickets}>
                    <CartesianGrid strokeDasharray='3 3' />
                    <XAxis dataKey='date' />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey='total' fill='#8884d8' name='Total Tickets' />
                    <Bar dataKey='closed' fill='#82ca9d' name='Closed Tickets' />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant='h6'>Quick Stats</Typography>
                <List>
                  <ListItem>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: 'primary.main' }}>
                        <AccessTime />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary='Average Response Time'
                      secondary={`${ticketStats.averageResponseTime.toFixed(2)} hours`}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: 'success.main' }}>
                        <CheckCircle />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary='Resolution Rate'
                      secondary={`${((tickets.filter(t => t.closeTime).length / tickets.length) * 100).toFixed(1)}%`}
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>

      <TabPanel value={activeTab} index={1}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell />
                <TableCell>ID</TableCell>
                <TableCell>Subject</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Priority</TableCell>
                <TableCell>Created</TableCell>
                <TableCell>Assigned To</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tickets.map(ticket => (
                <TicketRow key={ticket.id} ticket={ticket} />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>

      <TabPanel value={activeTab} index={2}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant='h6'>Priority Distribution</Typography>
                <ResponsiveContainer width='100%' height={300}>
                  <BarChart
                    data={Object.entries(ticketStats.priorityDistribution).map(([priority, count]) => ({
                      priority,
                      count
                    }))}
                  >
                    <CartesianGrid strokeDasharray='3 3' />
                    <XAxis dataKey='priority' />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey='count' fill='#8884d8' />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>
    </Box>
  )
}

export default SupportTrackerDetails;
