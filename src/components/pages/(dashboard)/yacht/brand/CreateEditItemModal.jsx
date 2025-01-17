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
  Typography
} from '@mui/material'
import { CloudUpload as CloudUploadIcon } from '@mui/icons-material'

const CreateEditItemModal = ({
  open,
  isEdit,
  onClose,
  onSave,
  initialData,
  errors,
  loading,
  translations,
  defaultInputValue
}) => {
  const [inputValue, setInputValue] = useState(defaultInputValue || '')
  const [selectedFile, setSelectedFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)

  useEffect(() => {
    if (isEdit && initialData) {
      setInputValue(initialData.name || '')
      setImagePreview(initialData.imageUrl || null)
    }
  }, [isEdit, initialData])

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
                sx={{ flex: 2 }}
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
          <Button type='submit' color='primary' variant='contained'>
            {loading ? <CircularProgress size={24} /> : isEdit ? translations.editText : translations.createText}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

CreateEditItemModal.propTypes = {
  open: PropTypes.bool.isRequired,
  isEdit: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  defaultInputValue: PropTypes.string,
  initialData: PropTypes.shape({
    name: PropTypes.string,
    imageUrl: PropTypes.string
  }),
  errors: PropTypes.shape({
    name: PropTypes.string,
    imageUrl: PropTypes.string
  }),
  loading: PropTypes.bool,
  translations: PropTypes.shape({
    editTitle: PropTypes.string.isRequired,
    createTitle: PropTypes.string.isRequired,
    nameLabel: PropTypes.string.isRequired,
    imageLabel: PropTypes.string.isRequired,
    previewLabel: PropTypes.string.isRequired,
    cancelText: PropTypes.string.isRequired,
    editText: PropTypes.string.isRequired,
    createText: PropTypes.string.isRequired
  }).isRequired
}

CreateEditItemModal.defaultProps = {
  isEdit: false,
  initialData: null,
  errors: {},
  loading: false
}

export default CreateEditItemModal
