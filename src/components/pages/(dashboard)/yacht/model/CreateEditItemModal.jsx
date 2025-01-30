import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import {
  Box,
  Card,
  CardMedia, CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormHelperText,
  IconButton,
  InputAdornment,
  InputLabel,
  Select,
  Stack,
  TextField,
  Typography
} from '@mui/material'
import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'
import { CloudUpload as CloudUploadIcon } from '@mui/icons-material'

const CreateEditItemModal = ({
  open,
  onClose,
  onSave,
  isEdit,
  loading,
  options,
  errors,
  texts,
  initialData
}) => {
  const [inputValue, setInputValue] = useState('')
  const [selectedFile, setSelectedFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [selectValue, setSelectValue] = useState('')

  useEffect(() => {
    if (isEdit && initialData) {
      setInputValue(initialData.name || '')
      setImagePreview(initialData.imageUrl || null)
      setSelectValue(initialData.brandId || '')
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
    formData.append('brandId', selectValue)

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
    setSelectValue(null)
    onClose()
  }

  return (
    <Dialog open={open} onClose={handleCloseAndReset}>
      <DialogTitle>{isEdit ? texts.editTitle : texts.createTitle}</DialogTitle>
      <form noValidate autoComplete='off' onSubmit={handleSubmit} className='flex flex-col gap-5'>
        <DialogContent>
          <Stack direction={'column'}>
            <Box display='flex' sx={{ alignItems: 'baseline' }} gap={2}>
              <TextField
                autoFocus
                margin='dense'
                label={texts.nameLabel}
                type='text'
                value={inputValue}
                error={!!errors.name}
                helperText={errors.name}
                onChange={e => setInputValue(e.target.value)}
                sx={{ flex: 1 }}
              />
              <FormControl variant='outlined' error={!!errors.brandId} sx={{ flex: 1 }}>
                <InputLabel>{texts.selectLabel}</InputLabel>
                <Select
                  margin='dense'
                  fullWidth
                  variant='outlined'
                  className='p-0'
                  value={selectValue}
                  label={texts.selectLabel}
                  onChange={e => setSelectValue(e.target.value)}
                  displayEmpty
                >
                  {options.map(option => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText>{errors.brandId}</FormHelperText>
              </FormControl>
              <input
                type='file'
                id='file-input'
                accept='image/*'
                style={{ display: 'none' }}
                onChange={e => handleImgChange(e.target.files[0])}
              />
              <TextField
                margin='dense'
                label={texts.imageLabel}
                fullWidth
                sx={{ flex: 2 }}
                error={!!errors?.imageUrl}
                helperText={errors?.imageUrl ? errors.imageUrl : ''}
                value={selectedFile ? selectedFile.name : !!initialData?.imageUrl ? `${initialData?.name?.replaceAll(" ", "").toLowerCase()}.${initialData?.imageUrl?.split(".").slice(-1)}` || '' : ''}
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
                  {texts.previewLabel}
                </Typography>
              </Card>
            )}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAndReset} color='secondary'>
            {texts.cancelText}
          </Button>
          <Button type='submit' color='primary' variant='contained'>
            {loading ? <CircularProgress size={24} /> : isEdit ? texts.editText : texts.createText}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

CreateEditItemModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  isEdit: PropTypes.bool,
  inputValue: PropTypes.string,
  selectValue: PropTypes.string,
  loading: PropTypes.bool,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      label: PropTypes.string.isRequired
    })
  ).isRequired,
  errors: PropTypes.shape({
    name: PropTypes.string,
    brandId: PropTypes.string
  }),
  texts: PropTypes.shape({
    editTitle: PropTypes.string.isRequired,
    createTitle: PropTypes.string.isRequired,
    nameLabel: PropTypes.string.isRequired,
    selectLabel: PropTypes.string.isRequired,
    cancelText: PropTypes.string.isRequired,
    editText: PropTypes.string.isRequired,
    createText: PropTypes.string.isRequired
  }).isRequired
}

CreateEditItemModal.defaultProps = {
  isEdit: false,
  inputValue: '',
  selectValue: '',
  loading: false,
  errors: {}
}

export default CreateEditItemModal
