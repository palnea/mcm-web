import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import {
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Box,
  TextField,
  InputAdornment,
  IconButton,
  Button,
  Card,
  CardMedia,
  Typography,
  Autocomplete,
  Chip
} from '@mui/material'
import { CloudUpload as CloudUploadIcon } from '@mui/icons-material'
import api from '../../../../../api_helper/api'

const CreateEditSubcontractorModal = ({
                                        open,
                                        isEdit,
                                        onClose,
                                        onSave,
                                        initialData,
                                        errors,
                                        loading,
                                        translations,
                                        companies,
                                        defaultInputValue
                                      }) => {
  const [inputValue, setInputValue] = useState(defaultInputValue || '')
  const [selectedFile, setSelectedFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [selectedCompanies, setSelectedCompanies] = useState([])
  const [originalCompanies, setOriginalCompanies] = useState([])

  useEffect(() => {
    if (isEdit && initialData?.id) {
      fetchSubcontractorDetails(initialData.id)
      setInputValue(initialData.name)
      setImagePreview(initialData.imageUrl)
    } else {
      setSelectedCompanies([])
      setOriginalCompanies([])
    }
  }, [isEdit, initialData])

  const fetchSubcontractorDetails = async (id) => {
    try {
      const response = await api.get(`/SubContractors/GetWithDetails/${id}`)
      const subcontractorDetails = response.data.data
      const subContractorCompanies = subcontractorDetails.companies || []
      setSelectedCompanies(subContractorCompanies)
      setOriginalCompanies(subContractorCompanies)

      if (subcontractorDetails.imageUrl) {
        setImagePreview(process.env.NEXT_PUBLIC_CONTENT_BASE_URL + '/' + subcontractorDetails.imageUrl)
      }
    } catch (err) {
      console.error('Error fetching subcontractor details:', err)
    }
  }

  const handleCompanyChange = async (event, newValue) => {
    if (isEdit) {
      // Handle edit mode - need to make API calls for each change
      const added = newValue.filter(company =>
        !originalCompanies.find(orig => orig.id === company.id)
      )

      const removed = originalCompanies.filter(company =>
        !newValue.find(newComp => newComp.id === company.id)
      )

      let hasError = false
      // Handle additions
      for (const company of added) {
        try {
          await api.post('/CompanyToSubContractors', {
            companyId: company.id,
            subContractorId: initialData.id
          })
        } catch (err) {
          console.error('Error adding company:', err)
          hasError = true
          return
        }
      }

      // Handle removals
      for (const company of removed) {
        try {
          await api.post('/CompanyToSubContractors/Remove', {
            companyId: company.id,
            subContractorId: initialData.id
          })
        } catch (err) {
          console.error('Error removing company:', err)
          hasError = true
          return
        }
      }

      if (hasError) {
        await fetchSubcontractorDetails(initialData.id)
      }
      else {
        setOriginalCompanies(newValue)
      }
    }

    setSelectedCompanies(newValue)
  }

  const handleImgChange = file => {
    if (file) {
      setSelectedFile(file)
      const previewUrl = URL.createObjectURL(file)
      setImagePreview(previewUrl)
    }
  }

  const handleSubmit = event => {
    event.preventDefault()
    const formData = new FormData()
    formData.append('name', inputValue)

    if (!isEdit) {
      // Only in create mode, we send the company IDs array
      const companyIds = selectedCompanies.map(company => company.id)
      formData.append('companyIds', JSON.stringify(companyIds))
    }

    if (selectedFile) {
      formData.append('file', selectedFile)
    } else if (isEdit && initialData?.imageUrl) {
      formData.append('imageUrl', initialData.imageUrl)
    }
    onSave(formData)
  }

  const handleCloseAndReset = () => {
    setInputValue('')
    setSelectedFile(null)
    setImagePreview(null)
    setSelectedCompanies([])
    setOriginalCompanies([])
    onClose()
  }

  return (
    <Dialog open={open} onClose={handleCloseAndReset} maxWidth='md'>
      <DialogTitle>{isEdit ? translations.editTitle : translations.createTitle}</DialogTitle>
      <form noValidate autoComplete='off' onSubmit={handleSubmit}>
        <DialogContent>
          <Box display='flex' flexDirection='column' gap={3}>
            <Box display='flex' gap={2}>
              <TextField
                autoFocus
                margin='dense'
                label={translations.nameLabel}
                type='text'
                fullWidth
                value={inputValue}
                error={!!errors?.name}
                helperText={errors?.name ? errors.name : ''}
                onChange={e => setInputValue(e.target.value)}
                sx={{ flex: 2 }}
              />

              <Autocomplete
                multiple
                id="companies-select"
                options={companies}
                getOptionLabel={(option) => option.name}
                value={selectedCompanies}
                onChange={handleCompanyChange}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label={translations.companiesLabel}
                    error={!!errors?.companies}
                    helperText={errors?.companies ? errors.companies : ''}
                    margin="dense"
                  />
                )}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip
                      label={option.name}
                      {...getTagProps({ index })}
                      key={option.id}
                    />
                  ))
                }
                sx={{ flex: 2 }}
              />
            </Box>

            <Box display='flex' gap={2}>
              <input
                type='file'
                id='file-input'
                accept='image/*'
                style={{ display: 'none' }}
                onChange={e => handleImgChange(e.target.files[0])}
              />
              <TextField
                margin='dense'
                label={translations.imageLabel}
                fullWidth
                error={!!errors?.imageUrl}
                helperText={errors?.imageUrl ? errors.imageUrl : ''}
                value={selectedFile ? selectedFile.name : initialData?.imageUrl || ''}
                InputProps={{
                  readOnly: true,
                  endAdornment: (
                    <InputAdornment position='end'>
                      <IconButton onClick={() => document.getElementById('file-input').click()} edge='end'>
                        <CloudUploadIcon />
                      </IconButton>
                    </InputAdornment>
                  )
                }}
                onClick={() => document.getElementById('file-input').click()}
              />
            </Box>

            {imagePreview && (
              <Card sx={{ maxWidth: '100%', boxShadow: 'none', bgcolor: 'background.default' }}>
                <Box sx={{ position: 'relative', width: '100%', height: 200 }}>
                  <CardMedia
                    component='img'
                    image={imagePreview}
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
                  {translations.previewLabel}
                </Typography>
              </Card>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAndReset} color='secondary'>
            {translations.cancelText}
          </Button>
          <Button
            type='submit'
            color='primary'
            variant='contained'
            disabled={!inputValue || loading}
          >
            {loading ? <CircularProgress size={24} /> : isEdit ? translations.editText : translations.createText}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

CreateEditSubcontractorModal.propTypes = {
  open: PropTypes.bool.isRequired,
  isEdit: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  defaultInputValue: PropTypes.string,
  initialData: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
    imageUrl: PropTypes.string,
    companies: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string
    }))
  }),
  errors: PropTypes.shape({
    name: PropTypes.string,
    imageUrl: PropTypes.string,
    companies: PropTypes.string
  }),
  loading: PropTypes.bool,
  companies: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string
  })).isRequired,
  translations: PropTypes.shape({
    editTitle: PropTypes.string.isRequired,
    createTitle: PropTypes.string.isRequired,
    nameLabel: PropTypes.string.isRequired,
    imageLabel: PropTypes.string.isRequired,
    companiesLabel: PropTypes.string.isRequired,
    previewLabel: PropTypes.string.isRequired,
    cancelText: PropTypes.string.isRequired,
    editText: PropTypes.string.isRequired,
    createText: PropTypes.string.isRequired
  }).isRequired
}

CreateEditSubcontractorModal.defaultProps = {
  isEdit: false,
  initialData: null,
  errors: {},
  loading: false
}

export default CreateEditSubcontractorModal
