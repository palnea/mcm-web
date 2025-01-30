'use client' // Add this line at the top
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import CustomTable from '../../../../components/Table/CustomTable'
import Card from '@mui/material/Card'
import React, { useEffect, useState } from 'react'
import api from '../../../../api_helper/api'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import {
  CardMedia,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormHelperText,
  InputAdornment,
  InputLabel,
  Select,
  Stack,
  Tab,
  Tabs
} from '@mui/material'
import TextField from '@mui/material/TextField'
import { useTranslation } from 'react-i18next'
import Box from '@mui/material/Box'
import MenuItem from '@mui/material/MenuItem'
import Divider from '@mui/material/Divider'
import 'react-datepicker/dist/react-datepicker.css'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import DeleteItemModal from '@components/pages/(dashboard)/yacht/brand/DeleteItemModal'
import { CloudUpload as CloudUploadIcon } from '@mui/icons-material'
import YachtQRDialog from '@components/pages/(dashboard)/yacht/yacht/YachtQRDialog'

export const shipTypes = [
  { label: 'Sailboat', value: 'Sailboat' },
  { label: 'Motorboat', value: 'Motorboat' },
  { label: 'Sailing Catamaran', value: 'SailingCatamaran' },
  { label: 'Motor Catamaran', value: 'MotorCatamaran' },
  { label: 'Inflatable Boat', value: 'InflatableBoat' },
  { label: 'Other', value: 'Other' }
]

