import { useState } from 'react'
import {
  Avatar,
  Badge,
  Box,
  Card,
  CardContent,
  CardHeader,
  Dialog, DialogContent, DialogTitle,
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
import TeamsDialogContent from '@components/pages/(dashboard)/team-statistics/TeamDialogContent'

const TeamListWidget = ({ teams, tickets }) => {
  const [dialogOpen, setDialogOpen] = useState(false)

  return (
    <>
      <Card sx={{ height: '100%', cursor: 'pointer' }} onClick={() => setDialogOpen(true)}>
        <CardHeader
          title='Team List'
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
                  <TableCell>Team</TableCell>
                  <TableCell>Members</TableCell>
                  <TableCell>Status</TableCell>
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
                    <TableCell>{team.userCount || 0} members</TableCell>
                    <TableCell>
                      <Badge color={team.userCount > 0 ? 'success' : 'warning'} variant='dot'>
                        {team.userCount > 0 ? 'Active' : 'Empty'}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth='md' fullWidth>
        <DialogTitle>Team Details</DialogTitle>
        <DialogContent>
          <TeamsDialogContent teams={teams} tickets={tickets}/>
        </DialogContent>
      </Dialog>
    </>
  )
}


export default TeamListWidget
