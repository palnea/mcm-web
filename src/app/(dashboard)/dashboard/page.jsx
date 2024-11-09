"use client"; // Add this line at the top

import Grid from '@mui/material/Grid'
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import CardStatVertical from '@/components/card-statistics/Vertical'

export default function Page() {

  const [closedTicketData, setClosedTicketData] = useState(null);
  const [openTicketData, setOpenTicketData] = useState(null);
  const [errorClosedTicket, setErrorClosedTicket] = useState(null);
  const [errorOpenTicket, setErrorOpenTicket] = useState(null);

  useEffect(() => {
    // const fetchDataClosed = async () => {
    //   try {
    //     const response = await axios.post('/backend', {
    //       // Replace with actual payload
    //       params: { /* ... */ }
    //     });
    //     // console.log(response)
    //     setClosedTicketData(response.data.stats);
    //     setClosedTicketData("40"); // delete this after
    //
    //   } catch (err) {
    //     setErrorClosedTicket(false);
    //   }
    // };
    setClosedTicketData("40"); // delete this after


    // fetchDataClosed();

    // const fetchDataOpen = async () => {
    //   try {
    //     const response = await axios.post('/backend', {
    //       // Replace with actual payload
    //       params: { /* ... */ }
    //     });
    //     setOpenTicketData(response.data.stats);
    //     setOpenTicketData("21"); // delete this after
    //
    //   } catch (err) {
    //     setErrorOpenTicket('Failed to fetch data');
    //   }
    // };

    setOpenTicketData("21"); // delete this after


    // fetchDataOpen();
  }, []);

  return (
    <Grid container spacing={6}>
      <Grid item xs={12} sm={6} md={6} lg={6}>
        {!errorClosedTicket &&
          <CardStatVertical
            title='Kapanmış Ticket Sayısı'
            stats={closedTicketData}
            avatarColor='error'
            avatarIcon='tabler-ticket'
            avatarSkin='light'
            avatarSize={44}
            avatarIconSize={28}
          />
        }


      </Grid>
      <Grid item xs={12} sm={6} md={6} lg={6}>
        {!errorOpenTicket &&
          <CardStatVertical
            title='Açık Ticket Sayısı'
            stats={openTicketData}
            avatarColor='success'
            avatarIcon='tabler-ticket'
            avatarSkin='light'
            avatarSize={44}
            avatarIconSize={28}
          />
        }


      </Grid>
    </Grid>

  )
}
