"use client"; // Add this line at the top

// MUI Imports
import Card from '@mui/material/Card'
import Chip from '@mui/material/Chip'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'

// Third-party Imports
import classnames from 'classnames'

// Component Import
import CustomAvatar from '@core/components/mui/Avatar'

const CardStatsVertical = props => {
  // Props
  const {
    stats,
    title,
    subtitle,
    avatarIcon,
    avatarColor,
    avatarSize,
    avatarIconSize,
    avatarSkin,
    chipText,
    chipColor,
    chipVariant
  } = props

  return (
    <Card
      sx={{
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          right: 0,
          width: '30%',
          height: '100%',
          opacity: 0.05,
          background: theme => avatarColor ? `linear-gradient(135deg, transparent 0%, ${theme.palette[avatarColor]?.main || theme.palette.primary.main} 100%)` : 'none',
          zIndex: 0
        }
      }}
    >
      <CardContent className='flex flex-row-reverse gap-x-3 items-center justify-between'>
        <CustomAvatar
          variant='rounded'
          skin={avatarSkin}
          size={avatarSize}
          color={avatarColor}
          sx={{
            borderRadius: '12px'
          }}
        >
          <i className={classnames(avatarIcon, `text-[${avatarIconSize}px]`)} />
        </CustomAvatar>
        <div className='flex flex-col gap-y-1'>
          <Typography
            variant='h5'
            sx={{
              textTransform: 'uppercase',
              fontWeight: 600,
              letterSpacing: '0.3px',
              fontSize: '0.875rem'
            }}
          >
            {title}
          </Typography>
          {subtitle && <Typography color='text.disabled'>{subtitle}</Typography>}
          <Typography
            variant='h3'
            color='text.primary'
            sx={{ fontWeight: 700 }}
          >
            {stats}
          </Typography>
        </div>
        {chipText && <Chip label={chipText} color={chipColor} variant={chipVariant} size='small' />}
      </CardContent>
    </Card>
  )
}

export default CardStatsVertical
