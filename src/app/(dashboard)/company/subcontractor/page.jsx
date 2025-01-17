'use client'
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
import DeleteItemModal from '@components/pages/(dashboard)/yacht/brand/DeleteItemModal'
import CreateEditSubcontractorModal
  from '@components/pages/(dashboard)/company/subcontractor/CreateEditSubcontractorModal'

export default function Page() {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [companyId, setCompanyId] = useState('')
  const [editID, setEditID] = useState('')
  const [rows, setRows] = useState([])
  const [companies, setCompanies] = useState([])
  const [loading, setLoading] = useState(false)
  const [openDeleteModal, setOpenDeleteModal] = useState(false)
  const [itemToDelete, setItemToDelete] = useState({ id: '', name: '' })
  const [isEdit, setIsEdit] = useState(false)
  const { t, i18n } = useTranslation('common')
  const [errors, setErrors] = useState({
    name: '',
    imageUrl: '',
    companyId: ''
  })

  const modalTranslations = {
    editTitle: t('editSubcontractor'),
    createTitle: t('createNewSubcontractor'),
    nameLabel: t('name'),
    imageLabel: t('imageUrl'),
    companyLabel: t('company'),
    previewLabel: t('imagePreview'),
    cancelText: t('cancel'),
    editText: t('edit'),
    createText: t('create')
  }

  const fetchCompanies = async () => {
    try {
      const response = await api.get('/Companies')
      setCompanies(response.data.data)
    } catch (err) {
      console.error('Error fetching companies:', err)
      toast.error(t('Error fetching companies'))
    }
  }

  const fetchData = async () => {
    try {
      const response = await api.get('/SubContractors')
      setRows(response.data.data)
    } catch (err) {
      console.error('Error fetching data:', err)
    }
  }

  useEffect(() => {
    fetchData()
    fetchCompanies()
  }, [])

  const columns = [
    { id: 'id', label: 'id' },
    { id: 'name', label: 'name' },
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
      minWidth: 100,
      disableSorting: true,
      render: row => (
        <>
          <IconButton size='small' color={'primary'}
                      onClick={() => handleEdit(row.id, row.name, row.imageUrl, row.companyId)}>
            <i className='tabler-pencil' />
          </IconButton>
          <IconButton color={'error'} size='small' onClick={() => handleDelete(row.id, row.name)}>
            <i className='tabler-trash' />
          </IconButton>
        </>
      )
    }
  ]

  const handleEdit = (id, name, imageUrl, companyId) => {
    setIsEdit(true)
    setName(name)
    if (imageUrl)
      setImageUrl(process.env.NEXT_PUBLIC_CONTENT_BASE_URL + '/' + imageUrl)
    setCompanyId(companyId)
    setEditID(id)
    handleOpen()
  }

  const handleDelete = (id, name) => {
    setItemToDelete({ id, name })
    setOpenDeleteModal(true)
  }

  const handleOpen = () => setOpen(true)

  const handleClose = () => {
    setOpen(false)
    setIsEdit(false)
    setEditID('')
    setImageUrl(null)
    setErrors({
      name: '',
      imageUrl: '',
      companyId: ''
    })
  }

  const uploadFile = async (id, file) => {
    if (!file) return

    const formData = new FormData()
    formData.append('Id', id)
    formData.append('ImageFile', file)
    formData.append('EntityType', 'SubContractor')

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
    const companyIdsString = formData.get('companyIds') || '[]'
    const file = formData.get('file')

    let newErrors = {}
    if (!name) {
      newErrors.name = 'Name is required'
    }

    setErrors(newErrors)
    if (Object.keys(newErrors).length === 0) {
      setLoading(true)
      try {
        // Parse the JSON string back to array and ensure all values are integers
        const companyIds = JSON.parse(companyIdsString).map(id => parseInt(id))

        const subcontractorParams = isEdit
          ? { id: editID, name: name }
          : { name: name, companyIds: companyIds }
        const subcontractorResponse = isEdit
          ? await api.put('/SubContractors/Update', subcontractorParams)
          : await api.post('/SubContractors', subcontractorParams)

        if (subcontractorResponse.status >= 200 && subcontractorResponse.status < 300) {
          if (file) {
            const subcontractorId = isEdit ? editID : subcontractorResponse.data.data.id
            await uploadFile(subcontractorId, file)
          }

          handleClose()
          toast.success(isEdit ? t('Subcontractor updated successfully!') : t('Subcontractor created successfully!'))
          fetchData()
        }
      } catch (err) {
        console.error('Error:', err)
        toast.error(t('An error occurred. Please try again.'))
      } finally {
        setLoading(false)
      }
    }
  }

  const handleDelClose = () => {
    setOpenDeleteModal(false)
    setItemToDelete({ id: '', name: '' })
  }

  const handleDelConfirm = async () => {
    setLoading(true)
    try {
      const response = await api.get('/SubContractors/Remove/' + itemToDelete.id)
      if (response.status >= 200 && response.status < 300) {
        handleDelClose()
        toast.success(t('Subcontractor deleted successfully!'))
        fetchData()
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

      <CreateEditSubcontractorModal
        open={open}
        onClose={handleClose}
        onSave={handleSave}
        isEdit={isEdit}
        initialData={{ name: name, imageUrl: imageUrl, companyId: companyId, id: editID }}
        errors={errors}
        loading={loading}
        companies={companies}
        translations={modalTranslations}
      />

      <DeleteItemModal
        open={openDeleteModal}
        onClose={handleDelClose}
        onConfirm={handleDelConfirm}
        itemName={itemToDelete.name}
        loading={loading}
        language={i18n.language}
        deleteTitle={t('deleteSubcontractor')}
        deleteMessage={t('deleteSubcontractorMessage')}
        cancelText={t('cancel')}
        deleteText={t('delete')}
      />

      <Grid container spacing={6}>
        <Grid item xs={12} sm={6} md={6} lg={6}>
          <Typography variant='h4'>{t('subcontractorOps')}</Typography>
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
