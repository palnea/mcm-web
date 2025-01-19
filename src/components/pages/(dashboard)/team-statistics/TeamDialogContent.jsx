import { useEffect, useState } from 'react'
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
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from '@mui/material'
import { AccessTime, CheckCircle, Group, KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material'
import { toast } from 'react-toastify'
import api from '../../../../api_helper/api'

export const TeamsDialogContent = ({ teams, tickets, t }) => {
  const [selectedTeam, setSelectedTeam] = useState(null)

  return (
    <TableContainer component={Paper} elevation={3}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell>{t('Team')}</TableCell>
            <TableCell>{t('Members')}</TableCell>
            <TableCell>{t('Performance')}</TableCell>
            <TableCell>{t('Status')}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {teams.map(team => {
            return (
              <TeamExpandableRow
                key={team.id}
                team={team}
                tickets={tickets}
                isExpanded={selectedTeam === team.id}
                onToggle={() => setSelectedTeam(selectedTeam === team.id ? null : team.id)}
                t={t}
              />
            )
          })}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

const TeamExpandableRow = ({ team, tickets, isExpanded, onToggle, t }) => {
  const [users, setUsers] = useState([])
  const [teamStats, setTeamStats] = useState({
    total: 0,
    closed: 0,
    members: 0,
    completionRate: 0
  })

  const fillTeamStats = users => {
    const teamUserIds = users?.map(u => u.id) || []
    const teamTickets = tickets.filter(
      t => teamUserIds.includes(t.assignedToUserId) || teamUserIds.includes(t.createdBy)
    )
    const closedTickets = teamTickets.filter(t => t.closeTime)

    setTeamStats({
      total: teamTickets.length,
      closed: closedTickets.length,
      members: users?.length || 0,
      completionRate: teamTickets.length ? (closedTickets.length / teamTickets.length) * 100 : 0
    })
  }

  const fetchTeamDetails = async teamId => {
    try {
      const response = await api.get(`/Teams/GetWithDetails/${teamId}`)
      return response.data.data || null
    } catch (err) {
      console.error('Error fetching team details:', err)
      toast.error(t('An error occurred while fetching team details'))
      return null
    }
  }

  useEffect(() => {
    if (isExpanded) {
      fetchTeamDetails(team.id)
        .then(teamDetails => {
          const teamUsers = teamDetails?.users || []
          setUsers(teamUsers)
          return teamUsers
        })
        .then(users => {
          fillTeamStats(users)
        })
    } else {
      setUsers([])
    }
  }, [isExpanded])

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
            <Avatar sx={{ mr: 2, bgcolor: 'secondary.main' }}>
              <Group />
            </Avatar>
            <Typography variant='subtitle2'>{team.name}</Typography>
          </Box>
        </TableCell>
        <TableCell>
          <Chip label={`${team.userCount} ${t('members')}`} size='small' color='primary' variant='outlined' />
        </TableCell>
        <TableCell>
          <Box sx={{ display: 'flex', alignItems: 'center', minWidth: 200 }}>
            <Box sx={{ width: '100%', mr: 1 }}>
              <LinearProgress
                variant='determinate'
                value={teamStats.completionRate}
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
              {Math.round(teamStats.completionRate)}%
            </Typography>
          </Box>
        </TableCell>
        <TableCell>
          <Chip
            icon={teamStats.completionRate > 50 ? <CheckCircle /> : <AccessTime />}
            label={teamStats.completionRate > 50 ? t('High Performing') : t('Progressing')}
            color={teamStats.completionRate > 50 ? 'success' : 'warning'}
            size='small'
          />
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={isExpanded} timeout='auto' unmountOnExit>
            <Box sx={{ margin: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant='h6'>{t('Team Members')}</Typography>
                <Card sx={{ minWidth: 200 }}>
                  <CardContent>
                    <Typography variant='h6' color="text.secondary" gutterBottom>
                      {t('Total Tickets')}
                    </Typography>
                    <Typography variant='h4'>
                      {teamStats.total}
                    </Typography>
                    <Typography variant='body2' color="text.secondary">
                      {teamStats.closed} {t('closed')}
                    </Typography>
                  </CardContent>
                </Card>
              </Box>
              <Grid container spacing={3}>
                {users?.map(user => {
                  const userTickets = tickets.filter(t => t.assignedToUserId === user.id)
                  const completionRate = userTickets.length
                    ? (userTickets.filter(t => t.closeTime).length / userTickets.length) * 100
                    : 0

                  return (
                    <Grid item xs={12} md={6} key={user.id}>
                      <Card>
                        <CardContent>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <Avatar sx={{ mr: 2 }}>{user.name[0]}</Avatar>
                            <Box>
                              <Typography variant='subtitle2'>{user.name}</Typography>
                              <Typography variant='body2' color='text.secondary'>
                                {user.email}
                              </Typography>
                            </Box>
                          </Box>
                          <Box sx={{ mb: 2 }}>
                            <Typography variant='body2' color='text.secondary' gutterBottom>
                              {t('Completion Rate')}
                            </Typography>
                            <LinearProgress
                              variant='determinate'
                              value={completionRate}
                              sx={{ height: 8, borderRadius: 5 }}
                            />
                          </Box>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant='body2' color='text.secondary'>
                              {t('Assigned')}: {userTickets.length}
                            </Typography>
                            <Typography variant='body2' color='text.secondary'>
                              {t('Closed')}: {userTickets.filter(t => t.closeTime).length}
                            </Typography>
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  )
                })}
              </Grid>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  )
}

export default TeamsDialogContent
