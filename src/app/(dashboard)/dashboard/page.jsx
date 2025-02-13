'use client'

import Grid from '@mui/material/Grid'
import React, { useEffect, useState } from 'react'
import CardStatVertical from '@/components/card-statistics/Vertical'
import { useTheme } from '@mui/material/styles'
import api from '../../../api_helper/api'
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import { useTranslation } from 'next-i18next'
import { useRouter } from 'next/navigation'

export default function Page() {
  const theme = useTheme()
  const [chartData, setChartData] = useState([])
  const [monthlyChartData, setMonthlyChartData] = useState([])
  const [dashboardData, setDashboardData] = useState(null)
  const {t, i18n} = useTranslation('common')
  const router = useRouter()

  const processTicketData = (tickets, days) => {
    const now = new Date()
    const timeRange = days * 24 * 60 * 60 * 1000
    const startDate = new Date(now.getTime() - timeRange)

    const dailyData = {}

    for (let d = new Date(startDate); d <= now; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().split('T')[0]
      dailyData[dateStr] = {
        date: dateStr,
        opened: 0,
        closed: 0
      }
    }

    tickets.forEach(ticket => {
      const createdDate = new Date(ticket.createdDate).toISOString().split('T')[0]
      const closedDate = ticket.closeTime ? new Date(ticket.closeTime).toISOString().split('T')[0] : null

      if (dailyData[createdDate]) {
        dailyData[createdDate].opened += 1
      }

      if (closedDate && dailyData[closedDate]) {
        dailyData[closedDate].closed += 1
      }
    })

    return Object.values(dailyData).sort((a, b) => a.date.localeCompare(b.date))
  }

  const fetchDashboardData = async (companyId = 0) => {
    try {
      const response = await api.get(`/Tickets/Dashboard/${companyId}`)
      setDashboardData(response.data.data)

      const ticketsResponse = await api.get('/Tickets')
      const tickets = ticketsResponse.data.data

      const weeklyData = processTicketData(tickets, 7)
      const monthlyData = processTicketData(tickets, 30)

      setChartData(weeklyData)
      setMonthlyChartData(monthlyData)
    } catch (err) {
      toast.error(t('errorFetchingData'))
    }
  }

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const cardConfigs = [
    {
      // Row 1
      title: t('Open'),
      stats: dashboardData?.openTickets || 0,
      avatarColor: 'warning',
      avatarIcon: 'tabler:solution1',
      route: '/ticket?filter=openTickets'
    },
    {
      title: t('NotAssigned'),
      stats: dashboardData?.notAssigneds || 0,
      avatarColor: 'primary',
      avatarIcon: 'tabler:exception1',
      route: '/ticket?filter=notAssigneds'
    },
    {
      title: t('TransferRequest'),
      stats: dashboardData?.openTransfers || 0,
      avatarColor: 'success',
      avatarIcon: 'tabler:swap',
      route: '/ticket?filter=openTransfers'
    },
    {
      title: t('WaitingForSpareParts'),
      stats: dashboardData?.pendingMaterial || 0,
      avatarColor: 'warning',
      avatarIcon: 'tabler:shoppingcart',
      route: '/ticket?filter=pendingMaterial'
    },
    {
      title: t('ExternalSupport'),
      stats: dashboardData?.outSourceJobs || 0,
      avatarColor: 'error',
      avatarIcon: 'tabler:phone',
      route: '/ticket?filter=outSourceJobs'
    },
    {
      title: t('ChronicOnHold'),
      stats: dashboardData?.chronicOnHold || 0,
      avatarColor: 'error',
      avatarIcon: 'tabler:pushpino',
      route: '/ticket?filter=chronicOnHold'
    }
  ]

  const CustomLineChart = ({ data, title }) => {
    const theme = useTheme()

    return (
      <Card sx={{ height: '100%' }}>
        <CardContent>
          <Typography variant='h6' gutterBottom component='div' sx={{ mb: 3 }}>
            {title}
          </Typography>
          <Box sx={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <LineChart
                data={data}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5
                }}
              >
                <CartesianGrid strokeDasharray='3 3' />
                <XAxis dataKey='date' style={{ fontSize: '0.75rem' }} tick={{ fill: theme.palette.text.secondary }} />
                <YAxis style={{ fontSize: '0.75rem' }} tick={{ fill: theme.palette.text.secondary }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: theme.palette.background.paper,
                    border: `1px solid ${theme.palette.divider}`,
                    borderRadius: 4
                  }}
                />
                <Legend />
                <Line
                  type='monotone'
                  dataKey='opened'
                  stroke={theme.palette.primary.main}
                  activeDot={{ r: 8 }}
                  name='Opened Tickets'
                />
                <Line type='monotone' dataKey='closed' stroke={theme.palette.success.main} name='Closed Tickets' />
              </LineChart>
            </ResponsiveContainer>
          </Box>
        </CardContent>
      </Card>
    )
  }

  return (
    <Grid container spacing={6}>
      {/* Weekly Chart */}
      <Grid item xs={12} md={6}>
        <CustomLineChart data={chartData} title='Weekly Ticket Activity (Last 7 Days)' />
      </Grid>

      {/* Monthly Chart */}
      <Grid item xs={12} md={6}>
        <CustomLineChart data={monthlyChartData} title='Monthly Ticket Activity (Last 30 Days)' />
      </Grid>
      {cardConfigs.map((card, index) => (
        <Grid key={index} item xs={12} sm={6} md={4}>
          <Box
            onClick={() => router.push(card.route)}
            style={{
              cursor: 'pointer',
              transition: theme.transitions.create(['box-shadow', 'transform'], {
                duration: theme.transitions.duration.standard
              }),
              borderRadius: theme.shape.borderRadius
            }}
            sx={{
              '&:hover': {
                boxShadow: theme.shadows[4],
                transform: 'translateY(-4px)'
              }
            }}
          >
            <CardStatVertical
              title={card.title.toLocaleUpperCase(i18n.language)}
              subtitle={card.subtitle}
              stats={card.stats}
              avatarColor={card.avatarColor}
              avatarIcon={card.avatarIcon}
              avatarSkin='light'
              avatarSize={44}
              avatarIconSize={28}
            />
          </Box>
        </Grid>
      ))}
    </Grid>
  )
}
