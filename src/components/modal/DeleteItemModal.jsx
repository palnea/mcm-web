import React from 'react'
import PropTypes from 'prop-types'
import { CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'

const DeleteCompanyDialog = ({ open, onClose, onConfirm, companyName, loading, t, language }) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{t('deleteCompany')}</DialogTitle>
      <DialogContent>
        {language === 'en' ? (
          <Typography component='div'>
            {t('deleteCompanyMsg')}
            <Box fontWeight='fontWeightBold' display='inline'>
              {companyName}
            </Box>
            ?
          </Typography>
        ) : (
          <Typography>
            <Box fontWeight='fontWeightBold' display='inline'>
              {companyName}
            </Box>{' '}
            {t('deleteBrandMessage')}
          </Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color='secondary'>
          {t('cancel')}
        </Button>
        <Button onClick={onConfirm} color='primary'>
          {loading ? <CircularProgress size={24} /> : t('delete')}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

DeleteCompanyDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  companyName: PropTypes.string,
  loading: PropTypes.bool,
  t: PropTypes.func.isRequired,
  language: PropTypes.string.isRequired
}

DeleteCompanyDialog.defaultProps = {
  companyName: '',
  loading: false
}

export default DeleteCompanyDialog
