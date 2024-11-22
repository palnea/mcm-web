import {getServerMode} from "@core/utils/serverHelpers";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import FormLayout from '@components/form/FormLayout'
import CustomTable from "../../../components/Table/CustomTable";
import Card from "@mui/material/Card";

export default function Page() {
  const serverMode = getServerMode()

  const columns = [
    { label: "ID", field: "id" },
    { label: "Name", field: "name" },
    { label: "Email", field: "email" },
  ];

  const rows = Array.from({ length: 100 }, (_, index) => ({
    id: index + 1,
    name: `Name ${index + 1}`,
    email: `email${index + 1}@example.com`,
  }));

  return (
    <Grid container spacing={6}>
      <Grid item xs={12} sm={6} md={6} lg={6}>
        <Typography variant='h4'>Yat Işlemleri</Typography>
      </Grid>
      <Grid item xs={12} sm={12} md={12} lg={12}>
        <FormLayout title={"Yat Oluştur"}/>
      </Grid>
      <Grid item xs={12} sm={12} md={12} lg={12}>
        <Card>
          <CustomTable rows={rows} columns={columns} />

        </Card>
      </Grid>
    </Grid>

  )
}
