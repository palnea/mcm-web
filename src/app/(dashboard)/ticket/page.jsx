'use client'

import React, { useEffect, useState } from 'react'
import {
  Button,
  Card,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography
} from '@mui/material'
import { useTranslation } from 'react-i18next'
import api from '@/api_helper/api'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import DeleteItemModal from '@components/pages/(dashboard)/yacht/brand/DeleteItemModal'
import DetailModal, {
  getPriorityChip,
  getStatusChip,
  priorityOptions
} from '@components/pages/(dashboard)/ticket/DetailModal'
import CustomTable from '@components/Table/CustomTable'
import TicketFilters from '@components/pages/(dashboard)/ticket/TicketFilters'

export default function Page() {
  const [open, setOpen] = useState(false)
  const [editID, setEditID] = useState('')
  const [removeID, setRemoveID] = useState('')
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(false)
  const [openDeleteModal, setOpenDeleteModal] = useState(false)
  const [nameDel, setNameDel] = useState('')
  const [isEdit, setIsEdit] = useState(false)
  const [detailModalOpen, setDetailModalOpen] = useState(false)
  const [selectedTicket, setSelectedTicket] = useState(null)
  const { t, i18n } = useTranslation('common')
  const [filteredRows, setFilteredRows] = useState([])

  const [errors, setErrors] = useState({
    description: '',
    district: '',
    priority: '',
    faultTypeId: ''
  })

  const [params, setParams] = useState({
    description: '',
    district: '',
    yachtId: null,
    priority: 1,
    faultTypeId: null,
    companyId: null,
    operatorOk: false,
    technicOk: false,
    qualityOk: false
  })

  const clearParams = () => {
    setParams({
      description: '',
      district: '',
      yachtId: null,
      priority: 1,
      faultTypeId: null,
      companyId: null,
      operatorOk: false,
      technicOk: false,
      qualityOk: false
    })
    setErrors({
      description: '',
      district: '',
      priority: '',
      faultTypeId: ''
    })
  }

  // Fetch tickets data
  const fetchData = async () => {
    try {
      const response = await api.get('/Tickets')
      setRows(response.data.data)
    } catch (err) {
      console.error('Error fetching tickets:', err)
      toast.error(t('Error fetching tickets'))
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    setFilteredRows(rows)
  }, [rows])

  const handleRowClick = row => {
    setSelectedTicket(row)
    setDetailModalOpen(true)
  }

  const columns = [
    {
      id: 'ticketCode',
      label: 'ticketCode',
      render: row => (
        <Button
          color='primary'
          sx={{
            textTransform: 'none',
            textDecoration: 'underline',
            padding: '0',
            minWidth: 'auto',
            '&:hover': {
              bgcolor: 'transparent',
              textDecoration: 'underline',
              color: 'primary.dark'
            }
          }}
          onClick={e => {
            e.stopPropagation()
            handleRowClick(row)
          }}
        >
          {row.ticketCode}
        </Button>
      )
    },
    { id: 'description', label: 'description' },
    { id: 'district', label: 'district' },
    {
      id: 'priority',
      label: 'priority',
      render: row => getPriorityChip(row.priority, t)
    },
    {
      id: 'status',
      label: 'status',
      render: row => getStatusChip(row, t)
    },
    {
      id: 'createdDate',
      label: 'createdDate',
      render: row => new Date(row.createdDate).toLocaleDateString()
    }
    // {
    //   id: 'actions',
    //   label: 'actions',
    //   disableSorting: true,
    //   render: row => (
    //     <Box onClick={e => e.stopPropagation()}>
    //       <IconButton size='small' color='primary' onClick={() => handleEdit(row)}>
    //         <i className='tabler-pencil' />
    //       </IconButton>
    //       <IconButton color='error' size='small' onClick={() => handleDelete(row.id, row.ticketCode)}>
    //         <i className='tabler-trash' />
    //       </IconButton>
    //     </Box>
    //   )
    // }
  ]

  const handleEdit = row => {
    setIsEdit(true)
    setEditID(row.id)
    setParams(row)
    handleOpen()
  }

  const handleDelete = (id, ticketCode) => {
    setOpenDeleteModal(true)
    setNameDel(ticketCode)
    setRemoveID(id)
  }

  const handleOpen = () => setOpen(true)
  const handleClose = () => {
    setOpen(false)
    setIsEdit(false)
    clearParams()
  }

  const handleSave = async event => {
    event.preventDefault()
    let newErrors = {}

    if (!params.description) newErrors.description = 'Description is required'
    if (!params.district) newErrors.district = 'District is required'
    if (!params.priority) newErrors.priority = 'Priority is required'

    setErrors(newErrors)

    if (Object.keys(newErrors).length === 0) {
      setLoading(true)
      try {
        const response = isEdit ? await api.put('/Tickets/Update', params) : await api.post('/Tickets', params)

        if (response.status >= 200 && response.status < 300) {
          setTimeout(() => handleClose(), 800)
          setTimeout(
            () => toast.success(isEdit ? t('Ticket updated successfully!') : t('Ticket created successfully!')),
            800
          )
          setTimeout(fetchData, 500)
        }
      } catch (err) {
        console.error('Error:', err)
        toast.error(t('An error occurred. Please try again.'))
      } finally {
        setLoading(false)
      }
    }
  }

  const handleDelSave = async () => {
    setLoading(true)
    try {
      const response = await api.get('/Tickets/Remove/' + removeID)
      if (response.status >= 200 && response.status < 300) {
        setTimeout(() => setOpenDeleteModal(false), 800)
        setTimeout(() => toast.success(t('Ticket deleted successfully!')), 800)
        setTimeout(fetchData, 500)
      }
    } catch (err) {
      console.error('Error:', err)
      toast.error(t('An error occurred. Please try again.'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <ToastContainer position='top-right' autoClose={3000} hideProgressBar={false} closeOnClick pauseOnHover />

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{isEdit ? t('editTicket') : t('createNewTicket')}</DialogTitle>
        <form noValidate autoComplete='off' onSubmit={handleSave}>
          <DialogContent sx={{ minWidth: '500px' }}>
            <Grid container spacing={4}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label={t('description')}
                  value={params.description}
                  onChange={e => setParams({ ...params, description: e.target.value })}
                  error={!!errors.description}
                  helperText={errors.description}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label={t('district')}
                  value={params.district}
                  onChange={e => setParams({ ...params, district: e.target.value })}
                  error={!!errors.district}
                  helperText={errors.district}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth error={!!errors.priority}>
                  <InputLabel>{t('priority')}</InputLabel>
                  <Select
                    value={params.priority}
                    label={t('priority')}
                    onChange={e => setParams({ ...params, priority: e.target.value })}
                  >
                    {priorityOptions.map(option => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                  <FormHelperText>{errors.priority}</FormHelperText>
                </FormControl>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color='secondary'>
              {t('cancel')}
            </Button>
            <Button type='submit' color='primary' disabled={loading}>
              {loading ? <CircularProgress size={24} /> : isEdit ? t('edit') : t('create')}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      <DeleteItemModal
        open={openDeleteModal}
        onClose={() => setOpenDeleteModal(false)}
        onConfirm={handleDelSave}
        language={i18n.language}
        deleteTitle={t('deleteTicket')}
        deleteMessage={t('deleteTicketMessage')}
        cancelText={t('cancel')}
        deleteText={t('delete')}
      />

      <DetailModal ticket={selectedTicket} open={detailModalOpen} onClose={() => setDetailModalOpen(false)} />

      <Grid container spacing={6}>
        <Grid item xs={12} sm={6}>
          <Typography variant='h4'>{t('tickets')}</Typography>
        </Grid>
        <Grid item xs={12}>
          <Card>
            {/*<div className='flex justify-end p-3'>*/}
            {/*  <IconButton variant='contained' color='success' onClick={handleOpen}>*/}
            {/*    <i className='tabler-plus' />*/}
            {/*  </IconButton>*/}
            {/*</div>*/}
            <TicketFilters
              rows={rows}
              setFilteredRows={setFilteredRows}
            />
            <CustomTable rows={filteredRows} columns={columns} rowProps={{ style: { cursor: 'pointer' } }} />
          </Card>
        </Grid>
      </Grid>
    </>
  )
}
