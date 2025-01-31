import {
  Avatar,
  Badge,
  Box,
  Card,
  CardContent,
  CardHeader,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from '@mui/material'
import PeopleIcon from '@mui/icons-material/People'
import Button from '@mui/material/Button'
import { useRouter, useSearchParams } from 'next/navigation'

const TeamListWidget = ({ teams, t }) => {
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleSeeDetails = widgetType => {
    const params = new URLSearchParams(searchParams)
    params.set('view', widgetType)
    router.push(`?${params.toString()}`)
  }

  return (
    <>
      <Card sx={{ height: '100%' }}>
        <CardHeader
          title={t('Team List')}
          action={
            <Button variant='text' onClick={() => handleSeeDetails('teams')} sx={{ whiteSpace: 'nowrap' }}>
              {t('See Details')}
            </Button>
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
