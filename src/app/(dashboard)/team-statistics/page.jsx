'use client'
// KPIDashboard.js
import React, { useEffect, useState } from 'react'
import {
  Box, Container,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs
} from '@mui/material'
import { toast } from 'react-toastify'
import api from '@/api_helper/api'
import TeamRow from '@components/pages/(dashboard)/team-statistics/TeamRow'
import YachtRow from '@components/pages/(dashboard)/team-statistics/YachtRow'
import UserRow from '@components/pages/(dashboard)/team-statistics/UserRow'

// Main KPI Dashboard Component
const Page = () => {
  const [tabValue, setTabValue] = useState(0)
  const [timeFilter, setTimeFilter] = useState('week')
  const [tickets, setTickets] = useState([])
  const [activeUsers, setActiveUsers] = useState([])
  const [yachts, setYachts] = useState([])
  const [teams, setTeams] = useState([])

  const fetchTickets = async () => {
    try {
      const response = await api.get('/Tickets')
      return response.data.data || []
    } catch (err) {
      console.error('Error fetching tickets:', err)
      toast.error('An error occurred while fetching tickets')
      return []
    }
  }

  const fetchActiveUsers = async (startDate, endDate) => {
    try {
      const formattedStartDate = startDate
        .toLocaleDateString('en-GB', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        })
        .replace(/\//g, '/')

      const formattedEndDate = endDate
        .toLocaleDateString('en-GB', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        })
        .replace(/\//g, '/')

      const response = await api.get(
        `/Reports/MostActiveUsersWithProcesses/${formattedStartDate}/${formattedEndDate}/20`
      )
      return response.data.data || []
    } catch (err) {
      console.error('Error fetching active users:', err)
      toast.error('An error occurred while fetching active users')
      return []
    }
  }

  const fetchYachts = async () => {
    try {
      const response = await api.get('/Yachts')
      return response.data.data || []
    } catch (err) {
      console.error('Error fetching yachts:', err)
      toast.error('An error occurred while fetching yachts')
      return []
    }
  }

  const fetchTeams = async () => {
    try {
      const response = await api.get('/Teams')
      return response.data.data || []
    } catch (err) {
      console.error('Error fetching teams:', err)
      toast.error('An error occurred while fetching teams')
      return []
    }
  }

  const fetchTeamDetails = async teamId => {
    try {
      const response = await api.get(`/Teams/GetWithDetails/${teamId}`)
      return response.data.data || null
    } catch (err) {
      console.error('Error fetching team details:', err)
      toast.error('An error occurred while fetching team details')
      return null
    }
  }

  const fetchData = async () => {
    try {
      // Calculate date range based on timeFilter
      const endDate = new Date()
      const startDate = new Date()
      if (timeFilter === 'week') {
        startDate.setDate(startDate.getDate() - 7)
      } else {
        startDate.setDate(startDate.getDate() - 30)
      }

      // Fetch all required data
      const [ticketsData, usersData, yachtsData, teamsData] = await Promise.all([
        fetchTickets(),
        fetchActiveUsers(startDate, endDate),
        fetchYachts(),
        fetchTeams()
      ])

      // Process tickets data
      const processedTickets = ticketsData.map(ticket => ({
        ...ticket,
        createdDate: new Date(ticket.createdDate)
      }))

      // Filter tickets based on time range
      const filteredTickets = processedTickets.filter(
        ticket => ticket.createdDate >= startDate && ticket.createdDate <= endDate
      )

      // Match tickets with yachts
      const yachtsWithTickets = yachtsData.map(yacht => ({
        ...yacht,
        tickets: filteredTickets.filter(ticket => ticket.yachtId === yacht.id)
      }))

      // Sort yachts by ticket count
      const sortedYachts = yachtsWithTickets.sort((a, b) => (b.tickets?.length || 0) - (a.tickets?.length || 0))

      setTickets(filteredTickets)
      setActiveUsers(usersData)
      setYachts(sortedYachts)
      setTeams(teamsData)
    } catch (err) {
      console.error('Error fetching dashboard data:', err)
      toast.error('An error occurred while fetching dashboard data')
    }
  }

  const handleTeamExpand = async teamId => {
    try {
      const teamDetails = await fetchTeamDetails(teamId)
      setTeams(prevTeams => prevTeams.map(team => (team.id === teamId ? { ...team, users: teamDetails.users } : team)))
    } catch (err) {
      console.error('Error fetching team details:', err)
      toast.error('An error occurred while fetching team details')
    }
  }

  useEffect(() => {
    fetchData()
  }, [timeFilter])

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue)
  }

  return (
    <Container maxWidth='lg'>
      <Box sx={{ py: 4 }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 4
          }}
        >
          <Box sx={{ flex: 1 }}>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              sx={{
                '& .MuiTab-root': {
                  px: 4,
                  minWidth: 120
                }
              }}
            >
              <Tab label='Users' />
              <Tab label='Yachts' />
              <Tab label='Teams' />
            </Tabs>
          </Box>

          <FormControl sx={{ minWidth: 200, ml: 2 }}>
            <InputLabel>Time Period</InputLabel>
            <Select value={timeFilter} label='Time Period' onChange={e => setTimeFilter(e.target.value)} variant={"outlined"}>
              <MenuItem value='week'>Last Week</MenuItem>
              <MenuItem value='month'>Last Month</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <Box sx={{ mt: 3 }}>
          <TabPanel value={tabValue} index={0}>
            <TableContainer component={Paper} elevation={1}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ width: 50 }} />
                    <TableCell
                      sx={{
                        fontSize: '1.1rem',
                        fontWeight: 500
                      }}
                    >
                      User
                    </TableCell>
                    <TableCell
                      sx={{
                        fontSize: '1.1rem',
                        fontWeight: 500
                      }}
                    >
                      Active Tickets
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {activeUsers.map(user => (
                    <UserRow
                      key={user.userId}
                      user={user}
                      tickets={tickets.filter(t => t.createdBy === user.userId || t.assignedToUserId === user.userId)}
                    />
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            <TableContainer component={Paper} elevation={1}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ width: 50 }} />
                    <TableCell
                      sx={{
                        fontSize: '1.1rem',
                        fontWeight: 500
                      }}
                    >
                      Yacht
                    </TableCell>
                    <TableCell
                      sx={{
                        fontSize: '1.1rem',
                        fontWeight: 500
                      }}
                    >
                      Total Tickets
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {yachts.map(yacht => (
                    <YachtRow key={yacht.id} yacht={yacht} tickets={yacht.tickets || []} />
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </TabPanel>

          <TabPanel value={tabValue} index={2}>
            <TableContainer component={Paper} elevation={1}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ width: 50 }} />
                    <TableCell
                      sx={{
                        fontSize: '1.1rem',
                        fontWeight: 500
                      }}
                    >
                      Team Name
                    </TableCell>
                    <TableCell
                      sx={{
                        fontSize: '1.1rem',
                        fontWeight: 500
                      }}
                    >
                      Members
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {teams.map(team => (
                    <TeamRow key={team.id} team={team} onExpand={() => handleTeamExpand(team.id)} tickets={tickets} />
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </TabPanel>
        </Box>
      </Box>
    </Container>
  )
}

// TabPanel component for handling tab content
const TabPanel = ({ children, value, index }) => {
  return (
    <div role='tabpanel' hidden={value !== index}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  )
}

export default Page
