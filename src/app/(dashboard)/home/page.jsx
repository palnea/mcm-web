import Grid from '@mui/material/Grid'

import { getServerMode } from '@core/utils/serverHelpers'
import CardStatVertical from '@/components/card-statistics/Vertical'

export default function Page() {
  const serverMode = getServerMode()

  return (
    <Grid container spacing={6}>
      <Grid item xs={12} sm={6} md={6} lg={6}>
        <CardStatVertical
          title='Total Profit'
          subtitle='Last Week'
          stats='1.28k'
          avatarColor='error'
          avatarIcon='tabler-credit-card'
          avatarSkin='light'
          avatarSize={44}
          avatarIconSize={28}
          chipText='-12.2%'
          chipColor='error'
          chipVariant='tonal'
        />

      </Grid>
      <Grid item xs={12} sm={6} md={6} lg={6}>
        <CardStatVertical
          title='Total Profit'
          subtitle='Last Week'
          stats='1.28k'
          avatarColor='error'
          avatarIcon='tabler-credit-card'
          avatarSkin='light'
          avatarSize={44}
          avatarIconSize={28}
          chipText='-12.2%'
          chipColor='error'
          chipVariant='tonal'
        />

      </Grid>
    </Grid>

  )
}
