import React, { useState } from 'react'
import { Collapse, IconButton, TableCell, TableRow } from '@mui/material'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import UserDetails from '@components/pages/(dashboard)/team-statistics/UserDetails'

const UserRow = ({ user, tickets, t }) => {
  const [open, setOpen] = useState(false)

  return (
    <>
      <TableRow>
        <TableCell>
          <IconButton size='small' onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell>{user.fullName || t('User {userId}', {userId: user.userId})}</TableCell>
        <TableCell>{user.count}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout='auto' unmountOnExit>
            <UserDetails user={user} tickets={tickets} t={t} />
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  )
}

export default UserRow
