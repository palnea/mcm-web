import {getServerMode} from "@core/utils/serverHelpers";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import FormLayoutsWithIcon from '@components/form/FormLayout'

export default function Page() {
  const serverMode = getServerMode()

  return (
    <Grid container spacing={6}>
      <Grid item xs={12} sm={6} md={6} lg={6}>
        <Typography variant='h4'>Page1</Typography>
      </Grid>
      <Grid item xs={12} sm={12} md={12} lg={12}>
        <FormLayoutsWithIcon/>
      </Grid>
    </Grid>

  )
}
