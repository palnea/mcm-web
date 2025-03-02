import React, { useState, useEffect } from 'react'
import { Box, Button, Typography } from '@mui/material'
import { useRouter, useSearchParams } from 'next/navigation'
import { useTranslation } from 'next-i18next'

const FilterButton = ({ text, count, isActive, onClick }) => (
  <Button
    onClick={onClick}
    sx={{
      height: '100px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      flex: 1,
      m: 1,
      border: 'none',
      borderRadius: 2,
      margin: 5,
      position: 'relative',
      overflow: 'hidden',
      background: isActive
        ? 'linear-gradient(135deg, #1976d2 100%, rgba(25, 118, 210, 0.85) 0%)'
        : 'background.paper',
      boxShadow: isActive ? '0 4px 12px rgba(0, 0, 0, 0.1)' : 'none',
      transform: isActive ? 'translateY(-2px)' : 'none',
      transition: 'all 0.3s ease',
      '&:hover': {
        backgroundColor: !isActive ? 'rgba(0, 0, 0, 0.02)' : undefined,
        transform: 'translateY(-2px)',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
      },

    }}
  >
    <Typography
      variant="body2"
      color={isActive ? 'white' : 'textSecondary'}
      mb={1}
      sx={{
        fontWeight: isActive ? 600 : 400,
        transition: 'all 0.3s ease',
      }}
    >
      {text}
    </Typography>
    <Typography
      variant="h6"
      color={isActive ? 'white' : 'primary'}
      sx={{
        fontWeight: isActive ? 700 : 500,
        fontSize: isActive ? '1.5rem' : '1.25rem',
        transition: 'all 0.3s ease',
      }}
    >
      {count}
    </Typography>
  </Button>
)

const TicketFilters = ({ rows, setFilteredRows}) => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [activeFilter, setActiveFilter] = useState(searchParams.get('filter') || null)
  const [counts, setCounts] = useState({
    openTickets: 0,
    notAssigneds: 0,
    openTransfers: 0,
    pendingMaterial: 0,
    outSourceJobs: 0,
    chronicOnHold: 0
  })
  const { t } = useTranslation('common')

  const filterConfigs = [
    {
      key: 'openTickets',
      text: t('Open'),
      filter: ticket => !ticket.closeTime
    },
    {
      key: 'notAssigneds',
      text: t('NotAssigned'),
      filter: ticket => !ticket.assignedToUserId
    },
    {
      key: 'openTransfers',
      text: t('TransferRequest'),
      filter: ticket => ticket.transferRequested
    },
    {
      key: 'pendingMaterial',
      text: t('WaitingForSpareParts'),
      filter: ticket => ticket.waitingForParts
    },
    {
      key: 'outSourceJobs',
      text: t('ExternalSupport'),
      filter: ticket => ticket.externalSupport
    },
    {
      key: 'chronicOnHold',
      text: t('Chronic'),
      filter: ticket => ticket.chronic
    }
  ]

  useEffect(() => {
    const newCounts = {
      openTickets: rows.filter(ticket => !ticket.operatorOk && !ticket.technicOk && !ticket.qualityOk).length,
      notAssigneds: rows.filter(ticket => !ticket.assignedToUserId).length,
      openTransfers: rows.filter(ticket => ticket.transferRequested).length,
      pendingMaterial: rows.filter(ticket => ticket.waitingForParts).length,
      outSourceJobs: rows.filter(ticket => ticket.externalSupport).length,
      chronicOnHold: rows.filter(ticket => ticket.chronic).length
    }
    setCounts(newCounts)
  }, [rows])

  useEffect(() => {
    const filterFromUrl = searchParams.get('filter')
    if (filterFromUrl) {
      const config = filterConfigs.find(c => c.key === filterFromUrl)
      if (config) {
        setActiveFilter(filterFromUrl)
        setFilteredRows(rows.filter(config.filter))
      }
    } else {
      setActiveFilter(null)
      setFilteredRows(rows)
    }
  }, [searchParams, rows])

  const handleFilterClick = (filterKey) => {
    if (activeFilter === filterKey) {
      const params = new URLSearchParams(searchParams)
      params.delete('filter')
      router.push(`?${params.toString()}`)
    } else {
      const params = new URLSearchParams(searchParams)
      params.set('filter', filterKey)
      router.push(`?${params.toString()}`)
    }
  }

  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', mb: 4 }}>
      {filterConfigs.map((config) => (
        <FilterButton
          key={config.key}
          text={config.text}
          count={counts[config.key]}
          isActive={activeFilter === config.key}
          onClick={() => handleFilterClick(config.key)}
        />
      ))}
    </Box>
  )
}

export default TicketFilters
