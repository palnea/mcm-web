import React, { useEffect, useState } from 'react'
import { Box, Collapse, IconButton, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'

const YachtRow = ({ yacht, tickets }) => {
  const [open, setOpen] = useState(false)
  const [yachtStats, setYachtStats] = useState({
    totalTickets: tickets.length,
    closedTickets: 0,
    processedTickets: 0,
    chronicTickets: 0,
    pendingTickets: 0
  })

  useEffect(() => {
    if (open) {
      const yachtTickets = tickets.filter(t => t.yachtId === yacht.id)
      const stats = {
        totalTickets: yachtTickets.length,
        closedTickets: yachtTickets.filter(t => t.closeTime).length,
        processedTickets: yachtTickets.filter(t => t.processes?.length > 0).length,
        chronicTickets: yachtTickets.filter(t => t.isChronic).length,
        pendingTickets: yachtTickets.filter(t => !t.closeTime).length
      }
      setYachtStats(stats)
    }
  }, [open, yacht, tickets])

  return (
    <>
      <TableRow>
        <TableCell>
          <IconButton size='small' onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell>{yacht.name}</TableCell>
        <TableCell>{yachtStats.totalTickets}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout='auto' unmountOnExit>
            <Box margin={1}>
              <Typography variant='h6' gutterBottom component='div'>
                Yacht Statistics
              </Typography>
              <Table size='small'>
                <TableHead>
                  <TableRow>
                    <TableCell>Closed Tickets</TableCell>
                    <TableCell>Processed Tickets</TableCell>
                    <TableCell>Chronic Tickets</TableCell>
                    <TableCell>Pending Tickets</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>{yachtStats.closedTickets}</TableCell>
                    <TableCell>{yachtStats.processedTickets}</TableCell>
                    <TableCell>{yachtStats.chronicTickets}</TableCell>
                    <TableCell>{yachtStats.pendingTickets}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  )
}

export default YachtRow;
