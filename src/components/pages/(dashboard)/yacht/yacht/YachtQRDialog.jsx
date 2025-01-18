import React, { useEffect, useState } from 'react'
import QRCode from 'qrcode'
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material'

const YachtQRDialog = ({ open, onClose, yachtId, t }) => {
  const [qrDataUrl, setQrDataUrl] = useState('')

  useEffect(() => {
    if (open && yachtId) {
      generateQRCode()
    }
  }, [open, yachtId])

  const generateQRCode = async () => {
    try {
      const qrData = JSON.stringify({ yachtId: yachtId })
      const dataUrl = await QRCode.toDataURL(qrData, {
        width: 150,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#ffffff'
        }
      })
      setQrDataUrl(dataUrl)
    } catch (err) {
      console.error('Error generating QR code:', err)
    }
  }

  const handleDownload = () => {
    const link = document.createElement('a')
    link.download = `yacht_qr_${yachtId}.png`
    link.href = qrDataUrl
    link.click()
  }

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{t('qrCode')}</DialogTitle>
      <DialogContent className='flex justify-center p-6'>
        {qrDataUrl && <img src={qrDataUrl} alt='QR Code' className='w-40 h-40' />}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleDownload}>{t('download')}</Button>
        <Button onClick={onClose} color='secondary'>
          {t('close')}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default YachtQRDialog
