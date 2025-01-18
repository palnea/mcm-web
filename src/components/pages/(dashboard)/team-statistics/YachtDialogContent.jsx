import React, { useState } from 'react'
import {
  Avatar,
  Box,
  Card,
  CardContent,
  Collapse,
  Grid,
  IconButton,
  LinearProgress,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Chip,
  Divider
} from '@mui/material'
import {
  AccessTime,
  Assignment,
  CheckCircle,
  DirectionsBoat,
  ErrorOutline,
  KeyboardArrowDown,
  KeyboardArrowUp
} from '@mui/icons-material'
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

export const YachtsDialogContent = ({ yachts, tickets }) => {
  const [selectedYacht, setSelectedYacht] = useState(null)

  const getYachtStats = yachtId => {
    const yachtTickets = tickets.filter(t => t.yachtId === yachtId)
    const closedTickets = yachtTickets.filter(t => t.closeTime)
    const chronicTickets = yachtTickets.filter(t => t.isChronic)

    return {
      total: yachtTickets.length,
      closed: closedTickets.length,
      chronic: chronicTickets.length,
      completionRate: yachtTickets.length ? (closedTickets.length / yachtTickets.length) * 100 : 0
    }
  }

  return (
    <TableContainer component={Paper} elevation={3}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell>Yacht</TableCell>
            <TableCell>HIN</TableCell>
            <TableCell>Total Tickets</TableCell>
            <TableCell>Performance</TableCell>
            <TableCell>Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {yachts.map(yacht => {
            const stats = getYachtStats(yacht.id)
            return (
              <YachtExpandableRow
                key={yacht.id}
                yacht={yacht}
                stats={stats}
                tickets={tickets}
                isExpanded={selectedYacht === yacht.id}
                onToggle={() => setSelectedYacht(selectedYacht === yacht.id ? null : yacht.id)}
              />
            )
          })}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

const YachtExpandableRow = ({ yacht, stats, tickets, isExpanded, onToggle }) => {
  const yachtTickets = tickets.filter(t => t.yachtId === yacht.id)

  const getTicketPriorityStats = () => {
    return yachtTickets.reduce((acc, ticket) => {
      acc[ticket.priority] = (acc[ticket.priority] || 0) + 1
      return acc
    }, {})
  }

  const priorityStats = getTicketPriorityStats()

  return (
    <>
      <TableRow
        sx={{
          '& > *': { borderBottom: 'unset' },
          '&:hover': { backgroundColor: 'action.hover' }
        }}
      >
        <TableCell>
          <IconButton size='small' onClick={onToggle}>
            {isExpanded ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
          </IconButton>
        </TableCell>
        <TableCell>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
              <DirectionsBoat />
            </Avatar>
            <Box>
              <Typography variant='subtitle2'>{yacht.name}</Typography>
              <Typography variant='body2' color='text.secondary'>
                Model: {yacht.model || 'N/A'}
              </Typography>
            </Box>
          </Box>
        </TableCell>
        <TableCell>{yacht.hin || 'N/A'}</TableCell>
        <TableCell>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Chip label={`Total: ${stats.total}`} size='small' color='primary' variant='outlined' />
            <Chip
              label={`Chronic: ${stats.chronic}`}
              size='small'
              color={stats.chronic > 0 ? 'error' : 'success'}
              variant='outlined'
            />
          </Box>
        </TableCell>
        <TableCell>
          <Box sx={{ display: 'flex', alignItems: 'center', minWidth: 200 }}>
            <Box sx={{ width: '100%', mr: 1 }}>
              <LinearProgress
                variant='determinate'
                value={stats.completionRate}
                sx={{
                  height: 8,
                  borderRadius: 5,
                  '& .MuiLinearProgress-bar': {
                    borderRadius: 5,
                    backgroundColor: stats.chronic > 0 ? 'warning.main' : 'success.main'
                  }
                }}
              />
            </Box>
            <Typography variant='body2' color='text.secondary'>
              {Math.round(stats.completionRate)}%
            </Typography>
          </Box>
        </TableCell>
        <TableCell>
          <Chip
            icon={stats.completionRate > 70 ? <CheckCircle /> : stats.chronic > 0 ? <ErrorOutline /> : <AccessTime />}
            label={stats.completionRate > 70 ? 'Excellent' : stats.chronic > 0 ? 'Needs Attention' : 'In Progress'}
            color={stats.completionRate > 70 ? 'success' : stats.chronic > 0 ? 'error' : 'warning'}
            size='small'
          />
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={isExpanded} timeout='auto' unmountOnExit>
            <Box sx={{ margin: 3 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Card>
                    <CardContent>
                      <Typography variant='h6' gutterBottom>
                        Ticket Priority Distribution
                      </Typography>
                      <ResponsiveContainer width='100%' height={200}>
                        <BarChart
                          data={Object.entries(priorityStats).map(([priority, count]) => ({
                            priority,
                            count
                          }))}
                        >
                          <CartesianGrid strokeDasharray='3 3' />
                          <XAxis dataKey='priority' />
                          <YAxis />
                          <Tooltip />
                          <Bar
                            dataKey='count'
                            fill="#8884d8"
                            name="Tickets"
                            isAnimationActive={true}
                          >
                            {Object.entries(priorityStats).map(([priority, count]) =>
                              <Cell
                                key={priority}
                                fill={
                                  priority === "1"
                                    ? '#10b981'
                                    : priority === "2"
                                      ? '#f5c20b'
                                      : priority === "3"
                                        ? '#f59e0b'
                                        : priority === "4"
                                          ? '#f87171'
                                          : priority === "5"
                                            ? '#ef4444'
                                            : '#8884d8'
                                }
                              />
                            )}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Card>
                    <CardContent>
                      <Typography variant='h6' gutterBottom>
                        Recent Tickets
                      </Typography>
                      <List>
                        {yachtTickets
                          .sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate))
                          .slice(0, 5)
                          .map(ticket => (
                            <React.Fragment key={ticket.id}>
                              <ListItem
                                secondaryAction={
                                  <Chip
                                    size='small'
                                    label={ticket.priority}
                                    color={
                                      ticket.priority === 'High'
                                        ? 'error'
                                        : ticket.priority === 'Medium'
                                          ? 'warning'
                                          : 'info'
                                    }
                                  />
                                }
                              >
                                <ListItemAvatar>
                                  <Avatar
                                    sx={{
                                      bgcolor: ticket.closeTime
                                        ? 'success.light'
                                        : ticket.isChronic
                                          ? 'error.light'
                                          : 'warning.light'
                                    }}
                                  >
                                    {ticket.closeTime ? (
                                      <CheckCircle />
                                    ) : ticket.isChronic ? (
                                      <ErrorOutline />
                                    ) : (
                                      <Assignment />
                                    )}
                                  </Avatar>
                                </ListItemAvatar>
                                <ListItemText
                                  primary={ticket.subject}
                                  secondary={
                                    <>
                                      <Typography component='span' variant='body2' color='text.primary'>
                                        {ticket.closeTime ? 'Closed' : ticket.isChronic ? 'Chronic Issue' : 'Open'}
                                      </Typography>
                                      {` — ${new Date(ticket.createdDate).toLocaleDateString()}`}
                                    </>
                                  }
                                />
                              </ListItem>
                              <Divider variant='inset' component='li' />
                            </React.Fragment>
                          ))}
                      </List>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12}>
                  <Card>
                    <CardContent>
                      <Typography variant='h6' gutterBottom>
                        Yacht Details
                      </Typography>
                      <Grid container spacing={2}>
                        <Grid item xs={6} md={3}>
                          <Typography color='text.secondary' variant='body2'>
                            Name
                          </Typography>
                          <Typography variant='body1'>{yacht.name}</Typography>
                        </Grid>
                        <Grid item xs={6} md={3}>
                          <Typography color='text.secondary' variant='body2'>
                            HIN
                          </Typography>
                          <Typography variant='body1'>{yacht.hin || 'N/A'}</Typography>
                        </Grid>
                        <Grid item xs={6} md={3}>
                          <Typography color='text.secondary' variant='body2'>
                            Model
                          </Typography>
                          <Typography variant='body1'>{yacht.model || 'N/A'}</Typography>
                        </Grid>
                        <Grid item xs={6} md={3}>
                          <Typography color='text.secondary' variant='body2'>
                            Year
                          </Typography>
                          <Typography variant='body1'>{yacht.year || 'N/A'}</Typography>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  )
}

export default YachtsDialogContent
