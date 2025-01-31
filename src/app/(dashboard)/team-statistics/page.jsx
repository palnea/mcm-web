'use client'

import React, { useEffect, useState } from 'react'
import { Box, CircularProgress, Container } from '@mui/material'
import { toast } from 'react-toastify'
import { useRouter, useSearchParams } from 'next/navigation'
import api from '@/api_helper/api'
import SupportTrackerWidget from '@components/pages/(dashboard)/team-statistics/SupportTrackerWidget'
import UserListWidget from '@components/pages/(dashboard)/team-statistics/UserListWidget'
import YachtListWidget from '@components/pages/(dashboard)/team-statistics/YachtListWidget'
import TeamListWidget from '@components/pages/(dashboard)/team-statistics/TeamListWidget'
import { TeamsDialogContent } from '@components/pages/(dashboard)/team-statistics/TeamDialogContent'
import { UsersDialogContent } from '@components/pages/(dashboard)/team-statistics/UserDialogContent'
import { YachtsDialogContent } from '@components/pages/(dashboard)/team-statistics/YachtDialogContent'
import Grid from '@mui/material/Grid'
import { useTranslation } from 'next-i18next'
import SupportTrackerDialogContent from '@components/pages/(dashboard)/team-statistics/SupportTrackerDialogContent'

const Page = () => {
  const { t } = useTranslation('common')
  const router = useRouter()
  const searchParams = useSearchParams()
  const view = searchParams.get('view')

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

  useEffect(() => {
    fetchData()
  }, [timeFilter])

  const fetchData = async () => {
    setLoading(true)
    try {
      const endDate = new Date()
      const startDate = new Date()
      if (timeFilter === 'week') {
        startDate.setDate(startDate.getDate() - 7)
      } else {
        startDate.setDate(startDate.getDate() - 30)
      }

      const [ticketsData, activeUsersData, yachtsData, teamsData, usersData] = await Promise.all([
        fetchTickets(),
        fetchActiveUsers(startDate, endDate),
        fetchYachts(),
        fetchTeams(),
        fetchUsers()
      ])

      const processedTickets = ticketsData.map(ticket => ({
        ...ticket,
        createdDate: new Date(ticket.createdDate)
      }))

      const filteredTickets = processedTickets.filter(
        ticket => ticket.createdDate >= startDate && ticket.createdDate <= endDate
      )

      const yachtsWithTickets = yachtsData.map(yacht => ({
        ...yacht,
        tickets: filteredTickets.filter(ticket => ticket.yachtId === yacht.id)
      }))

      const sortedYachts = yachtsWithTickets.sort((a, b) => (b.tickets?.length || 0) - (a.tickets?.length || 0))

      setTickets(filteredTickets)
      setActiveUsers(activeUsersData)
      setYachts(sortedYachts)
      setTeams(teamsData)
      setUsers(usersData)
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

  const handleWidgetClick = widgetType => {
    const params = new URLSearchParams(searchParams)
    params.set('view', widgetType)
    router.push(`?${params.toString()}`)
  }

  const renderContent = () => {
    switch (view) {
      case 'teams':
        return <TeamsDialogContent teams={teams} tickets={tickets} t={t} />
      case 'users':
        const userTickets = users.reduce((acc, user) => {
          acc[user.id] = tickets.filter(t => t.assignedToUserId === user.id || t.createdByUser?.id === user.id)
          return acc
        }, {})
        return <UsersDialogContent users={users} userTickets={userTickets} />
      case 'yachts':
        return <YachtsDialogContent yachts={yachts} tickets={tickets} t={t} />
      case 'support':
        return (
          <Box sx={{ p: 3 }}>
            <SupportTrackerDialogContent t={t} tickets={tickets} />
          </Box>
        )
      default:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <SupportTrackerWidget
                tickets={tickets}
                timeFilter={timeFilter}
                onTimeFilterChange={setTimeFilter}
                t={t}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <div onClick={() => handleWidgetClick('users')}>
                <UserListWidget
                  users={users}
                  tickets={tickets}
                  activeUsers={users.length > 5 ? users.slice(0, 5) : users}
                  t={t}
                />
              </div>
            </Grid>
            <Grid item xs={12} md={6}>
                <YachtListWidget yachts={yachts} tickets={tickets} t={t} />
            </Grid>
            <Grid item xs={12} md={6}>
              <TeamListWidget teams={teams} tickets={tickets} t={t} />
            </Grid>
          </Grid>
        )
    }
  }

  return (
    <Container maxWidth='xl'>
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
        {renderContent()}
      </Box>
    </Container>
  )
}

export default Page
