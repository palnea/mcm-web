import {
  Avatar,
  Badge,
  Box,
  Card,
  CardContent,
  CardHeader,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from '@mui/material'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import PeopleIcon from '@mui/icons-material/People'

const TeamListWidget = ({ teams, t }) => {
  return (
    <>
      <Card sx={{ height: '100%', cursor: 'pointer' }}>
        <CardHeader
          title={t('Team List')}
          action={
            <IconButton>
              <MoreVertIcon />
            </IconButton>
          }
        />
        <CardContent>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>{t('Team')}</TableCell>
                  <TableCell>{t('Members')}</TableCell>
                  <TableCell>{t('Status')}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {teams.slice(0, 5).map(team => (
                  <TableRow key={team.id}>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                          <PeopleIcon />
                        </Avatar>
                        <Typography>{team.name}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell>{`${team.userCount} ${t('members')}`}</TableCell>
                    <TableCell>
                      <Badge color={team.userCount > 0 ? 'success' : 'warning'} variant='dot'>
                        {team.userCount > 0 ? t('Active') : t('Empty')}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </>
  )
}


export default TeamListWidget
