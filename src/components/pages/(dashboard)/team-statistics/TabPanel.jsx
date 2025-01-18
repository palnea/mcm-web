import { Box } from '@mui/material'

const TabPanel = ({ children, value, index }) => {
  return <div hidden={value !== index}>{value === index && <Box sx={{ py: 2 }}>{children}</Box>}</div>
}

export default TabPanel
