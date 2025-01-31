import React, { useState } from 'react'
import { Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from '@mui/material'

const SupportTrackerDialogContent = ({ tickets, t }) => {
  const [startDate, setStartDate] = useState(!!tickets && tickets.length > 0 ? tickets.slice(-1)[0].createdDate?.toISOString().split('T')[0] : '')
  const [endDate, setEndDate] = useState(!!tickets && tickets.length > 0 ? tickets[0].createdDate?.toISOString().split('T')[0] : '')

  const filteredTickets = tickets.filter(ticket => {
    if (!startDate && !endDate) return true

    const ticketDate = new Date(ticket.createdDate)
    const start = startDate ? new Date(startDate) : null
    const end = endDate ? new Date(endDate) : null
    end?.setHours(23, 59, 59, 999)

    if (start && end) return ticketDate >= start && ticketDate <= end
    if (start) return ticketDate >= start
    if (end) return ticketDate <= end
    return true
  })

  return (
    <>
      <Box sx={{ mb: 2, display: 'flex', gap: 2 }}>
        <TextField
          type='date'
          label={t('Start Date')}
          value={startDate}
          onChange={e => setStartDate(e.target.value)}
          variant='standard'
          InputLabelProps={{ shrink: true }}
          inputProps={{ max: endDate || undefined }}
        />
        <TextField
          type='date'
          label={t('End Date')}
          value={endDate}
          onChange={e => setEndDate(e.target.value)}
          variant='standard'
          InputLabelProps={{ shrink: true }}
          inputProps={{ min: startDate || undefined }}
        />
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>{t('Ticket ID')}</TableCell>
              <TableCell>{t('Created Date')}</TableCell>
              <TableCell>{t('Status')}</TableCell>
              <TableCell>{t('Assigned To')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredTickets.map(ticket => (
              <TableRow key={ticket.id}>
                <TableCell>{ticket.id}</TableCell>
                <TableCell>{new Date(ticket.createdDate).toLocaleDateString()}</TableCell>
                <TableCell>{ticket.closeTime ? t('Closed') : t('Open')}</TableCell>
                <TableCell>{ticket.assignedToUserId}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  )
}

export default SupportTrackerDialogContent
