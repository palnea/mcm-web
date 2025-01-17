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
import CreateEditTeamModal from '@components/pages/(dashboard)/users/team/CreateEditTeamModal'

export default function Page() {
  const [open, setOpen] = useState(false)
  const [rows, setRows] = useState([])
  const [companiesDict, setCompaniesDict] = useState({})
  const [subcontractorsDict, setSubcontractorsDict] = useState({})
  const [usersDict, setUsersDict] = useState({})
  const [loading, setLoading] = useState(false)
  const [openDeleteModal, setOpenDeleteModal] = useState(false)
  const [itemToDelete, setItemToDelete] = useState({ id: '', name: '' })
  const [isEdit, setIsEdit] = useState(false)
  const [initialData, setInitialData] = useState(null)
  const { t, i18n } = useTranslation('common')
  const [errors, setErrors] = useState({
    name: '',
    companyId: '',
    subContractorId: '',
    userIds: ''
  })

  const modalTranslations = {
    editTitle: t('editTeam'),
    createTitle: t('createNewTeam'),
    nameLabel: t('name'),
    companyLabel: t('company'),
    subcontractorLabel: t('subcontractor'),
    usersLabel: t('users'),
    cancelText: t('cancel'),
    editText: t('edit'),
    createText: t('create')
  }

  const fetchCompanies = async () => {
    try {
      const response = await api.get('/Companies')
      const companies = response.data.data
      const dict = companies.reduce((acc, company) => {
        acc[company.id] = company
        return acc
      }, {})
      setCompaniesDict(dict)
    } catch (err) {
      console.error('Error fetching companies:', err)
      toast.error(t('Error fetching companies'))
    }
  }

  const fetchSubcontractors = async () => {
    try {
      const response = await api.get('/SubContractors')
      const subcontractors = response.data.data
      const dict = subcontractors.reduce((acc, subcontractor) => {
        acc[subcontractor.id] = subcontractor
        return acc
      }, {})
      setSubcontractorsDict(dict)
    } catch (err) {
      console.error('Error fetching subcontractors:', err)
      toast.error(t('Error fetching subcontractors'))
    }
  }

  const fetchUsers = async () => {
    try {
      const response = await api.get('/Users')
      const users = response.data.data
      const dict = users.reduce((acc, user) => {
        acc[user.id] = user
        return acc
      }, {})
      setUsersDict(dict)
    } catch (err) {
      console.error('Error fetching users:', err)
      toast.error(t('Error fetching users'))
    }
  }

  const fetchTeams = async () => {
    try {
      const response = await api.get('/Teams')
      setRows(response.data.data)
    } catch (err) {
      console.error('Error fetching teams:', err)
      toast.error(t('Error fetching teams'))
    }
  }

  useEffect(() => {
    fetchTeams()
    fetchCompanies()
    fetchSubcontractors()
    fetchUsers()
  }, [])

  const columns = [
    { id: 'id', label: 'id' },
    { id: 'name', label: 'name' },
    {
      id: 'companyName',
      label: 'Company',
      render: row => companiesDict[row.companyId]?.name || '-'
    },
    {
      id: 'subcontractorName',
      label: 'Subcontractor',
      render: row => subcontractorsDict[row.subContractorId]?.name || '-'
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
          <IconButton size='small' color={'primary'} onClick={() => handleEdit(row)}>
            <i className='tabler-pencil' />
          </IconButton>
          <IconButton color={'error'} size='small' onClick={() => handleDelete(row.id, row.name)}>
            <i className='tabler-trash' />
          </IconButton>
        </>
      )
    }
  ]

  const handleEdit = (row) => {
    setIsEdit(true)
    setInitialData({
      ...row,
      company: companiesDict[row.companyId],
      subcontractor: subcontractorsDict[row.subContractorId],
      users: (row.users || []).map(userId => usersDict[userId])
    })
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
    setInitialData(null)
    setErrors({
      name: '',
      companyId: '',
      subContractorId: '',
      userIds: ''
    })
  }

  const handleSave = async (formData) => {
    let newErrors = {}
    if (!formData.name) {
      newErrors.name = 'Name is required'
    }
    if (!formData.companyId) {
      newErrors.companyId = 'Company is required'
    }
    if (!formData.subContractorId) {
      newErrors.subContractorId = 'Subcontractor is required'
    }

    setErrors(newErrors)

    if (Object.keys(newErrors).length === 0) {
      setLoading(true)
      try {
        const response = isEdit
          ? await api.put('/Teams/Update', formData)
          : await api.post('/Teams', formData)

        if (response.status >= 200 && response.status < 300) {
          handleClose()
          toast.success(isEdit ? t('Team updated successfully!') : t('Team created successfully!'))
          fetchTeams()
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
      const response = await api.get('/Teams/Remove/' + itemToDelete.id)
      if (response.status >= 200 && response.status < 300) {
        handleDelClose()
        toast.success(t('Team deleted successfully!'))
        fetchTeams()
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

      <CreateEditTeamModal
        open={open}
        onClose={handleClose}
        onSave={handleSave}
        isEdit={isEdit}
        initialData={initialData}
        errors={errors}
        loading={loading}
        companies={Object.values(companiesDict)}
        subcontractors={Object.values(subcontractorsDict)}
        users={Object.values(usersDict)}
        translations={modalTranslations}
      />

      <DeleteItemModal
        open={openDeleteModal}
        onClose={handleDelClose}
        onConfirm={handleDelConfirm}
        itemName={itemToDelete.name}
        loading={loading}
        language={i18n.language}
        deleteTitle={t('deleteTeam')}
        deleteMessage={t('deleteTeamMessage')}
        cancelText={t('cancel')}
        deleteText={t('delete')}
      />

      <Grid container spacing={6}>
        <Grid item xs={12} sm={6} md={6} lg={6}>
          <Typography variant='h4'>{t('teamOps')}</Typography>
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
