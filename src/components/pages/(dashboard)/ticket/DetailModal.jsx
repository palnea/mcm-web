import {
  Box, Button, Chip,
  Dialog, DialogActions,
  DialogContent,
  DialogTitle,
  Paper, Table, TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography
} from '@mui/material'
import React from 'react'
import { useTranslation } from 'react-i18next'

// Priority options for tickets
export const priorityOptions = [
  { label: 'Low', value: 1, color: 'info' },
  { label: 'Medium', value: 2, color: 'warning' },
  { label: 'High', value: 3, color: 'error' }
]

// Status configurations with colors and icons
export const statusConfig = {
  Open: { color: 'info', icon: '🔵' },
  Assigned: { color: 'warning', icon: '🟡' },
  Closed: { color: 'success', icon: '🟢' }
}

const DetailModal = ({ ticket, open, onClose }) => {
  const { t, i18n } = useTranslation('common');

  if (!ticket) return null

  const DetailRow = ({ label, value }) => (
    <TableRow>
      <TableCell component="th" scope="row" sx={{ fontWeight: 'bold', width: '200px' }}>
        {label}:
      </TableCell>
      <TableCell>{value}</TableCell>
    </TableRow>
  )

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">{t("Ticket Details")} - {ticket.ticketCode}</Typography>
          {getStatusChip(ticket, t)}
        </Box>
      </DialogTitle>
      <DialogContent>
        <TableContainer component={Paper} elevation={0}>
          <Table>
            <TableBody>
              <DetailRow label={t("Description")} value={ticket.description} />
              <DetailRow label={t("District")} value={ticket.district} />
              <DetailRow label={t("Priority")} value={getPriorityChip(ticket.priority, t)} />
              <DetailRow label={t("Created Date")} value={new Date(ticket.createdDate).toLocaleString(i18n.language)} />
              <DetailRow label={t("Updated Date")} value={new Date(ticket.updatedDate).toLocaleString(i18n.language)} />
              <DetailRow
                label={t("Close Time")}
                value={ticket.closeTime ? new Date(ticket.closeTime).toLocaleString(i18n.language) : '-'}
              />
              <DetailRow
                label={t("Assign Time")}
                value={ticket.assignTime ? `${new Date(ticket.assignTime).toLocaleDateString(i18n.language)} ${new Date(ticket.assignTime).toLocaleTimeString(i18n.language)}` : '-'}
              />
              <DetailRow label={t("Close Description")} value={ticket.closeDescription || '-'} />
              <DetailRow
                label={t("Status Checks")}
                value={
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <Chip
                      label={t("Operator OK")}
                      color={ticket.operatorOk ? 'success' : 'default'}
                      variant={ticket.operatorOk ? 'filled' : 'outlined'}
                    />
                    <Chip
                      label={t("Technic OK")}
                      color={ticket.technicOk ? 'success' : 'default'}
                      variant={ticket.technicOk ? 'filled' : 'outlined'}
                    />
                    <Chip
                      label={t("Quality OK")}
                      color={ticket.qualityOk ? 'success' : 'default'}
                      variant={ticket.qualityOk ? 'filled' : 'outlined'}
                    />
                  </Box>
                }
              />
            </TableBody>
          </Table>
        </TableContainer>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          {t("Close")}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export const getStatusChip = (row, t) => {
  let status = 'Open'
  if (row.operatorOk && row.technicOk && row.qualityOk) status = 'Closed'
  else if (row.assignedToUserId) status = 'Assigned'

  const config = statusConfig[status]
  return (
    <Chip
      label={
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, fontWeight: '600' }}>
          {/*<span>{config.icon}</span>*/}
          <span>{t(status)}</span>
        </Box>
      }
      color={config.color}
      variant="outlined"
      sx={{
        minWidth: '100px',
        '& .MuiChip-label': {
          display: 'flex',
          alignItems: 'center'
        }
      }}
    />
  )
}

export const getPriorityChip = (priority, t) => {
  const priorityConfig = priorityOptions.find(opt => opt.value === priority)
  return (
    <Chip
      label={t(priorityConfig.label)}
      color={priorityConfig.color}
      variant="outlined"
      size="small"
    />
  )
}

export default DetailModal;
