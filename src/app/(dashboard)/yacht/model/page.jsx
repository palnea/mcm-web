'use client' // Add this line at the top
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import CustomTable from '../../../../components/Table/CustomTable'
import Card from '@mui/material/Card'
import React, { useEffect, useState } from 'react'
import api from '../../../../api_helper/api'
import IconButton from '@mui/material/IconButton'
import { useTranslation } from 'react-i18next'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import CreateEditItemModal from '@components/pages/(dashboard)/yacht/model/CreateEditItemModal'
import DeleteItemModal from '@components/pages/(dashboard)/yacht/brand/DeleteItemModal'

export default function Page() {
  const [createEditModalOpen, setCreateEditModalOpen] = useState(false)
  const [name, setName] = useState('')
  const [editID, setEditID] = useState('')
  const [brandId, setBrandID] = useState('')
  const [removeID, setRemoveID] = useState('')
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(false)
  const [openDeleteModal, setOpenDeleteModal] = useState(false)
  const [nameDel, setNameDel] = useState('')
  const [isEdit, setIsEdit] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [selectedFile, setSelectedFile] = useState(null)
  const [idValue, setIdValue] = useState('')
  const { t, i18n } = useTranslation('common')
  const [options, setOptions] = useState([]) // Options for the Select component
  const [errors, setErrors] = useState({
    name: '',
    brandId: ''
  })

  const fetchData = async (id, name) => {
    try {
      const response = await api.get('/YachtModels')
      setRows(response.data.data)
    } catch (err) {
      // setErrorClosedTicket(false);
    }
  }

  const fetchSelect = async (id, name) => {
    try {
      const response = await api.get('/YachtBrands')
      const optionsData = response.data.data.map(item => ({
        label: item.name,
        value: item.id
      }))
      setOptions(optionsData)
    } catch (err) {
      // setErrorClosedTicket(false);
    }
  }

  useEffect(() => {
    fetchData()
    fetchSelect()

    // console.log(data)
  }, [])

  useEffect(() => {
    if (isEdit) {
      setInputValue(name)
      setIdValue(brandId)
      setImageUrl(imageUrl)
    }
  }, [isEdit, name, brandId, imageUrl])

  const columns = [
    { id: 'id', label: 'id' },
    { id: 'name', label: 'name' },
    { id: 'brand', label: 'brand', render: row => row.brandName },
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
          <IconButton
            size='small'
            color={'primary'}
            // startIcon={<i className='tabler-pencil m-0' />}
            onClick={() => handleEdit(row.id, row.name, row.yachtBrandId, row.imageUrl)}
          >
            <i className='tabler-pencil' />
          </IconButton>

          <IconButton
            color={'error'}
            size='small'
            // startIcon={<i className='tabler-trash' />}
            onClick={() => handleDelete(row.id, row.name, row.yachtBrandId)}
          >
            <i className='tabler-trash' />
          </IconButton>
        </>
      )
    }
  ]

  const handleEdit = (id, name, brandId, imageUrl) => {
    setIsEdit(true)
    setName(name)
    setImageUrl(imageUrl)
    setEditID(id)
    setBrandID(brandId)
    handleOpen()
    //edit logic here
  }

  const handleDelete = (id, name) => {
    handleOpenDeleteModal(true)
    setNameDel(name)
    setRemoveID(id)
    //delete logic here
  }

  const handleOpen = () => {
    setCreateEditModalOpen(true)
  }

  const handleCreateEditClose = () => {
    setCreateEditModalOpen(false)
    setIsEdit(false)
    setInputValue('')
    setEditID('')
    setBrandID(null)
    setSelectedFile(null)
    setErrors({
      name: '',
      brandId: '',
      imageUrl: ''
    })
  }

  const handleOpenDeleteModal = () => {
    setOpenDeleteModal(true)
  }

  const handleClose = () => {
    setCreateEditModalOpen(false)
    setIsEdit(false)
    setInputValue('') // Reset the input when closing
    setIdValue('')
    setEditID('')
    setBrandID('')
    setRemoveID('')
    const clearValues = {
      name: '',
      brandId: ''
    }
    setErrors(param => ({
      ...param,
      ...clearValues
    }))
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
        const response = await api.get('/YachtModels/Remove/' + removeID)
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
        setTimeout(() => toast.success(t('Model deleted successfully!')), 800)

        setTimeout(fetchData, 500) // Fetch updated data after closing
      }
    })
  }

  const handleChange = e => {
    setIdValue(e.target.value)
  }

  const uploadFile = async (id, file) => {
    if (!file) return

    const formData = new FormData()
    formData.append('Id', id)
    formData.append('ImageFile', file)
    formData.append('EntityType', 'YachtModel')

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

  const handleSave = async formData => {
    const name = formData.get('name')
    const file = formData.get('file')
    const brandId = formData.get('brandId')
    let newErrors = {}

    if (name === '') {
      newErrors.name = 'Name is required'
    }
    if (brandId === '') {
      newErrors.brandId = 'Brand is required'
    }

    setErrors(newErrors)

    if (Object.keys(newErrors).length === 0) {
      setLoading(true)
      const params = isEdit ? { id: editID, name: name, yachtBrandId: brandId } : { name: name, yachtBrandId: brandId }

      try {
        const response = isEdit ? await api.put('/YachtModels/Update', params) : await api.post('/YachtModels', params)

        if (response.status >= 200 && response.status < 300) {
          // If there's a file to upload, do it after successful create/update
          if (file) {
            const id = isEdit ? editID : response.data.data.id
            await uploadFile(id, file)
          }

          setTimeout(() => {
            handleCreateEditClose()
            toast.success(isEdit ? t('Model updated successfully!') : t('Model created successfully!'))
            fetchData()
          }, 800)
        }
      } catch (err) {
        console.error('Error:', err)
        toast.error(t('An error occurred. Please try again.'))
      } finally {
        setTimeout(() => setLoading(false), 800)
      }
    }
  }

  return (
    <>
      <ToastContainer position='top-right' autoClose={3000} hideProgressBar={false} closeOnClick pauseOnHover />

      <CreateEditItemModal
        open={createEditModalOpen}
        onClose={handleCreateEditClose}
        onSave={handleSave}
        isEdit={isEdit}
        initialData={{
          name: inputValue,
          imageUrl: isEdit ? (imageUrl ? process.env.NEXT_PUBLIC_CONTENT_BASE_URL + '/' + imageUrl : null) : null,
          brandId: brandId
        }}
        loading={loading}
        options={options}
        errors={errors}
        texts={{
          editTitle: t('editModel'),
          createTitle: t('createNewModel'),
          nameLabel: t('name'),
          selectLabel: t('selectBrand'),
          cancelText: t('cancel'),
          editText: t('edit'),
          createText: t('create')
        }}
      />
      <DeleteItemModal
        open={openDeleteModal}
        onClose={handleDelClose}
        onConfirm={handleDelSave}
        language={i18n.language}
        deleteTitle={t('deleteModel')}
        deleteMessage={t('deleteModelMessage')}
        cancelText={t('cancel')}
        deleteText={t('delete')}
      />
      <Grid container spacing={6}>
        <Grid item xs={12} sm={6} md={6} lg={6}>
          <Typography variant='h4'>{t('modelOps')}</Typography>
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
