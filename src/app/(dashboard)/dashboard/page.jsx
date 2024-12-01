"use client";

import Grid from '@mui/material/Grid'
import React, { useEffect, useState } from 'react';
import CardStatVertical from '@/components/card-statistics/Vertical'
import { useTheme } from '@mui/material/styles'
import { useRouter } from 'next/navigation'
import api from '../../../api_helper/api';
// import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function Page() {
  const theme = useTheme()
  const router = useRouter()
  const [chartData, setChartData] = useState([]);
  const [dashboardData, setDashboardData] = useState(null);
  const [error, setError] = useState(null);

  const fetchDashboardData = async (companyId = 0) => {
    try {
      const response = await api.get(`/Tickets/Dashboard/${companyId}`);
      setDashboardData(response.data.data);

      const chartResponse = await api.get('/Tickets/GetOpenTicketsLastWeek/' + companyId);
      setChartData(chartResponse.data.data);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching dashboard data:', err);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const cardConfigs = [
    {
      // Row 1
      title: 'AÇIK',
      stats: dashboardData?.openTickets || 0,
      avatarColor: 'warning',
      avatarIcon: 'tabler:solution1',
      route: '/tickets/open'
    },
    {
      title: 'ATANMAYAN',
      stats: dashboardData?.notAssigneds || 0,
      avatarColor: 'primary',
      avatarIcon: 'tabler:exception1',
      route: '/tickets/unassigned'
    },
    // Row 2
    {
      title: 'AÇIK',
      subtitle: '24 Saattir',
      stats: dashboardData?.openTicketsLast24Hour || 0,
      avatarColor: 'warning',
      avatarIcon: 'tabler:hourglass',
      route: '/tickets/open-24h'
    },
    {
      title: 'KAPANAN',
      subtitle: 'Son 24 Saatte',
      stats: dashboardData?.closedLast24Hour || 0,
      avatarColor: 'success',
      avatarIcon: 'tabler:lock',
      route: '/tickets/closed-24h'
    },
    // Row 3
    {
      title: 'AÇIK',
      subtitle: '1 Haftadır',
      stats: dashboardData?.openLastOneWeek || 0,
      avatarColor: 'warning',
      avatarIcon: 'tabler:tool',
      route: '/tickets/open-week'
    },
    {
      title: 'KAPANAN',
      subtitle: 'Son 1 Haftada',
      stats: dashboardData?.closedLastOneWeek || 0,
      avatarColor: 'success',
      avatarIcon: 'tabler:checksquareo',
      route: '/tickets/closed-week'
    },
    // Row 4
    {
      title: 'MALZEME BEKLEYEN',
      stats: dashboardData?.pendingMaterial || 0,
      avatarColor: 'warning',
      avatarIcon: 'tabler:shoppingcart',
      route: '/tickets/pending-material'
    },
    {
      title: 'TRANSFER TALEBİ',
      stats: dashboardData?.openTransfers || 0,
      avatarColor: 'success',
      avatarIcon: 'tabler:swap',
      route: '/transfers'
    },
    // Row 5
    {
      title: 'DIŞ DESTEK',
      stats: dashboardData?.outSourceJobs || 0,
      avatarColor: 'error',
      avatarIcon: 'tabler:phone',
      route: '/tickets/outsource'
    },
    {
      title: 'KRONİK ONHOLD',
      stats: dashboardData?.chronicOnHold || 0,
      avatarColor: 'error',
      avatarIcon: 'tabler:pushpino',
      route: '/tickets/chronic'
    }
  ];

  return (
    <Grid container spacing={6}>
      {cardConfigs.map((card, index) => (
        <Grid key={index} item xs={12} sm={6} md={4} lg={3}>
          <div
            onClick={() => console.log("clicked on a stats card")}
            className="cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-1"
          >
            <CardStatVertical
              title={card.title}
              subtitle={card.subtitle}
              stats={card.stats}
              avatarColor={card.avatarColor}
              avatarIcon={card.avatarIcon}
              avatarSkin='light'
              avatarSize={44}
              avatarIconSize={28}
            />
          </div>
        </Grid>
      ))}
    </Grid>
  )
}
