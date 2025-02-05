'use client' // Add this line at the top
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import FormLayout from '@components/form/FormLayout'
import CustomTable from '../../../../components/Table/CustomTable'
import Card from '@mui/material/Card'
import React, { useEffect, useState } from 'react'
import * as https from 'https'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import { CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Select } from '@mui/material'
import TextField from '@mui/material/TextField'
import { useTranslation } from 'react-i18next'
import secureLocalStorage from 'react-secure-storage'
import Box from '@mui/material/Box'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { CloudUpload as CloudUploadIcon } from '@mui/icons-material'
import InputAdornment from '@mui/material/InputAdornment'
import api from '../../../../api_helper/api'

export default function Page() {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [img, setIMG] = useState('')
  const [editID, setEditID] = useState('')
  const [brandId, setBrandID] = useState('')
  const [removeID, setRemoveID] = useState('')
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(false)

  const [openDeleteModal, setOpenDeleteModal] = useState(false)
  const [nameDel, setNameDel] = useState('')
  const [isEdit, setIsEdit] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const [inputIMGValue, setInputIMGValue] = useState('')
  const [idValue, setIdValue] = useState('')
  const { t, i18n } = useTranslation('common')
  const [options, setOptions] = useState([]) // Options for the Select component
  const [errors, setErrors] = useState({
    name: '',
    imgUrl: ''
  })

  const [media, setMedia] = useState({
    FileUrl: '',
    TicketId: '',
    ProcessId: '',
    InventoryId: '',
    CompanyId: '',
    UserId: '',
    ControlId: '',
    ControlType: '',
    MediaFiles: []
  })

  const fetchData = async (id, name) => {
    try {
      const response = await api.get('/Companies')
      setRows(response.data.data)
    } catch (err) {
      // setErrorClosedTicket(false);
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    if (isEdit) {
      setInputValue(name)
      setInputIMGValue(img)
      setIdValue(brandId)
    }
  }, [isEdit, name, brandId, img])

  const columns = [
    { id: 'id', label: 'id' },
    { id: 'name', label: 'name' },
    {
      id: 'createdDate',
      label: 'createdDate',
      render: row => {
        const date = new Date(row.createdDate)
        return date.toLocaleDateString()
      }
    },
    {
      id: 'updatedDate',
      label: 'updatedDate',
      render: row => {
        const date = new Date(row.updatedDate)
        return date.toLocaleDateString()
      }
    },
    {
      id: 'actions',
      label: 'actions',
      disableSorting: true,
      minWidth: 100,
      render: row => (
        <>
          <IconButton size='small' color={'primary'} onClick={() => handleEdit(row.id, row.name, row.imgUrl)}>
            <i className='tabler-pencil' />
          </IconButton>
          <IconButton color={'error'} size='small' onClick={() => handleDelete(row.id, row.name, row.imgUrl)}>
            <i className='tabler-trash' />
          </IconButton>
        </>
      )
    }
  ]

  const handleEdit = (id, name, imgUrl) => {
    setIsEdit(true)
    setName(name)
    setEditID(id)
    setIMG(imgUrl)
    handleOpen()
  }

  const handleDelete = (id, name) => {
    handleOpenDeleteModal(true)
    setNameDel(name)
    setRemoveID(id)
  }

  const handleOpen = () => {
    setOpen(true)
  }

  const handleOpenDeleteModal = () => {
    setOpenDeleteModal(true)
  }

  const handleClose = () => {
    setOpen(false)
    setIsEdit(false)
    setInputValue('') // Reset the input when closing
    setIdValue('')
    setInputIMGValue('')
    setIMG('')
    setEditID('')
    setBrandID('')
    setRemoveID('')
    const clearValues = {
      name: ''
    }
    setErrors(param => ({
      ...param,
      ...clearValues
    }))
  }

  const handleSave = () => {
    event.preventDefault()
    let newErrors = {}

    // Validate required fields
    if (inputValue === '') {
      newErrors.name = 'Name is required'
    }

    if (inputIMGValue === '') {
      newErrors.imgUrl = 'Image Url is required'
    }

    setErrors(newErrors)
    let is_successful = false

    if (Object.keys(newErrors).length === 0) {
      setLoading(true)
      const params = isEdit
        ? { id: editID, name: inputValue, imgUrl: inputIMGValue }
        : { name: inputValue, imgUrl: inputIMGValue }

      const saveBrand = async () => {
        try {
          const response = isEdit ? await api.put('/Companies/Update', params) : await api.post('/Companies', params)

          if (response.status >= 200 && response.status < 300) {
            is_successful = true
            const companyId = response.data.data.id

            const responseMedia = isEdit
              ? await api.put('/MediaFiles/Update', params)
              : await api.post('/MediaFiles', params)

            console.log('media ', paramMedia)
          }
        } catch (err) {
          console.error('bruh')
          toast.error(t('An error occurred. Please try again.'))
        } finally {
          setTimeout(() => setLoading(false), 800)
        }
      }
      saveBrand().then(() => {
        if (is_successful) {
          setTimeout(() => handleClose(), 800)
          setTimeout(
            () => toast.success(isEdit ? t('Company updated successfully!') : t('Company created successfully!')),
            800
          )

          setTimeout(fetchData, 500) // Fetch updated data after closing
        }
      })
    }
  }

  const handleDelClose = () => {
    setOpenDeleteModal(false)
    setNameDel('') // Reset the input when closing
  }

  const handleDelSave = () => {
    setLoading(true)
    let is_successful = false
    const deleteBrand = async () => {
      try {
        const response = await api.get('/Companies/Remove/' + removeID)
        if (response.status >= 200 && response.status < 300) {
          is_successful = true
        }
      } catch (err) {
        console.error('Error:', err)
        toast.error(t('An error occurred. Please try again.'))
      } finally {
        setTimeout(() => setLoading(false), 800)
      }
    }

    deleteBrand().then(() => {
      if (is_successful) {
        setTimeout(() => handleDelClose(), 800)
        setTimeout(() => toast.success(t('Company deleted successfully!')), 800)

        setTimeout(fetchData, 500) // Fetch updated data after closing
      }
    })
  }

  const handleChange = e => {
    setIdValue(e.target.value)
  }

  const handleImgChange = item => {
    console.log(item)
    setInputIMGValue(item.name)
    setMedia(param => ({
      ...param,
      FileUrl: item.name,
      MediaFiles: item
    }))
  }

  return (
    <>
      <ToastContainer position='top-right' autoClose={3000} hideProgressBar={false} closeOnClick pauseOnHover />

      <Dialog open={open} onClose={handleClose}>
        {isEdit ? <DialogTitle>{t('editCompany')}</DialogTitle> : <DialogTitle>{t('createNewCompany')}</DialogTitle>}
        <form noValidate autoComplete='off' onSubmit={handleSave} className='flex flex-col gap-5'>
          <DialogContent>
            <Box display='flex' sx={{ alignItems: 'baseline' }} gap={2}>
              <TextField
                autoFocus
                margin='dense'
                label={t('name')}
                type='text'
                fullWidth
                value={inputValue}
                error={!!errors.name} // If there's an error, show it
                helperText={t(errors.name)}
                onChange={e => setInputValue(e.target.value)}
                sx={{ flex: 2 }}
                disabled
              />
              {/* Hidden Native File Input */}
              <input
                type='file'
                id='file-input'
                style={{ display: 'none' }}
                onChange={e => handleImgChange(e.target.files[0])}
              />

              <TextField
                margin='dense'
                label={t('imgUrl')}
                fullWidth
                sx={{ flex: 2 }}
                error={!!errors.imgUrl} // Error handling
                helperText={errors.imgUrl ? t(errors.imgUrl) : ''}
                value={inputIMGValue || ''} // Display the file name or empty string
                InputProps={{
                  readOnly: true, // Make it readonly so the user can't type
                  endAdornment: (
                    <InputAdornment position='end'>
                      <IconButton
                        onClick={e => {
                          e.stopPropagation()
                          document.getElementById('file-input').click()
                        }}
                        edge='end'
                      >
                        <CloudUploadIcon />
                      </IconButton>
                    </InputAdornment>
                  )
                }}
                onClick={() => document.getElementById('file-input').click()} // Trigger input on TextField click
                disabled
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color='secondary'>
              {t('cancel')}
            </Button>
            <Button onClick={handleSave} color='primary'>
              {loading ? <CircularProgress size={24} /> : isEdit ? t('edit') : t('create')}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
      <Dialog open={openDeleteModal} onClose={handleDelClose}>
        <DialogTitle>{t('deleteCompany')}</DialogTitle>
        <DialogContent>
          {i18n.language === 'en' ? (
            <Typography component='div'>
              {t('deleteCompanyMsg')}
              <Box fontWeight='fontWeightBold' display='inline'>
                {nameDel}
              </Box>
              ?
            </Typography>
          ) : (
            <Typography>
              {' '}
              <Box fontWeight='fontWeightBold' display='inline'>
                {nameDel}
              </Box>{' '}
              {t('deleteBrandMessage')}
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDelClose} color='secondary'>
            {t('cancel')}
          </Button>
          <Button onClick={handleDelSave} color='primary'>
            {loading ? <CircularProgress size={24} /> : t('delete')}
          </Button>
        </DialogActions>
      </Dialog>
      <Grid container spacing={6}>
        <Grid item xs={12} sm={6} md={6} lg={6}>
          <Typography variant='h4'>{t('companyOps')}</Typography>
        </Grid>
        <Grid item xs={12} sm={12} md={12} lg={12}>
          <Card>
            <div className={'flex justify-end p-3'}>
              <IconButton variant='contained' color='success' onClick={handleOpen}>
                <i className='tabler-plus' />
              </IconButton>
            </div>

            <CustomTable rows={rows} columns={columns} />
          </Card>
        </Grid>
      </Grid>
    </>
  )
}
