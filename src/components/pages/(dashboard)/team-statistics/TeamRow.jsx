import React, { useEffect, useState } from 'react'
import api from '@/api_helper/api'
import { toast } from 'react-toastify'
import { Box, Collapse, IconButton, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import UserDetails from '@components/pages/(dashboard)/team-statistics/UserDetails'

const TeamRow = ({ team, tickets, t }) => {
  const [open, setOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [users, setUsers] = useState([])


  const fetchTeamDetails = async teamId => {
    try {
      const response = await api.get(`/Teams/GetWithDetails/${teamId}`)
      return response.data.data || null
    } catch (err) {
      console.error('Error fetching team details:', err)
      toast.error(t('An error occurred while fetching team details'))
      return null
    }
  }

  useEffect(() => {
    fetchTeamDetails(team.id).then(teamDetails => {
      setUsers(teamDetails?.users || [])
    })
  }, [])

  return (
    <>
      <TableRow>
        <TableCell>
          <IconButton size='small' onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell>{team.name}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout='auto' unmountOnExit>
            <Box margin={1}>
              <Typography variant='h6' gutterBottom component='div'>
                {t('Team Members')}
              </Typography>
              <Table size='small'>
                <TableHead>
                  <TableRow>
                    <TableCell>{t('Name')}</TableCell>
                    <TableCell>{t('Email')}</TableCell>
                    <TableCell>{t('Action')}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users?.map(user => (
                    <>
                      <TableRow key={`${user.id}-header`}>
                        <TableCell>{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <IconButton
                            size='small'
                            onClick={() => setSelectedUser(selectedUser === user.id ? null : user.id)}
                          >
                            {selectedUser === user.id ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                          </IconButton>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                          <Collapse in={selectedUser === user.id} timeout='auto' unmountOnExit>
                            <Box margin={1}>
                              <UserDetails user={user} tickets={tickets} t={t}/>
                            </Box>
                          </Collapse>
                        </TableCell>
                      </TableRow>
                    </>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  )
}

export default TeamRow;
