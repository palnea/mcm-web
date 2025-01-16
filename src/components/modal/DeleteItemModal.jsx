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
                           language,
                           deleteTitle,
                           deleteMessage,
                           cancelText,
                           deleteText
                         }) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{deleteTitle}</DialogTitle>
      <DialogContent>
        {language === 'en' ? (
          <Typography component='div'>
            {deleteMessage}
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
            {deleteMessage}
          </Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color='secondary'>
          {cancelText}
        </Button>
        <Button onClick={onConfirm} color='error'>
          {loading ? <CircularProgress size={24} /> : deleteText}
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
  language: PropTypes.string.isRequired,
  deleteTitle: PropTypes.string.isRequired,
  deleteMessage: PropTypes.string.isRequired,
  cancelText: PropTypes.string.isRequired,
  deleteText: PropTypes.string.isRequired
}

DeleteItemModal.defaultProps = {
  itemName: '',
  loading: false
}

export default DeleteItemModal
