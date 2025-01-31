import React, { useState } from 'react'
import {
  Avatar,
  Box,
  Card,
  CardContent,
  Chip,
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
  Typography
} from '@mui/material'
import { AccessTime, Assignment, CheckCircle, KeyboardArrowDown, KeyboardArrowUp, Person } from '@mui/icons-material'
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { useTranslation } from 'next-i18next'

export const UsersDialogContent = ({ users, userTickets }) => {
  const [selectedUser, setSelectedUser] = useState(null)
  const { t } = useTranslation('common')

  const getUserStats = userId => {
    const currentUserTickets = userTickets[userId] || []
    const assignedTickets = currentUserTickets.filter(t => t.assignedToUserId === userId) || []
    const closedTickets = currentUserTickets.filter(t => !!t.closeTime && t.assignedToUserId === userId) || []
    const createdTickets = currentUserTickets.filter(t => t.createdByUser?.id === userId) || []

    return {
      total: currentUserTickets.length,
      assigned: assignedTickets.length,
      closed: closedTickets.length,
      created: createdTickets.length,
      completionRate: assignedTickets.length ? (closedTickets.length / assignedTickets.length) * 100 : 0
    }
  }

  return (
    <TableContainer component={Paper} elevation={3}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell>{t('User')}</TableCell>
            <TableCell>{t('Assigned')}</TableCell>
            <TableCell>{t('Created')}</TableCell>
            <TableCell>{t('Completion')} Rate</TableCell>
            <TableCell>{t('Status')}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map(user => (
            <UserExpandableRow
              key={user.id}
              user={user}
              stats={getUserStats(user.id)}
              tickets={userTickets[user.id] || []}
              isExpanded={selectedUser === user.id}
              onToggle={() => setSelectedUser(selectedUser === user.id ? null : user.id)}
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

const UserExpandableRow = ({ user, stats, tickets, isExpanded, onToggle }) => {
  const { t } = useTranslation('common')
  isExpanded = true;

  const userTicketStats = [
    { name: 'Assigned', value: stats.assigned },
    { name: 'Closed', value: stats.closed },
    { name: 'Created', value: stats.created }
  ]
  return (
    <>
      <TableRow
        sx={{
          '& > *': { borderBottom: 'unset' },
          '&:hover': { backgroundColor: 'action.hover' }
        }}
      >
        {/*<TableCell>*/}
        {/*  <IconButton size='small' onClick={onToggle}>*/}
        {/*    {isExpanded ? <KeyboardArrowUp /> : <KeyboardArrowDown />}*/}
        {/*  </IconButton>*/}
        {/*</TableCell>*/}
        <TableCell>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>{user.fullName?.[0] || <Person />}</Avatar>
            <Box>
              <Typography variant='subtitle2'>{user.name || user.username || `User ${user.id}`}</Typography>
              <Typography variant='body2' color='text.secondary'>
                {user.email}
              </Typography>
            </Box>
          </Box>
        </TableCell>
        <TableCell>
          <Chip label={stats.assigned} size='small' color='primary' variant='outlined' />
        </TableCell>
        <TableCell>
          <Chip label={stats.created} size='small' color='info' variant='outlined' />
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
                    borderRadius: 5
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
            icon={stats.completionRate > 50 ? <CheckCircle /> : <AccessTime />}
            label={stats.completionRate > 50 ? 'High Performer' : 'In Progress'}
            color={stats.completionRate > 50 ? 'success' : 'warning'}
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
                        {t('Performance Metrics')}
                      </Typography>
                      <ResponsiveContainer width='100%' height={200}>
                        <BarChart data={userTicketStats}>
                          <CartesianGrid strokeDasharray='3 3' />
                          <XAxis dataKey='name' />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey='value' fill='#8884d8' name='Tickets' isAnimationActive={true}>
                            {userTicketStats.map(({ name, value }) => (
                              <Cell
                                key={name}
                                fill={
                                  name === 'Closed'
                                    ? '#10b981'
                                    : name === 'Assigned'
                                      ? '#f5c20b'
                                      : name === 'Created'
                                        ? '#8884d8'
                                        : '#8884d8'
                                }
                              />
                            ))}
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
                        Recent Activity
                      </Typography>
                      <List>
                        {tickets
                          .filter(t => t.assignedToUserId === user.id)
                          .slice(0, 5)
                          .map(ticket => (
                            <ListItem key={ticket.id}>
                              <ListItemAvatar>
                                <Avatar sx={{ bgcolor: ticket.closeTime ? 'success.light' : 'warning.light' }}>
                                  {ticket.closeTime ? <CheckCircle /> : <Assignment />}
                                </Avatar>
                              </ListItemAvatar>
                              <ListItemText
                                primary={ticket.subject}
                                secondary={
                                  <>
                                    <Typography component='span' variant='body2' color='text.primary'>
                                      {ticket.closeTime ? 'Closed' : 'In Progress'}
                                    </Typography>
                                    {` — ${new Date(ticket.createdDate).toLocaleDateString()}`}
                                  </>
                                }
                              />
                            </ListItem>
                          ))}
                      </List>
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

export default UsersDialogContent
