import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import { Icon } from '@iconify/react'
import Box from '@mui/material/Box'

const CardStatVertical = props => {
  const { title, subtitle, stats, color, icon, onClick, sx } = props

  return (
    <Card onClick={onClick} sx={{ ...sx }}>
      <CardContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', mb: 4 }}>
          {subtitle && (
            <Typography
              variant="caption"
              sx={{
                color: color,
                fontWeight: 600,
                mb: 1
              }}
            >
              {subtitle}
            </Typography>
          )}
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            {title}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <Typography variant="h3" sx={{ color }}>
            {stats}
          </Typography>
          <Icon icon={icon} color={color} width={60} height={60} />
        </Box>
      </CardContent>
    </Card>
  )
}

export default CardStatVertical
