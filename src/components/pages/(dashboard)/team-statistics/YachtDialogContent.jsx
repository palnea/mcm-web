import React, { useState, useEffect } from 'react'
import {
  Box,
  TextField,
  InputAdornment,
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'

export const YachtsDialogContent = ({ yachts, tickets, t }) => {
  const [selectedYacht, setSelectedYacht] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredYachts, setFilteredYachts] = useState(yachts)

  const getYachtStats = yachtId => {
    const yachtTickets = tickets.filter(t => t.yachtId === yachtId)
    const closedTickets = yachtTickets.filter(t => t.closeTime)
    const chronicTickets = yachtTickets.filter(t => t.isChronic)

    return {
      total: yachtTickets.length,
      closed: closedTickets.length,
      chronic: chronicTickets.length,
      completionRate: yachtTickets.length ? (closedTickets.length / yachtTickets.length) * 100 : 0
    }
  }

  useEffect(() => {
    const searchableFields = ['name', 'hin', 'model', 'code', 'officialNumber', 'port', 'shipType']

    const filtered = yachts.filter(yacht =>
      searchableFields.some(field =>
        yacht[field]?.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    )
    setFilteredYachts(filtered)
  }, [searchTerm, yachts])

  return (
    <Box>
      <Box sx={{ p: 2 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder={t('Search yachts...')}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ mb: 2 }}
        />
      </Box>
      <TableContainer component={Paper} elevation={3}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell>{t('Yacht')}</TableCell>
              <TableCell>{t('HIN')}</TableCell>
              <TableCell>{t('Total Tickets')}</TableCell>
              <TableCell>{t('Performance')}</TableCell>
              <TableCell>{t('Status')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredYachts.map(yacht => {
              const stats = getYachtStats(yacht.id)
              return (
                <YachtExpandableRow
                  key={yacht.id}
                  yacht={yacht}
                  stats={stats}
                  tickets={tickets}
                  onToggle={() => setSelectedYacht(selectedYacht === yacht.id ? null : yacht.id)}
                  t={t}
                />
              )
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  )
}

const YachtExpandableRow = ({ yacht, stats, tickets, isExpanded, onToggle, t }) => {
  const yachtTickets = tickets.filter(t => t.yachtId === yacht.id)
  isExpanded = true;

  const getTicketPriorityStats = () => {
    return yachtTickets.reduce((acc, ticket) => {
      acc[ticket.priority] = (acc[ticket.priority] || 0) + 1
      return acc
    }, {})
  }

  const priorityStats = getTicketPriorityStats()

  return (
    <>
      <TableRow
        sx={{
          '& > *': { borderBottom: 'unset' },
          // '&:hover': { backgroundColor: 'action.hover' }
        }}
      >
        {/*<TableCell>*/}
        {/*  <IconButton size='small' onClick={onToggle}>*/}
        {/*    {isExpanded ? <KeyboardArrowUp /> : <KeyboardArrowDown />}*/}
        {/*  </IconButton>*/}
        {/*</TableCell>*/}
        <TableCell>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
              <DirectionsBoat />
            </Avatar>
            <Box>
              <Typography variant='subtitle2'>{yacht.name}</Typography>
              <Typography variant='body2' color='text.secondary'>
                {t('Model')}: {yacht.model || t('N/A')}
              </Typography>
            </Box>
          </Box>
        </TableCell>
        <TableCell>{yacht.hin || t('N/A')}</TableCell>
        <TableCell>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Chip label={t('Total') + ': ' + stats.total} size='small' color='primary' variant='outlined' />
            <Chip
              label={t('Chronic') + ': ' + stats.chronic}
              size='small'
              color={stats.chronic > 0 ? 'error' : 'success'}
              variant='outlined'
            />
          </Box>
        </TableCell>
        <TableCell>
          <Box sx={{ display: 'flex', alignItems: 'center', minWidth: 200 }}>
            <Box sx={{ width: '100%', mr: 1 }}>
              <LinearProgress
                variant='determinate'
                value={stats.completionRate}
                sx={{
                  height: 8,
                  borderRadius: 5,
                  '& .MuiLinearProgress-bar': {
                    borderRadius: 5,
                    backgroundColor: stats.chronic > 0 ? 'warning.main' : 'success.main'
                  }
                }}
              />
            </Box>
            <Typography variant='body2' color='text.secondary'>
              {Math.round(stats.completionRate)}%
            </Typography>
          </Box>
        </TableCell>
        <TableCell>
          <Chip
            icon={stats.completionRate > 70 ? <CheckCircle /> : stats.chronic > 0 ? <ErrorOutline /> : <AccessTime />}
            label={stats.completionRate > 70 ? t('Excellent') : stats.chronic > 0 ? t('Needs Attention') : t('In Progress')}
            color={stats.completionRate > 70 ? 'success' : stats.chronic > 0 ? 'error' : 'warning'}
            size='small'
          />
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={isExpanded} timeout='auto' unmountOnExit>
            <Box sx={{ margin: 3 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Card>
                    <CardContent>
                      <Typography variant='h6' gutterBottom>
                        {t('Ticket Priority Distribution')}
                      </Typography>
                      <ResponsiveContainer width='100%' height={200}>
                        <BarChart
                          data={Object.entries(priorityStats).map(([priority, count]) => ({
                            priority,
                            count
                          }))}
                        >
                          <CartesianGrid strokeDasharray='3 3' />
                          <XAxis dataKey='priority' />
                          <YAxis />
                          <Tooltip />
                          <Bar
                            dataKey='count'
                            fill="#8884d8"
                            name={t("Tickets")}
                            isAnimationActive={true}
                          >
                            {Object.entries(priorityStats).map(([priority, count]) =>
                              <Cell
                                key={priority}
                                fill={
                                  priority === "1"
                                    ? '#10b981'
                                    : priority === "2"
                                      ? '#f5c20b'
                                      : priority === "3"
                                        ? '#f59e0b'
                                        : priority === "4"
                                          ? '#f87171'
                                          : priority === "5"
                                            ? '#ef4444'
                                            : '#8884d8'
                                }
                              />
                            )}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Card>
                    <CardContent>
                      <Typography variant='h6' gutterBottom>
                        {t('Recent Tickets')}
                      </Typography>
                      <List>
                        {yachtTickets
                          .sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate))
                          .slice(0, 5)
                          .map(ticket => (
                            <React.Fragment key={ticket.id}>
                              <ListItem
                                secondaryAction={
                                  <Chip
                                    size='small'
                                    label={t(ticket.priority)}
                                    color={
                                      ticket.priority === 'High'
                                        ? 'error'
                                        : ticket.priority === 'Medium'
                                          ? 'warning'
                                          : 'info'
                                    }
                                  />
                                }
                              >
                                <ListItemAvatar>
                                  <Avatar
                                    sx={{
                                      bgcolor: ticket.closeTime
                                        ? 'success.light'
                                        : ticket.isChronic
                                          ? 'error.light'
                                          : 'warning.light'
                                    }}
                                  >
                                    {ticket.closeTime ? (
                                      <CheckCircle />
                                    ) : ticket.isChronic ? (
                                      <ErrorOutline />
                                    ) : (
                                      <Assignment />
                                    )}
                                  </Avatar>
                                </ListItemAvatar>
                                <ListItemText
                                  primary={ticket.subject}
                                  secondary={
                                    <>
                                      <Typography component='span' variant='body2' color='text.primary'>
                                        {ticket.closeTime ? t('Closed') : ticket.isChronic ? t('Chronic Issue') : t('Open')}
                                      </Typography>
                                      {` — ${new Date(ticket.createdDate).toLocaleDateString()}`}
                                    </>
                                  }
                                />
                              </ListItem>
                              <Divider variant='inset' component='li' />
                            </React.Fragment>
                          ))}
                      </List>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12}>
                  <Card>
                    <CardContent>
                      <Typography variant='h6' gutterBottom>
                        {t('Yacht Details')}
                      </Typography>
                      <Grid container spacing={2}>
                        <Grid item xs={6} md={3}>
                          <Typography color='text.secondary' variant='body2'>
                            {t('Name')}
                          </Typography>
                          <Typography variant='body1'>{yacht.name}</Typography>
                        </Grid>
                        <Grid item xs={6} md={3}>
                          <Typography color='text.secondary' variant='body2'>
                            {t('HIN')}
                          </Typography>
                          <Typography variant='body1'>{yacht.hin || t('N/A')}</Typography>
                        </Grid>
                        <Grid item xs={6} md={3}>
                          <Typography color='text.secondary' variant='body2'>
                            {t('Model')}
                          </Typography>
                          <Typography variant='body1'>{yacht.model || t('N/A')}</Typography>
                        </Grid>
                        <Grid item xs={6} md={3}>
                          <Typography color='text.secondary' variant='body2'>
                            {t('Year')}
                          </Typography>
                          <Typography variant='body1'>{yacht.year || t('N/A')}</Typography>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  )
}

export default YachtsDialogContent
