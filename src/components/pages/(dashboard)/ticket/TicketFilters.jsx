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
      border: isActive ? '2px solid' : '1px solid',
      borderColor: isActive ? 'primary.main' : 'divider',
      borderRadius: 2,
      '&:hover': {
        borderColor: 'primary.main'
      }
    }}
  >
    <Typography variant="body2" color="textSecondary" mb={1}>
      {text}
    </Typography>
    <Typography variant="h6" color="primary">
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
