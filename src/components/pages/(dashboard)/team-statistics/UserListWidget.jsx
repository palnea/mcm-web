import {
  Avatar,
  Badge,
  Box,
  Card,
  CardContent,
  CardHeader,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from '@mui/material'
import { useRouter, useSearchParams } from 'next/navigation'
import Button from '@mui/material/Button'

const UserListWidget = ({ tickets, activeUsers, t }) => {
  const router = useRouter()
  const searchParams = useSearchParams()
  // Group tickets for users (get assigned and created tickets) assignedToUserId, createdByUser
  const userTickets = tickets.reduce((acc, ticket) => {
    if (!acc[ticket.assignedToUserId]) {
      acc[ticket.assignedToUserId] = []
    }
    if (!acc[ticket.createdByUser]) {
      acc[ticket.createdByUser] = []
    }
    acc[ticket.assignedToUserId].push(ticket)
    if (ticket.createdByUser?.id && ticket.assignedToUserId !== ticket.createdByUser?.id) {
      acc[ticket.createdByUser?.id].push(ticket)
    }
    return acc
  }, {})

  // Fill active users data
  activeUsers = activeUsers.map(user => {
    const currentUserTickets = userTickets[user.id] || []
    const processedTickets = currentUserTickets.filter(t => !!t.closeTime && t.assignedToUserId === user.id)
    return {
      ...user,
      progress: currentUserTickets.length > 0 ? (processedTickets.length / currentUserTickets.length) * 100 : 0
    }
  })

  const handleSeeDetails = widgetType => {
    const params = new URLSearchParams(searchParams)
    params.set('view', widgetType)
    router.push(`?${params.toString()}`)
  }

  return (
    <>
      <Card sx={{ height: '100%' }}>
        <CardHeader
          title={t('Active Users')}
          action={
            <Button variant='text' onClick={() => handleSeeDetails('users')} sx={{ whiteSpace: 'nowrap' }}>
              {t('See Details')}
            </Button>
          }
        />
        <CardContent>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>{t('User')}</TableCell>
                  <TableCell>{t('Progress')}</TableCell>
                  <TableCell>{t('Status')}</TableCell>
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
                          <Typography>
                            {user.name || user.username || t('User {userId}', { userId: user.id })}
                          </Typography>
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
                          {progress > 50 ? t('Active') : t('Pending')}
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
    </>
  )
}

export default UserListWidget
