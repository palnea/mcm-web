import React from 'react'
import { Badge, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material'

const SupportTrackerDialogContent = ({tickets, t}) => {
  return (
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
          {tickets.map(ticket => (
            <TableRow key={ticket.id}>
              <TableCell>{ticket.id}</TableCell>
              <TableCell>{new Date(ticket.createdDate).toLocaleDateString()}</TableCell>
              <TableCell>
                <Badge color={ticket.closeTime ? 'success' : 'warning'} variant='dot'>
                  {ticket.closeTime ? t('Closed') : t('Open')}
                </Badge>
              </TableCell>
              <TableCell>{ticket.assignedToUserId}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default SupportTrackerDialogContent
