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
  Button,
  Autocomplete,
  Chip
} from '@mui/material'
import api from '../../../../../api_helper/api'

const CreateEditTeamModal = ({
                               open,
                               isEdit,
                               onClose,
                               onSave,
                               initialData,
                               errors,
                               loading,
                               companies,
                               subcontractors,
                               users,
                               translations
                             }) => {
  const [name, setName] = useState('')
  const [selectedCompany, setSelectedCompany] = useState(null)
  const [selectedSubcontractor, setSelectedSubcontractor] = useState(null)
  const [selectedUsers, setSelectedUsers] = useState([])
  const [originalUsers, setOriginalUsers] = useState([])

  useEffect(() => {
    if (isEdit && initialData?.id) {
      // Fetch team details to get current users
      fetchTeamDetails(initialData.id)
    } else {
      resetForm()
    }
  }, [isEdit, initialData])

  const fetchTeamDetails = async (teamId) => {
    try {
      const response = await api.get(`/Teams/GetWithDetails/${teamId}`)
      const teamDetails = response.data.data

      setName(teamDetails.name || '')
      setSelectedCompany(companies.find(c => c.id === teamDetails.companyId) || null)
      setSelectedSubcontractor(subcontractors.find(s => s.id === teamDetails.subContractorId) || null)

      // Set current users and keep track of original users
      const teamUsers = teamDetails.users || []
      const userObjects = teamUsers.map(user => users.find(u => u.id === user.id)).filter(Boolean)
      setSelectedUsers(userObjects)
      setOriginalUsers(userObjects)
    } catch (err) {
      console.error('Error fetching team details:', err)
    }
  }

  const handleUserChange = async (event, newValue) => {
    if (isEdit) {
      // Find added and removed users
      const added = newValue.filter(user =>
        !originalUsers.find(orig => orig.id === user.id)
      )
      const removed = originalUsers.filter(user =>
        !newValue.find(newUser => newUser.id === user.id)
      )

      let hasError = false

      // Handle additions
      for (const user of added) {
        try {
          await api.post('/TeamToUsers', {
            teamId: initialData.id,
            userId: user.id
          })
        } catch (err) {
          console.error('Error adding user:', err)
          hasError = true
          break
        }
      }

      // Handle removals
      for (const user of removed) {
        try {
          await api.post('/TeamToUsers/Remove', {
            teamId: initialData.id,
            userId: user.id
          })
        } catch (err) {
          console.error('Error removing user:', err)
          hasError = true
          break
        }
      }

      if (hasError) {
        // Refresh team details if there was an error
        await fetchTeamDetails(initialData.id)
      } else {
        setOriginalUsers(newValue)
        setSelectedUsers(newValue)
      }
    } else {
      // In create mode, just update the selected users
      setSelectedUsers(newValue)
    }
  }

  const resetForm = () => {
    setName('')
    setSelectedCompany(null)
    setSelectedSubcontractor(null)
    setSelectedUsers([])
    setOriginalUsers([])
  }

  const handleSubmit = event => {
    event.preventDefault()
    const formData = {
      name,
      companyId: selectedCompany?.id,
      subContractorId: selectedSubcontractor?.id,
      userIds: selectedUsers.map(user => user.id)
    }

    if (isEdit) {
      formData.id = initialData.id
    }

    onSave(formData)
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

  const isFormValid = name && selectedCompany && selectedSubcontractor && !loading

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md">
      <DialogTitle>{isEdit ? translations.editTitle : translations.createTitle}</DialogTitle>
      <form noValidate autoComplete="off" onSubmit={handleSubmit}>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={3}>
            <TextField
              autoFocus
              margin="dense"
              label={translations.nameLabel}
              type="text"
              fullWidth
              value={name}
              error={!!errors?.name}
              helperText={errors?.name || ''}
              onChange={e => setName(e.target.value)}
            />

            <Autocomplete
              value={selectedCompany}
              onChange={(event, newValue) => setSelectedCompany(newValue)}
              options={companies}
              getOptionLabel={option => option.name}
              renderInput={params => (
                <TextField
                  {...params}
                  label={translations.companyLabel}
                  error={!!errors?.companyId}
                  helperText={errors?.companyId || ''}
                  margin="dense"
                />
              )}
            />

            <Autocomplete
              value={selectedSubcontractor}
              onChange={(event, newValue) => setSelectedSubcontractor(newValue)}
              options={subcontractors}
              getOptionLabel={option => option.name}
              renderInput={params => (
                <TextField
                  {...params}
                  label={translations.subcontractorLabel}
                  error={!!errors?.subContractorId}
                  helperText={errors?.subContractorId || ''}
                  margin="dense"
                />
              )}
            />

            <Autocomplete
              multiple
              value={selectedUsers}
              onChange={handleUserChange}
              options={users}
              getOptionLabel={option => option.name}
              renderInput={params => (
                <TextField
                  {...params}
                  label={translations.usersLabel}
                  error={!!errors?.userIds}
                  helperText={errors?.userIds || ''}
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
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            {translations.cancelText}
          </Button>
          <Button
            type="submit"
            color="primary"
            variant="contained"
            disabled={!isFormValid}
          >
            {loading ? <CircularProgress size={24} /> : isEdit ? translations.editText : translations.createText}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

CreateEditTeamModal.propTypes = {
  open: PropTypes.bool.isRequired,
  isEdit: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  initialData: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
    company: PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string
    }),
    subcontractor: PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string
    }),
    users: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string
    }))
  }),
  errors: PropTypes.shape({
    name: PropTypes.string,
    companyId: PropTypes.string,
    subContractorId: PropTypes.string,
    userIds: PropTypes.string
  }),
  loading: PropTypes.bool,
  companies: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string
  })).isRequired,
  subcontractors: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string
  })).isRequired,
  users: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string
  })).isRequired,
  translations: PropTypes.shape({
    editTitle: PropTypes.string.isRequired,
    createTitle: PropTypes.string.isRequired,
    nameLabel: PropTypes.string.isRequired,
    companyLabel: PropTypes.string.isRequired,
    subcontractorLabel: PropTypes.string.isRequired,
    usersLabel: PropTypes.string.isRequired,
    cancelText: PropTypes.string.isRequired,
    editText: PropTypes.string.isRequired,
    createText: PropTypes.string.isRequired
  }).isRequired
}

CreateEditTeamModal.defaultProps = {
  isEdit: false,
  initialData: null,
  errors: {},
  loading: false
}

export default CreateEditTeamModal