export default function Page() {
  const [open, setOpen] = useState(false)
  const [editID, setEditID] = useState('')
  const [removeID, setRemoveID] = useState('')
  const [rows, setRows] = useState([])
  const [inputValue, setInputValue] = useState('')
  const [loading, setLoading] = useState(false)
  const [YachtLoad, setYachtLoad] = useState([])
  const [YachtLoadEdit, setYachtLoadEdit] = useState([])
  const [selectedFile, setSelectedFile] = useState(null)

  const [errors, setErrors] = useState({
    name: '',
    userId: '',
    yachtBrandId: '',
    yachtModelId: ''
  })

  const [noteErrors, setNoteErrors] = useState({
    name: ''
  })

  const [params, setParams] = useState({
    name: '',
    imageUrl: '',
    officialNumber: '',
    userId: null,
    groupId: null,
    yachtBrandId: null,
    yachtModelId: null,
    shipType: '',
    expiryDate: '',
    imoNumber: '',
    radioCallSign: '',
    registeredLength: '',
    overallLength: '',
    depth: '',
    breadth: '',
    grossTonnage: '',
    netTonnage: '',
    yearOfBuild: '',
    hin: '',
    port: '',
    engineMakeAndModel: '',
    enginePower: ''
  })

  const clearParams = () => {
    let clearValues = {
      name: '',
      officialNumber: '',
      userId: null,
      groupId: null,
      yachtBrandId: null,
      yachtModelId: null,
      expiryDate: '',
      imoNumber: '',
      radioCallSign: '',
      registeredLength: '',
      overallLength: '',
      depth: '',
      breadth: '',
      grossTonnage: '',
      netTonnage: '',
      yearOfBuild: '',
      hin: '',
      port: '',
      engineMakeAndModel: '',
      enginePower: '',
      imageUrl: '',
      shipType: ''
    }
    setParams(param => ({
      ...param,
      ...clearValues
    }))

    let clearValues2 = {
      name: '',
      // userId: '',
      yachtBrandId: '',
      yachtModelId: ''
    }
    setErrors(param => ({
      ...param,
      ...clearValues2
    }))
  }

  const [openDeleteModal, setOpenDeleteModal] = useState(false)
  const [openNotesModal, setOpenNotesModal] = useState(false)
  const [id, setId] = useState('')
  const [selectedYacht, setSelectedYacht] = useState('')
  const [openQR, setOpenQR] = useState(false)

  const [nameDel, setNameDel] = useState('')
  const [isEdit, setIsEdit] = useState(false)
  const { t, i18n } = useTranslation('common')
  const [optionsBrands, setOptionsBrands] = useState([]) // Options for the Select component
  const [optionsModels, setOptionsModels] = useState([]) // Options for the Select component
  const [optionsUsers, setOptionsUsers] = useState([]) // Options for the Select component
  const [optionsGroups, setOptionsGroups] = useState([]) // Options for the Select component
  const [activeTab, setActiveTab] = useState(0) // 0 for yacht fields tab, 1 for notes tab
  const [notes, setNotes] = useState([])

  const fetchData = async (id, name) => {
    try {
      const response = await api.get('/Yachts/GetAllWithDetails')
      setRows(response.data.data)
    } catch (err) {
      // setErrorClosedTicket(false);
    }
  }

  const fetchSelectBrand = async (id, name) => {
    try {
      const response = await api.get('/YachtBrands')
      const optionsData = response.data.data.map(item => ({
        label: item.name,
        value: item.id
      }))
      setOptionsBrands(optionsData)
    } catch (err) {
      // setErrorClosedTicket(false);
    }
  }

  const fetchSelectModel = async value => {
    try {
      const response = await api.get('/YachtModels/GetByYachtBrandId/' + value)
      const optionsData = response.data.data.map(item => ({
        label: item.name,
        value: item.id
      }))
      setOptionsModels(optionsData)
    } catch (err) {
      // setErrorClosedTicket(false);
    }
  }

  const fetchSelectUser = async (id, name) => {
    try {
      const response = await api.get('/Users')
      const optionsData = response.data.data.map(item => ({
        label: item.username,
        value: item.id
      }))
      setOptionsUsers(optionsData)
    } catch (err) {
      // setErrorClosedTicket(false);
    }
  }

  const fetchSelectGroups = async (id, name) => {
    try {
      const response = await api.get('/Groups')
      const optionsData = response.data.data.map(item => ({
        label: item.name,
        value: item.id
      }))
      setOptionsGroups(optionsData)
    } catch (err) {
      // setErrorClosedTicket(false);
    }
  }

  const getYachtNoteByID = async id => {
    try {
      const response = await api.get('/YachtNotes/GetByYachtId/' + id)
      setNotes(response.data.data)
    } catch (err) {
      // setErrorClosedTicket(false);
    }
  }

  useEffect(() => {
    fetchData()
    fetchSelectBrand()
    // fetchSelectModel();
    fetchSelectUser()
    fetchSelectGroups()
  }, [])

  const columns = [
    { id: 'id', label: 'id' },
    {
      id: 'imageUrl',
      label: 'Image',
      render: row =>
        row.imageUrl ? (
          <img
            src={process.env.NEXT_PUBLIC_CONTENT_BASE_URL + '/' + row.imageUrl}
            alt={row.name}
            style={{ height: '50px', width: 'auto' }}
          />
        ) : null
    },
    { id: 'name', label: 'name' },
    {
      id: 'yachtBrand',
      label: 'yachtBrand',
      render: row => {
        return row.yachtBrand.name
      }
    },
    {
      id: 'yachtModel',
      label: 'yachtModel',
      render: row => {
        return row.yachtModel.name
      }
    },
    { id: 'port', label: 'port' },
    { id: 'depth', label: 'depth' },
    { id: 'breadth', label: 'breadth' },
    { id: 'grossTonnage', label: 'grossTonnage' },
    { id: 'netTonnage', label: 'netTonnage' },
    { id: 'yearOfBuild', label: 'yearOfBuild' },
    {
      id: 'expiryDate',
      label: 'expiryDate',
      render: row => {
        const date = new Date(row.expiryDate)
        return date.toLocaleDateString()
      }
    },
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
          <IconButton size='small' color={'primary'} onClick={() => handleEdit(row)}>
            <i className='tabler-pencil' />
          </IconButton>
          <IconButton color={'error'} size='small' onClick={() => handleDelete(row.id, row.name, row.yachtBrandId)}>
            <i className='tabler-trash' />
          </IconButton>
          <IconButton size='small' color={'secondary'} onClick={() => handleNote(row.id)}>
            <i className='tabler-notes' />
          </IconButton>
          <IconButton size='small' style={{color: '#585a63'}} onClick={() => handleQROpen(row.id)}>
            <i className='tabler-qrcode' />
          </IconButton>
        </>
      )
    }
  ]

  const handleEdit = row => {
    setIsEdit(true)
    setEditID(row.id)
    if (row.imageUrl) {
      setParams({ ...row, imageUrl: process.env.NEXT_PUBLIC_CONTENT_BASE_URL + '/' + row.imageUrl })
    } else {
      setParams(row)
    }
    getYachtNoteByID(row.id)
    removeKeysWithFilter([
      'user',
      'group',
      'yachtModel',
      'yachtBrand',
      'shipType',
      'methodOfPropulsion',
      'salesStatus',
      'yachtNotes',
      'createdDate',
      'updatedDate'
    ]) // Pass an array of keys to remove
    handleOpen(row.id)
  }

  const yearOptions = Array.from(new Array(50), (_, index) => {
    const year = new Date().getFullYear() - index // Adjust the range as needed
    return year.toString()
  })

  const handleDelete = (id, name) => {
    handleOpenDeleteModal(true)
    setNameDel(name)
    setRemoveID(id)
  }

  const handleNote = id => {
    handleOpenNoteModal(true)
    setId(id)
  }

  const handleQROpen = id => {
    setOpenQR(true)
    setSelectedYacht(rows.filter(row => row.id === id)[0])
    setId(id)
  }

  const handleQRClose = () => {
    setOpenQR(false)
    setId('')
  }

  const handleOpen = id => {
    setOpen(true)
    setId(id)
  }

  const handleOpenDeleteModal = () => {
    setOpenDeleteModal(true)
  }

  const handleOpenNoteModal = () => {
    setOpenNotesModal(true)
  }
  const handleClose = () => {
    setOpen(false)
    setIsEdit(false)
    setInputValue('') // Reset the input when closing
    setActiveTab(0)
    setSelectedFile(null)
    removeKeysWithFilter(['id'])
    clearParams()
  }

  const removeKeysWithFilter = keysToRemove => {
    setParams(prevParams =>
      Object.fromEntries(Object.entries(prevParams).filter(([key]) => !keysToRemove.includes(key)))
    )
  }

  const uploadFile = async (id, file) => {
    if (!file) return

    const formData = new FormData()
    formData.append('Id', id)
    formData.append('ImageFile', file)
    formData.append('EntityType', 'Yacht')

    try {
      return await api.put('/FileUploads/SingleFileUpload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
    } catch (error) {
      console.error('Error uploading file:', error)
      throw error
    }
  }

  const handleSave = async () => {
    event.preventDefault()
    let newErrors = {}
    // Validate required fields
    if (params.name === '') {
      newErrors.name = 'Name is required'
    }

    if (params.yachtBrandId === '' || params.yachtBrandId === null) {
      newErrors.yachtBrandId = 'Brand is required'
    }

    if (params.yachtModelId === '' || params.yachtModelId === null) {
      newErrors.yachtModelId = 'Model is required'
    }

    setErrors(newErrors)
    if (Object.keys(newErrors).length === 0) {
      setLoading(true)
      try {
        const response = isEdit ? await api.put('/Yachts/Update', params) : await api.post('/Yachts', params)

        if (response.status >= 200 && response.status < 300) {
          if (selectedFile) {
            const id = isEdit ? editID : response.data.data.id
            try {
              await uploadFile(id, selectedFile)
            } catch (e) {
              toast.error(t('File could not be uploaded.'))
            }
          }

          setTimeout(() => handleClose(), 800)
          setTimeout(
            () => toast.success(isEdit ? t('Yacht updated successfully!') : t('Yacht created successfully!')),
            800
          )
          setTimeout(fetchData, 500) // Fetch updated data after closing
        }
      } catch (err) {
        console.error('Error:', err)
        toast.error(t('An error occurred. Please try again.'))
      } finally {
        setTimeout(() => setLoading(false), 800)
      }
    }
  }

  const handleNotesSave = () => {
    event.preventDefault()
    let newErrors = {}
    let is_successful = false

    // Validate required fields
    if (inputValue === '') {
      newErrors.name = 'Name is required'
    }

    setNoteErrors(newErrors)

    if (Object.keys(newErrors).length === 0) {
      setLoading(true)

      const createNote = async () => {
        const notes = {
          name: inputValue,
          yachtId: id
        }
        try {
          const response = await api.post('/YachtNotes', notes)
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
      createNote().then(() => {
        if (is_successful) {
          setTimeout(() => handleNotesClose(), 800)
          setTimeout(() => toast.success(t('Yacht note created successfully!')), 800)

          setTimeout(fetchData, 500) // Fetch updated data after closing
        }
      })
    }
  }

  const handleDelClose = () => {
    setOpenDeleteModal(false)
    setNameDel('') // Reset the input when closing
  }

  const handleNotesClose = () => {
    setOpenNotesModal(false)
    setInputValue('') // Reset the input when closing
    const clearValues = {
      name: ''
    }
    setNoteErrors(param => ({
      ...param,
      ...clearValues
    }))
    // setNameDel(''); // Reset the input when closing
  }

  const handleDelSave = () => {
    setLoading(true)
    let is_successful = false
    const deleteYacht = async () => {
      try {
        const response = await api.get('/Yachts/Remove/' + removeID)
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
    deleteYacht().then(() => {
      if (is_successful) {
        setTimeout(() => handleDelClose(), 800)
        setTimeout(() => toast.success(t('Yacht deleted successfully!')), 800)

        setTimeout(fetchData, 500) // Fetch updated data after closing
      }
    })
  }

  const handleInputChange = (key, value) => {
    if (key === 'yachtBrandId') {
      fetchSelectModel(value)
    }
    if (key === 'expiryDate') {
      // Store the date value as full timestamp format
      const fullTimestamp = new Date(value).toISOString()?.slice(0, -1) // Adjusted to get a full ISO timestamp
      setParams(prevParams => ({ ...prevParams, [key]: fullTimestamp }))
    } else {
      setParams(prevParams => ({
        ...prevParams,
        [key]: typeof prevParams[key] === 'string' ? value : Number(value)
      }))
    }
  }

  const handleTabChange = (event, newTab) => {
    setActiveTab(newTab)
  }

  const handleNoteChange = (index, newName) => {
    const updatedNotes = [...notes]
    updatedNotes[index].name = newName // Update the specific note's name
    setNotes(updatedNotes)
  }

  const handleDeleteNote = note_id => {
    setYachtLoad({ ...YachtLoad, [note_id]: true })
    let is_successful = false

    const deleteNote = async () => {
      try {
        const response = await api.get('/YachtNotes/Remove/' + note_id)
        if (response.status >= 200 && response.status < 300) {
          is_successful = true
        }
      } catch (err) {
        console.error('Error:', err)
        // toast.error(t("An error occurred. Please try again."));
      } finally {
        setTimeout(() => setYachtLoad({ ...YachtLoad, [note_id]: false }), 800)
      }
    }
    deleteNote().then(() => {
      if (is_successful) {
        // setTimeout(() => toast.success(t('Accessory category deleted successfully!')), 800);

        setTimeout(() => {
          getYachtNoteByID(id)
        }, 500) // Fetch updated data after closing
      }
    })
  }

  const handleUpdateNote = note_id => {
    setYachtLoadEdit({ ...YachtLoadEdit, [note_id]: true })
    let is_successful = false
    for (let i = 0; i < notes.length; i++) {
      if (notes[i].id === note_id) {
        const param = {
          id: notes[i].id,
          name: notes[i].name,
          yachtId: notes[i].yachtId
        }
        const updateNote = async () => {
          try {
            const response = await api.put('/YachtNotes/Update', param)
            if (response.status >= 200 && response.status < 300) {
              is_successful = true
            }
          } catch (err) {
            console.error('Error:', err)
            // toast.error(t("An error occurred. Please try again."));
          } finally {
            setTimeout(() => setYachtLoadEdit({ ...YachtLoadEdit, [note_id]: false }), 800)
          }
        }
        updateNote().then(() => {
          if (is_successful) {
            console.log(id)
            setTimeout(() => {
              getYachtNoteByID(id)
            }, 500) // Fetch updated data after closing
          }
        })
      }
    }
  }

  const handleImgChange = file => {
    if (file) {
      setSelectedFile(file)
      const previewUrl = URL.createObjectURL(file)
      setParams(prevParams => ({ ...prevParams, imageUrl: previewUrl }))
    }
  }

  return (
    <>
      <ToastContainer position='top-right' autoClose={3000} hideProgressBar={false} closeOnClick pauseOnHover />

      <Dialog open={open} onClose={handleClose}>
        {isEdit ? <DialogTitle>{t('editYacht')}</DialogTitle> : <DialogTitle>{t('createNewYacht')}</DialogTitle>}
        <form noValidate autoComplete='off' onSubmit={handleSave} className='flex flex-col gap-5'>
          <DialogContent className={'pt-3'} sx={{ minWidth: '500px', maxWidth: '800px' }}>
            {isEdit && (
              <Box className={'mb-3'}>
                <Grid container spacing={4}>
                  <Tabs value={activeTab} onChange={handleTabChange} aria-label='Edit Yacht Tabs'>
                    <Tab label={t('yachtFields')} />
                    <Tab label={t('yachtNotes')} />
                  </Tabs>
                </Grid>
              </Box>
            )}

            {activeTab === 0 && (
              <Stack direction={'column'}>
                {params.imageUrl && (
                  <Card sx={{ maxWidth: '100%', boxShadow: 'none', bgcolor: 'background.default' }}>
                    <Box sx={{ position: 'relative', width: '100%', height: 200 }}>
                      <CardMedia
                        component='img'
                        image={params.imageUrl}
                        alt='Selected image preview'
                        sx={{
                          height: '100%',
                          objectFit: 'contain',
                          borderRadius: 1,
                          bgcolor: 'background.paper'
                        }}
                      />
                    </Box>
                    <Typography variant='caption' color='text.secondary' sx={{ mt: 1 }}>
                      {t('imagePreview')}
                    </Typography>
                  </Card>
                )}
                <Grid container spacing={4} marginTop={5}>
                  {Object.keys(params).map(key =>
                    key === 'yachtBrandId' ? (
                      <Grid item xs={12} sm={6} key={key}>
                        <FormControl fullWidth variant='outlined' error={!!errors[key]}>
                          <InputLabel>{t('selectBrand')}</InputLabel>
                          <Select
                            margin='dense'
                            key={key}
                            fullWidth
                            label={t('selectBrand')}
                            variant='outlined'
                            value={params[key] || ''}
                            onChange={e => handleInputChange(key, e.target.value)}
                            displayEmpty
                          >
                            {/*<MenuItem value="" disabled>{t("selectBrand")}</MenuItem>*/}
                            {optionsBrands.map(option => (
                              <MenuItem key={option.value} value={option.value}>
                                {option.label}
                              </MenuItem>
                            ))}
                          </Select>
                          <FormHelperText>{t(errors[key])}</FormHelperText>
                        </FormControl>
                      </Grid>
                    ) : key === 'yachtModelId' ? (
                      <Grid item xs={12} sm={6} key={key}>
                        <FormControl fullWidth variant='outlined' error={!!errors[key]}>
                          <InputLabel>{t('selectModel')}</InputLabel>
                          <Select
                            key={key}
                            fullWidth
                            variant='outlined'
                            value={params[key] || ''}
                            label={t('selectModel')}
                            onChange={e => handleInputChange(key, e.target.value)}
                            displayEmpty
                            disabled={params.yachtBrandId === null}
                          >
                            {/*<MenuItem value="" disabled>{t("selectModel")}</MenuItem>*/}
                            {optionsModels.map(option => (
                              <MenuItem key={option.value} value={option.value}>
                                {option.label}
                              </MenuItem>
                            ))}
                          </Select>
                          <FormHelperText>{t(errors[key])}</FormHelperText>
                        </FormControl>
                      </Grid>
                    ) : key === 'shipType' ? (
                      <Grid item xs={12} sm={6} key={key}>
                        <FormControl fullWidth variant='outlined' error={!!errors[key]}>
                          <InputLabel>{t('selectShipType')}</InputLabel>
                          <Select
                            key={key}
                            fullWidth
                            label={t('selectShipType')}
                            variant='outlined'
                            value={params[key] || ''}
                            onChange={e => handleInputChange(key, e.target.value)}
                            displayEmpty
                          >
                            {/*<MenuItem value="" disabled>{t("selectUsers")}</MenuItem>*/}
                            {shipTypes.map(option => (
                              <MenuItem key={option.label} value={option.value}>
                                {option.label}
                              </MenuItem>
                            ))}
                          </Select>
                          <FormHelperText>{t(errors[key])}</FormHelperText>
                        </FormControl>
                      </Grid>
                    ) : key === 'userId' ? (
                      <Grid item xs={12} sm={6} key={key}>
                        <FormControl fullWidth variant='outlined' error={!!errors[key]}>
                          <InputLabel>{t('selectUsers')}</InputLabel>
                          <Select
                            key={key}
                            fullWidth
                            label={t('selectUsers')}
                            variant='outlined'
                            value={params[key] || ''}
                            onChange={e => handleInputChange(key, e.target.value)}
                            displayEmpty
                          >
                            {/*<MenuItem value="" disabled>{t("selectUsers")}</MenuItem>*/}
                            {optionsUsers.map(option => (
                              <MenuItem key={option.value} value={option.value}>
                                {option.label}
                              </MenuItem>
                            ))}
                          </Select>
                          <FormHelperText>{t(errors[key])}</FormHelperText>
                        </FormControl>
                      </Grid>
                    ) : key === 'groupId' ? (
                      <Grid item xs={12} sm={6} key={key}>
                        <FormControl fullWidth variant='outlined' error={!!errors[key]}>
                          <InputLabel>{t('selectGroup')}</InputLabel>
                          <Select
                            key={key}
                            fullWidth
                            label={t('selectGroup')}
                            variant='outlined'
                            value={params[key] || ''}
                            onChange={e => handleInputChange(key, e.target.value)}
                            displayEmpty
                          >
                            {optionsGroups.map(option => (
                              <MenuItem key={option.value} value={option.value}>
                                {option.label}
                              </MenuItem>
                            ))}
                          </Select>
                          <FormHelperText>{t(errors[key])}</FormHelperText>
                        </FormControl>
                      </Grid>
                    ) : (
                      <Grid item xs={12} sm={6} key={key}>
                        {key === 'expiryDate' ? (
                          <TextField
                            key={key}
                            fullWidth
                            type='date' // Setting type to "date"
                            InputLabelProps={{ shrink: true }}
                            value={params[key]?.slice(0, 10)} // Format date for display
                            variant='outlined'
                            label={t(key)}
                            onChange={e => handleInputChange(key, e.target.value)}
                          />
                        ) : key === 'yearOfBuild' ? (
                          <FormControl fullWidth variant='outlined'>
                            <InputLabel>{t(key)}</InputLabel>
                            <Select
                              key={key}
                              fullWidth
                              label={t(key)}
                              variant='outlined'
                              value={params[key] || ''}
                              onChange={e => handleInputChange(key, e.target.value)}
                              displayEmpty
                            >
                              {/*<MenuItem value="" disabled>{t("selectUsers")}</MenuItem>*/}
                              {yearOptions.map(year => (
                                <MenuItem key={year} value={year}>
                                  {year}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        ) : key === 'imageUrl' ? (
                          <Box marginTop={-2}>
                            <input
                              type='file'
                              id='file-input'
                              accept='image/*'
                              style={{ display: 'none' }}
                              onChange={e => handleImgChange(e.target.files[0])}
                            />
                            <TextField
                              margin='dense'
                              label={t('image')}
                              fullWidth
                              sx={{ flex: 2 }}
                              error={!!errors?.imageUrl}
                              helperText={errors?.imageUrl ? errors.imageUrl : ''}
                              value={selectedFile ? selectedFile.name : params.imageUrl || ''}
                              InputProps={{
                                readOnly: true,
                                endAdornment: (
                                  <InputAdornment position='end'>
                                    <IconButton
                                      onClick={() => document.getElementById('file-input').click()}
                                      edge='end'
                                    >
                                      <CloudUploadIcon />
                                    </IconButton>
                                  </InputAdornment>
                                )
                              }}
                              onClick={() => document.getElementById('file-input').click()}
                            />
                          </Box>
                        ) : (
                          key !== 'id' && (
                            <TextField
                              key={key}
                              fullWidth
                              variant='outlined'
                              label={t(key)}
                              type={typeof params[key] === 'string' ? 'text' : 'number'}
                              value={params[key]}
                              error={key === 'name' ? !!errors[key] : false} // If there's an error, show it
                              helperText={t(errors[key])} // Display the error message
                              onChange={e => handleInputChange(key, e.target.value)}
                            />
                          )
                        )}
                      </Grid>
                    )
                  )}
                </Grid>
              </Stack>
            )}
            {activeTab === 1 && notes && notes.length === 0 && <Typography>{t('noNotes')}</Typography>}
            {activeTab === 1 &&
              notes &&
              notes.map((note, index) => (
                <div>
                  <Divider flexItem={true} />
                  <Box className={'mb-3 flex'} sx={{ alignItems: 'flex-end', justifyContent: 'space-between' }}>
                    <Grid item xs={10} sm={6} key={index} className={'me-8'}>
                      <TextField
                        variant='outlined'
                        // label={`Note ${index + 1} Name`}
                        multiline // Makes the field a textarea
                        rows={4} // Adjusts the number of visible rows (height)
                        label={t('name')}
                        value={note.name}
                        className={'ms-2 mt-4'}
                        onChange={e => handleNoteChange(index, e.target.value)}
                      />
                    </Grid>
                    <Grid item xs={4} sm={6} key={index + 'buttonsUpdate'} className={'ms-8'}>
                      <Button onClick={e => handleUpdateNote(note.id)} color='success' key={index + 'updateButton'}>
                        {YachtLoadEdit[note.id] ? <CircularProgress size={24} /> : t('update')}
                      </Button>
                      <Button onClick={e => handleDeleteNote(note.id)} color='error' key={index + 'deleteButton'}>
                        {YachtLoad[note.id] ? <CircularProgress size={24} /> : t('delete')}
                      </Button>
                    </Grid>
                  </Box>
                  <Divider flexItem={true} />
                </div>
              ))}
          </DialogContent>

          {activeTab === 0 && (
            <DialogActions>
              <Button onClick={handleClose} color='secondary'>
                {t('cancel')}
              </Button>
              <Button onClick={handleSave} color='primary'>
                {loading ? <CircularProgress size={24} /> : isEdit ? t('edit') : t('create')}
              </Button>
            </DialogActions>
          )}
        </form>
      </Dialog>
      <DeleteItemModal
        open={openDeleteModal}
        onClose={handleDelClose}
        onConfirm={handleDelSave}
        language={i18n.language}
        deleteTitle={t('deleteYacht')}
        deleteMessage={t('deleteYachtMessage')}
        cancelText={t('cancel')}
        deleteText={t('delete')}
      />
      <Dialog open={openNotesModal} onClose={handleNotesClose} fullWidth>
        <DialogTitle>{t('createNote')}</DialogTitle>
        <form noValidate autoComplete='off' onSubmit={handleNotesSave} className='flex flex-col gap-5'>
          <DialogContent>
            <TextField
              autoFocus
              margin='dense'
              label={t('name')}
              multiline // Makes the field a textarea
              rows={4} // Adjusts the number of visible rows (height)
              type='text'
              fullWidth
              error={!!noteErrors.name} // If there's an error, show it
              helperText={t(noteErrors.name)} // Display the error message
              variant='outlined'
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleNotesClose} color='secondary'>
              {t('cancel')}
            </Button>
            <Button onClick={handleNotesSave} color='primary'>
              {loading ? <CircularProgress size={24} /> : t('create')}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
      <YachtQRDialog
        open={openQR}
        yachtId={id}
        yachtName={selectedYacht?.name}
        yachtHIN={selectedYacht?.hin}
        t={t}
        onClose={handleQRClose}
      />
      <Grid container spacing={6}>
        <Grid item xs={12} sm={6} md={6} lg={6}>
          <Typography variant='h4'>{t('yachtOps')}</Typography>
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
