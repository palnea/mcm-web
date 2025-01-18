'use client'

import React, { useEffect, useState } from 'react'
import { Box, CircularProgress, Container } from '@mui/material'
import { toast } from 'react-toastify'
import api from '@/api_helper/api'
import SupportTrackerWidget from '@components/pages/(dashboard)/team-statistics/SupportTrackerWidget'
import UserListWidget from '@components/pages/(dashboard)/team-statistics/UserListWidget'
import YachtListWidget from '@components/pages/(dashboard)/team-statistics/YachtListWidget'
import TeamListWidget from '@components/pages/(dashboard)/team-statistics/TeamListWidget'
import Grid from '@mui/material/Grid'


const Page = () => {
  const [timeFilter, setTimeFilter] = useState('week')
  const [tickets, setTickets] = useState([])
  const [users, setUsers] = useState([])
  const [yachts, setYachts] = useState([])
  const [teams, setTeams] = useState([])
  const [activeUsers, setActiveUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const fetchTickets = async () => {
    try {
      const response = await api.get('/Tickets')
      return response.data.data || []
    } catch (err) {
      console.error('Error fetching tickets:', err)
      toast.error(t('An error occurred while fetching tickets'))
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
      toast.error(t('An error occurred while fetching active users'))
      return []
    }
  }
  const fetchYachts = async () => {
    try {
      const response = await api.get('/Yachts')
      return response.data.data || []
    } catch (err) {
      console.error('Error fetching yachts:', err)
      toast.error(t('An error occurred while fetching yachts'))
      return []
    }
  }
  const fetchTeams = async () => {
    try {
      const response = await api.get('/Teams')
      return response.data.data || []
    } catch (err) {
      console.error('Error fetching teams:', err)
      toast.error(t('An error occurred while fetching teams'))
      return []
    }
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

  const fetchUsers = async () => {
    try {
      const response = await api.get('/Users')
      return response.data.data || []
    } catch (err) {
      console.error('Error fetching users:', err)
      toast.error(t('An error occurred while fetching users'))
      return []
    }
  }

  const fetchData = async () => {
    setLoading(true)
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
      const [ticketsData, activeUsersData, yachtsData, teamsData, users] = await Promise.all([
        fetchTickets(),
        fetchActiveUsers(startDate, endDate),
        fetchYachts(),
        fetchTeams(),
        fetchUsers()
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
      setActiveUsers(activeUsersData)
      setYachts(sortedYachts)
      setTeams(teamsData)
      setUsers(users)
    } catch (err) {
      console.error('Error fetching dashboard data:', err)
      toast.error(t('An error occurred while fetching dashboard data'))
    } finally {
      setTimeout(() => setLoading(false), 800)
    }
  }

  useEffect(() => {
    fetchData()
  }, [timeFilter])

  return (
    <Container maxWidth="xl">
      <Box sx={{ py: 4, position: 'relative' }}>
        {loading && (
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'rgba(255, 255, 255, 0.7)',
              zIndex: 1000
            }}
          >
            <CircularProgress size={60} />
          </Box>
        )}
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <SupportTrackerWidget
              tickets={tickets}
              timeFilter={timeFilter}
              onTimeFilterChange={setTimeFilter}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <UserListWidget
              users={users}
              tickets={tickets}
              activeUsers={users.length > 5 ? users.slice(0, 5) : users}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <YachtListWidget
              yachts={yachts}
              tickets={tickets}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TeamListWidget
              teams={teams}
              tickets={tickets}
            />
          </Grid>
        </Grid>
      </Box>
    </Container>
  )
}

export default Page
