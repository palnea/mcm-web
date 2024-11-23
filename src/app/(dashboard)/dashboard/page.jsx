"use client";

import Grid from '@mui/material/Grid'
import React, { useEffect, useState } from 'react';
import CardStatVertical from '@/components/card-statistics/Vertical'
import { useTheme } from '@mui/material/styles'
import { useRouter } from 'next/navigation'
import api from '../../../api_helper/api';

export default function Page() {
  const theme = useTheme()
  const router = useRouter()
  const [dashboardData, setDashboardData] = useState(null);
  const [error, setError] = useState(null);

  const fetchDashboardData = async (companyId = 1) => {
    try {
      const response = await api.get(`/Tickets/Dashboard/${companyId}`);
      setDashboardData(response.data.data);
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
      title: 'Açık Talepler',
      stats: dashboardData?.openTickets || 0,
      avatarColor: 'warning',
      avatarIcon: 'tabler:alert-circle',
      avatarSkin: 'light',
      avatarSize: 44,
      avatarIconSize: 28,
      route: '/tickets/open'
    },
    {
      title: 'Atanmayan Talepler',
      stats: dashboardData?.notAssigneds || 0,
      avatarColor: 'primary',
      avatarIcon: 'tabler:exclamation-circle',
      avatarSkin: 'light',
      avatarSize: 44,
      avatarIconSize: 28,
      route: '/tickets/unassigned'
    },
    {
      title: '24 Saattir Açık Talepler',
      stats: dashboardData?.openTicketsLast24Hour || 0,
      avatarColor: 'warning',
      avatarIcon: 'tabler:clock',
      avatarSkin: 'light',
      avatarSize: 44,
      avatarIconSize: 28,
      route: '/tickets/open-24h'
    },
    {
      title: 'Son 24 Saatte Kapanan',
      stats: dashboardData?.closedLast24Hour || 0,
      avatarColor: 'success',
      avatarIcon: 'tabler:check-circle',
      avatarSkin: 'light',
      avatarSize: 44,
      avatarIconSize: 28,
      route: '/tickets/closed-24h'
    },
    {
      title: '1 Haftadır Açık',
      stats: dashboardData?.openLastOneWeek || 0,
      avatarColor: 'warning',
      avatarIcon: 'tabler:alert-triangle',
      avatarSkin: 'light',
      avatarSize: 44,
      avatarIconSize: 28,
      route: '/tickets/open-week'
    },
    {
      title: 'Son 1 Haftada Kapanan',
      stats: dashboardData?.closedLastOneWeek || 0,
      avatarColor: 'success',
      avatarIcon: 'tabler:check',
      avatarSkin: 'light',
      avatarSize: 44,
      avatarIconSize: 28,
      route: '/tickets/closed-week'
    },
    {
      title: 'Malzeme Bekleyen',
      stats: dashboardData?.pendingMaterial || 0,
      avatarColor: 'warning',
      avatarIcon: 'tabler:shopping-cart',
      avatarSkin: 'light',
      avatarSize: 44,
      avatarIconSize: 28,
      route: '/tickets/pending-material'
    },
    {
      title: 'Transfer Talebi',
      stats: dashboardData?.openTransfers || 0,
      avatarColor: 'success',
      avatarIcon: 'tabler:exchange',
      avatarSkin: 'light',
      avatarSize: 44,
      avatarIconSize: 28,
      route: '/transfers'
    },
    {
      title: 'Dış Destek',
      stats: dashboardData?.outSourceJobs || 0,
      avatarColor: 'error',
      avatarIcon: 'tabler:phone',
      avatarSkin: 'light',
      avatarSize: 44,
      avatarIconSize: 28,
      route: '/tickets/outsource'
    },
    {
      title: 'Kronik OnHold',
      stats: dashboardData?.chronicOnHold || 0,
      avatarColor: 'error',
      avatarIcon: 'tabler:pin',
      avatarSkin: 'light',
      avatarSize: 44,
      avatarIconSize: 28,
      route: '/tickets/chronic'
    }
  ];

  return (
    <Grid container spacing={6}>
      {cardConfigs.map((card, index) => (
        <Grid key={index} item xs={12} sm={6} md={4} lg={3}>
          <div
            onClick={() => router.push(card.route)}
            className="cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-1"
          >
            <CardStatVertical
              title={card.title}
              stats={card.stats}
              avatarColor={card.avatarColor}
              avatarIcon={card.avatarIcon}
              avatarSkin={card.avatarSkin}
              avatarSize={card.avatarSize}
              avatarIconSize={card.avatarIconSize}
            />
          </div>
        </Grid>
      ))}
    </Grid>
  )
}
