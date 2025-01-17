import React, { useEffect, useState } from 'react'
import { Box, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material'

const UserDetails = ({ user, tickets, t }) => {
  const [userStats, setUserStats] = useState({
    openedTickets: 0,
    assignedTickets: 0,
    processedTickets: 0
  })

  useEffect(() => {
    const stats = {
      openedTickets: tickets.filter(ticket => ticket.createdBy === user.userId).length,
      assignedTickets: tickets.filter(ticket => ticket.assignedToUserId === user.userId).length,
      processedTickets: tickets.filter(
        ticket => ticket.assignedToUserId === user.userId && ticket.processes?.length > 0
      ).length
    }
    setUserStats(stats)
  }, [user, tickets])

  return (
    <Box margin={1}>
      <Typography variant='h6' gutterBottom component='div'>
        {t('User Statistics')}
      </Typography>
      <Table size='small'>
        <TableHead>
          <TableRow>
            <TableCell>{t('Opened Tickets')}</TableCell>
            <TableCell>{t('Assigned Tickets')}</TableCell>
            <TableCell>{t('Processed Tickets')}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell>{userStats.openedTickets}</TableCell>
            <TableCell>{userStats.assignedTickets}</TableCell>
            <TableCell>{userStats.processedTickets}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </Box>
  )
}

export default UserDetails
