import { useState } from 'react'
import {
  Badge,
  Box,
  Card,
  CardContent,
  CardHeader,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from '@mui/material'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import YachtsDialogContent from '@components/pages/(dashboard)/team-statistics/YachtDialogContent'
import { useTranslation } from 'next-i18next'

const YachtListWidget = ({ yachts, tickets }) => {
  const [dialogOpen, setDialogOpen] = useState(false)
  const { t } = useTranslation('common');

  // Group tickets for yachts
  const yachtTickets = tickets.reduce((acc, ticket) => {
    if (!acc[ticket.yachtId]) {
      acc[ticket.yachtId] = []
    }
    acc[ticket.yachtId].push(ticket)
    return acc
  }, {})

  const getYachtProgress = yachtId => {
    const assignedTickets = yachtTickets[yachtId] || []
    const closedTickets = assignedTickets.filter(t => t.closeTime)
    return assignedTickets.length > 0 ? (closedTickets.length / assignedTickets.length) * 100 : 0
  }

  return (
    <>
      <Card sx={{ height: '100%', cursor: 'pointer' }} onClick={() => setDialogOpen(true)}>
        <CardHeader
          title='Yacht List'
          action={
            <IconButton>
              <MoreVertIcon />
            </IconButton>
          }
        />
        <CardContent>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Yacht</TableCell>
                  <TableCell>HIN</TableCell>
                  <TableCell>Total</TableCell>
                  <TableCell>Progress</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {yachts.slice(0, 5).map(yacht => {
                  const progress = getYachtProgress(yacht.id)
                  return (
                    <TableRow key={yacht.id}>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Typography>{yacht.name}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell>{yacht.hin || 'N/A'}</TableCell>
                      <TableCell>
                        {yachtTickets[yacht.id]?.length || 0}
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Box sx={{ width: '100%', mr: 1 }}>
                            <LinearProgress variant='determinate' value={progress} />
                          </Box>
                          <Typography variant='body2'>{Math.round(progress)}%</Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Badge color={progress > 50 ? 'success' : 'warning'} variant='dot'>
                          {progress > 50 ? t('onTrack') : t('attentionNeeded')}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth='md' fullWidth>
        <DialogTitle>Yacht Details</DialogTitle>
        <DialogContent>
          <YachtsDialogContent yachts={yachts} tickets={tickets} />
        </DialogContent>
      </Dialog>
    </>
  )
}

export default YachtListWidget
