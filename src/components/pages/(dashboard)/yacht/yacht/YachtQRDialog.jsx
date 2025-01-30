import React, { useEffect, useState, useRef } from 'react'
import QRCode from 'qrcode'
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material'
import html2canvas from 'html2canvas'

const YachtQRDialog = ({ open, onClose, yachtId, yachtName, yachtHIN, t }) => {
  const [qrDataUrl, setQrDataUrl] = useState('')
  const qrContainerRef = useRef(null)

  useEffect(() => {
    if (open && yachtId) {
      generateQRCode()
    }
  }, [open, yachtId])

  const generateQRCode = async () => {
    try {
      const qrData = JSON.stringify({
        yachtId: yachtId,
        name: yachtName,
        hin: yachtHIN
      })
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

  const handleDownload = async () => {
    try {
      if (qrContainerRef.current) {
        const canvas = await html2canvas(qrContainerRef.current, {
          backgroundColor: '#ffffff',
          scale: 2 // Higher quality
        })

        const dataUrl = canvas.toDataURL('image/png')
        const link = document.createElement('a')
        link.download = `yacht_qr_${yachtId}.png`
        link.href = dataUrl
        link.click()
      }
    } catch (err) {
      console.error('Error generating image:', err)
    }
  }

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{t('qrCode')}</DialogTitle>
      <DialogContent className="flex flex-col items-center p-6">
        <div
          ref={qrContainerRef}
          className="flex flex-col items-center bg-white p-6 rounded-lg"
        >
          {qrDataUrl && (
            <>
              <img src={qrDataUrl} alt="QR Code" className="w-40 h-40 mb-4" />
              <Typography
                variant="subtitle1"
                className="text-center font-semibold mb-1"
              >
                {yachtName}
              </Typography>
              <Typography
                variant="body2"
                className="text-center text-gray-600"
              >
                HIN: {yachtHIN}
              </Typography>
            </>
          )}
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleDownload}>{t('download')}</Button>
        <Button onClick={onClose} color="secondary">
          {t('close')}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default YachtQRDialog
