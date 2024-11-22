"use client"; // Add this line at the top

// MUI Imports
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import InputAdornment from '@mui/material/InputAdornment'

// Components Imports
import CustomTextField from '@core/components/mui/TextField'
import Form from '/src/components/form/Form'
import IconButton from "@mui/material/IconButton";
import {useState} from "react";
import MenuItem from "@mui/material/MenuItem";

const FormLayout = () => {

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    country: '',
    language: [],
    date: null,
    phoneNumber: '',
    username: '',
    email: '',
    password: '',
    isPasswordShown: false,
    confirmPassword: '',
    setIsConfirmPasswordShown: false,
    twitter: '',
    facebook: '',
    google: '',
    linkedin: '',
    instagram: '',
    quora: ''
  })

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    console.log('Selected file:', file);

  }

  return (
    <Card>
      <CardHeader title='Basic with Icons' />
      <CardContent>
        <Form>
          <Grid container spacing={6}>
            <Grid item xs={12}>
              <CustomTextField
                fullWidth
                label='Name'
                placeholder='John Doe'
                InputProps={{
                  startAdornment: (
                    <InputAdornment position='start'>
                      <i className='tabler-user' />
                    </InputAdornment>
                  )
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <CustomTextField
                fullWidth
                rows={4}
                multiline
                label='Message'
                placeholder='Bio...'
                sx={{ '& .MuiInputBase-root.MuiFilledInput-root': { alignItems: 'baseline' } }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position='start'>
                      <i className='tabler-message' />
                    </InputAdornment>
                  )
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <CustomTextField
                select
                fullWidth
                label='Country'
                value={formData.country}
                onChange={e => setFormData({ ...formData, country: e.target.value })}
              >
                <MenuItem value=''>Select Country</MenuItem>
                <MenuItem value='UK'>UK</MenuItem>
                <MenuItem value='USA'>USA</MenuItem>
                <MenuItem value='Australia'>Australia</MenuItem>
                <MenuItem value='Germany'>Germany</MenuItem>
              </CustomTextField>
            </Grid>
            <Grid item xs={12}>
              <CustomTextField
                fullWidth
                label="Upload File"
                placeholder="Select a file"
                InputProps={{
                  // startAdornment: (
                  //   <InputAdornment position="start">
                  //     <i className="tabler-upload" />
                  //   </InputAdornment>
                  // ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <input
                        type="file"
                        onChange={handleFileChange}
                        style={{ display: 'none' }}
                        id="file-upload-input"
                      />
                      <label htmlFor="file-upload-input">
                        <IconButton component="span">
                          <i className="tabler-upload" />
                        </IconButton>
                      </label>
                    </InputAdornment>
                  ),
                  readOnly: true, // This makes the text field read-only
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <Button variant='contained' type='submit'>
                Submit
              </Button>
            </Grid>
          </Grid>
        </Form>
      </CardContent>
    </Card>
  )
}

export default FormLayout
