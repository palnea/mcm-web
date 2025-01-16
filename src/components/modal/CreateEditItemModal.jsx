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
                               t,
                               defaultInputValue
                             }) => {
  const [inputValue, setInputValue] = useState(defaultInputValue || '')
  const [selectedFile, setSelectedFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  console.log("image url", initialData.imageUrl)

  useEffect(() => {
    if (isEdit && initialData) {
      setInputValue(initialData.name || '')
      setImagePreview(initialData.imageUrl || null)
    }
  }, [isEdit, initialData])

  const handleImgChange = (file) => {
    if (file) {
      setSelectedFile(file)
      const previewUrl = URL.createObjectURL(file)
      setImagePreview(previewUrl)
    }
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    // Create FormData only if there's a new file selected
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
    <Dialog
      open={open}
      onClose={handleCloseAndReset}
      maxWidth="md"
    >
      <DialogTitle>{isEdit ? t('editCompany') : t('createNewCompany')}</DialogTitle>
      <form noValidate autoComplete='off' onSubmit={handleSubmit}>
        <DialogContent>
          <Box display='flex' flexDirection="column" gap={3}>
            <Box display='flex' gap={2}>
              <TextField
                autoFocus
                margin='dense'
                label={t('name')}
                type='text'
                fullWidth
                value={inputValue}
                error={!!errors?.name}
                helperText={errors?.name ? t(errors.name) : ''}
                onChange={e => setInputValue(e.target.value)}
                sx={{ flex: 2 }}
              />
              <input
                type='file'
                id='file-input'
                accept="image/*"
                style={{ display: 'none' }}
                onChange={e => handleImgChange(e.target.files[0])}
              />
              <TextField
                margin='dense'
                label={t('imageUrl')}
                fullWidth
                sx={{ flex: 2 }}
                error={!!errors?.imageUrl}
                helperText={errors?.imageUrl ? t(errors.imageUrl) : ''}
                value={selectedFile ? selectedFile.name : (initialData?.imageUrl || '')}
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

            {/* Image Preview Section */}
            {imagePreview && (
              <Card sx={{ maxWidth: '100%', boxShadow: 'none', bgcolor: 'background.default' }}>
                <Box sx={{ position: 'relative', width: '100%', height: 200 }}>
                  <CardMedia
                    component="img"
                    image={imagePreview}
                    alt="Selected image preview"
                    sx={{
                      height: '100%',
                      objectFit: 'contain',
                      borderRadius: 1,
                      bgcolor: 'background.paper'
                    }}
                  />
                </Box>
                <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
                  {t('imagePreview')}
                </Typography>
              </Card>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAndReset} color='secondary'>
            {t('cancel')}
          </Button>
          <Button type='submit' color='primary' variant="contained">
            {loading ? <CircularProgress size={24} /> : isEdit ? t('edit') : t('create')}
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
  defaultIMGValue: PropTypes.string,
  initialData: PropTypes.shape({
    name: PropTypes.string,
    imageUrl: PropTypes.string
  }),
  errors: PropTypes.shape({
    name: PropTypes.string,
    imageUrl: PropTypes.string
  }),
  loading: PropTypes.bool,
  t: PropTypes.func.isRequired
}

CreateEditItemModal.defaultProps = {
  isEdit: false,
  initialData: null,
  errors: {},
  loading: false
}

export default CreateEditItemModal
