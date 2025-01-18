import { useState } from 'react'
import {
  Avatar,
  Badge,
  Box,
  Card,
  CardContent,
  CardHeader,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from '@mui/material'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import UserDialogContent from '@components/pages/(dashboard)/team-statistics/UserDialogContent'

const UserListWidget = ({ users, tickets, activeUsers }) => {
  const [selectedUser, setSelectedUser] = useState(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  // Group tickets for users (get assigned and created tickets) assignedToUserId, createdByUser
  const userTickets = tickets.reduce((acc, ticket) => {
    if (!acc[ticket.assignedToUserId]) {
      acc[ticket.assignedToUserId] = [];
    }
    if (!acc[ticket.createdByUser]) {
      acc[ticket.createdByUser] = [];
    }
    acc[ticket.assignedToUserId].push(ticket);
    if (ticket.createdByUser?.id && ticket.assignedToUserId !== ticket.createdByUser?.id) {
      acc[ticket.createdByUser?.id].push(ticket);
    }
    return acc;
  }, {});

  // Fill active users data
  activeUsers = activeUsers.map(user => {
    const currentUserTickets = userTickets[user.id] || []
    const processedTickets = currentUserTickets.filter(t => !!t.closeTime && t.assignedToUserId === user.id)
    return {
      ...user,
      progress: currentUserTickets.length > 0 ? (processedTickets.length / currentUserTickets.length) * 100 : 0
    }
  })

  return (
    <>
      <Card sx={{ height: '100%', cursor: 'pointer' }} onClick={() => setDialogOpen(true)}>
        <CardHeader
          title='Active Users'
          action={
            <IconButton>
              <MoreVertIcon />
            </IconButton>
          }
        />
        <CardContent>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>User</TableCell>
                  <TableCell>Progress</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {activeUsers.slice(0, 5).map(user => {
                  const progress = user.progress
                  return (
                    <TableRow key={user.id}>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Avatar sx={{ mr: 2 }}>{user.name?.[0] || 'U'}</Avatar>
                          <Typography>{user.name || user.username || `User ${user.id}`}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Box sx={{ width: '100%', mr: 1 }}>
                            <LinearProgress variant='determinate' value={progress} />
                          </Box>
                          <Typography variant='body2'>{Math.round(progress)}%</Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Badge color={progress > 50 ? 'success' : 'warning'} variant='dot'>
                          {progress > 50 ? 'Active' : 'Pending'}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth='md' fullWidth>
        <DialogTitle>User Details</DialogTitle>
        <DialogContent>
          <UserDialogContent
            users={users}
            userTickets={userTickets}
            selectedUser={selectedUser}
            setSelectedUser={setSelectedUser}
          />
        </DialogContent>
      </Dialog>
    </>
  )
}

export default UserListWidget
