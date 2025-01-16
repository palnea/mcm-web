import React from 'react'
import PropTypes from 'prop-types'
import { CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'

const DeleteItemModal = ({
                            open,
                            onClose,
                            onConfirm,
                            itemName,
                            loading,
                            t,
                            language,
                            entityType = 'item' // Default to generic 'item'
                          }) => {
  // Generic translation keys that can be used for any entity
  const translationKeys = {
    deleteTitle: `delete${entityType.charAt(0).toUpperCase() + entityType.slice(1)}`,
    deleteMessage: `delete${entityType.charAt(0).toUpperCase() + entityType.slice(1)}Message`
  }

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{t(translationKeys.deleteTitle)}</DialogTitle>
      <DialogContent>
        {language === 'en' ? (
          <Typography component='div'>
            {t(translationKeys.deleteMessage)}
            <Box fontWeight='fontWeightBold' display='inline' ml={1} mr={1}>
              {itemName}
            </Box>
            ?
          </Typography>
        ) : (
          <Typography>
            <Box fontWeight='fontWeightBold' display='inline' mr={1}>
              {itemName}
            </Box>
            {t(translationKeys.deleteMessage)}
          </Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color='secondary'>
          {t('cancel')}
        </Button>
        <Button onClick={onConfirm} color='error'>
          {loading ? <CircularProgress size={24} /> : t('delete')}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

DeleteItemModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  itemName: PropTypes.string,
  loading: PropTypes.bool,
  t: PropTypes.func.isRequired,
  language: PropTypes.string.isRequired,
  entityType: PropTypes.string
}

DeleteItemModal.defaultProps = {
  itemName: '',
  loading: false,
  entityType: 'item'
}

export default DeleteItemModal
