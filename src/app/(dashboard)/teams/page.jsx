'use client'

import React from 'react'
import { Container } from '@mui/material'
import TeamsDialogContent from '@components/pages/(dashboard)/team-statistics/TeamDialogContent'

const Page = () => {


  return <Container maxWidth='xl'>
    <TeamsDialogContent teams={teams} tickets={tickets} t={t}/>
  </Container>
}

export default Page
