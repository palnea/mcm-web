"use client"; // Add this line at the top
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import FormLayout from '@components/form/FormLayout'
import CustomTable from "../../../../components/Table/CustomTable";
import Card from "@mui/material/Card";
import React, {useEffect, useState} from "react";
import axios from "axios";
import useApi from "@/api_helper/useApi";
import * as https from "https";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import {Dialog, DialogActions, DialogContent, DialogTitle} from "@mui/material";
import TextField from "@mui/material/TextField";
import {useTranslation} from "react-i18next";
import secureLocalStorage from "react-secure-storage";
import Box from "@mui/material/Box";


export default function Page() {

  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [editID, setEditID] = useState('');
  const [removeID, setRemoveID] = useState('');
  const [rows, setRows] = useState([]);

  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [nameDel, setNameDel] = useState('');
  const [isEdit, setIsEdit] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const { t, i18n } = useTranslation('common');


  const fetchData = async (id, name) => {
    try {
      const response = await axios.get('http://localhost:7153/api/YachtBrands',
        {
          headers: {
            Authorization: 'Bearer ' + secureLocalStorage.getItem("accessToken"),
          },
        });
      setRows(response.data.data);


    } catch (err) {
      // setErrorClosedTicket(false);
    }
  };


   useEffect(() => {
     fetchData();
     // console.log(data)
   }, []);


  useEffect(() => {
    if (isEdit) {
      setInputValue(name);
    }
  }, [isEdit, name]);

  const columns = [
    { id: "id", label: "id" },
    { id: "name", label: "name" },
    { id: "createdDate", label: "createdDate",
      render: (row) => {
        const date = new Date(row.createdDate);
        return date.toLocaleDateString();
      }},
    { id: "updatedDate", label: "updatedDate",
      render: (row) => {
        const date = new Date(row.updatedDate);
        return date.toLocaleDateString();
      }
    },
    {
      id: 'actions',
      label: 'actions',
      minWidth: 100,
      render: (row) => (
        <>
          <IconButton
            size="small"
            color={'primary'}
            // startIcon={<i className='tabler-pencil m-0' />}
            onClick={() => handleEdit(row.id,  row.name)}
          >
            <i className='tabler-pencil' />
          </IconButton>



          <IconButton
            color={'error'}
            size="small"
            // startIcon={<i className='tabler-trash' />}
            onClick={() => handleDelete(row.id, row.name)}
          >
            <i className='tabler-trash' />
          </IconButton>
        </>
      ),
    },
  ];

  const handleEdit = (id, name) => {
    setIsEdit(true);
    setName(name);
    setEditID(id)
    handleOpen();
    //edit logic here
    console.log('Edit ID:', id);
  };


  const handleDelete = (id, name) => {
     handleOpenDeleteModal(true);
    setNameDel(name);
    setRemoveID(id);
    //delete logic here
    console.log('Delete ID:', id);
  };

  // const rows = Array.from({ length: 100 }, (_, index) => ({
  //   id: index + 1,
  //   name: `Name ${index + 1}`,
  //   email: `email${index + 1}@example.com`,
  // }));

  // const rows =  [
  //   {
  //     "id": 1,
  //     "name": "Aquila",
  //     "createdDate": "2024-10-22T17:03:27.497487",
  //     "updatedDate": "2024-10-22T17:08:04.755234"
  //   },
  //   {
  //     "id": 2,
  //     "name": "Azimut",
  //     "createdDate": "2024-10-22T17:03:59.189454",
  //     "updatedDate": "2024-10-22T17:03:59.189456"
  //   },
  //   {
  //     "id": 4,
  //     "name": "Ferretti",
  //     "createdDate": "2024-10-22T17:04:22.121183",
  //     "updatedDate": "2024-10-22T17:04:22.121184"
  //   },
  //   {
  //     "id": 6,
  //     "name": "Princess",
  //     "createdDate": "2024-10-22T17:07:41.375176",
  //     "updatedDate": "2024-10-22T17:07:41.375178"
  //   },
  //   {
  //     "id": 3,
  //     "name": "Sunseeker",
  //     "createdDate": "2024-10-22T17:04:11.172213",
  //     "updatedDate": "2024-10-22T17:04:11.172214"
  //   },
  //   {
  //     "id": 7,
  //     "name": "testBrand",
  //     "createdDate": "2024-11-03T23:27:53.910182",
  //     "updatedDate": "2024-11-03T23:27:53.910184"
  //   }
  // ]

  const handleOpen = () => {
    setOpen(true);
  };

  const handleOpenDeleteModal = () => {
    setOpenDeleteModal(true);
  };

  const handleClose = () => {
    setOpen(false);
    setIsEdit(false);
    setInputValue(''); // Reset the input when closing
    setEditID("");
    setRemoveID("");
  };

  const handleSave = () => {
    if (isEdit) {
      const params = {
        "id": editID,
        "name": inputValue
      }
      const editBrand = async () => {
        try {
          const response = await axios.put('http://localhost:7153/api/YachtBrands/Update', params,
            {
              headers: {
                Authorization: 'Bearer ' + secureLocalStorage.getItem("accessToken"),
              },
            });

        } catch (err) {
          // setErrorClosedTicket(false);
        }
      };

      editBrand();
    }
    else {
      const params = {
        "name": inputValue
      }
      const createBrand = async () => {
        try {
          const response = await axios.post('http://localhost:7153/api/YachtBrands', params,
            {
              headers: {
                Authorization: 'Bearer ' + secureLocalStorage.getItem("accessToken"),
              },
            });

        } catch (err) {
          // setErrorClosedTicket(false);
        }
      };

      createBrand();
    }
    setTimeout(() => { fetchData(); }, 2000)

    handleClose();
  };

  const handleDelClose = () => {
    setOpenDeleteModal(false);
    setNameDel(''); // Reset the input when closing
  };

  const handleDelSave = () => {
    const deleteBrand = async () => {
      try {
        const response = await axios.get('http://localhost:7153/api/YachtBrands/Remove/' + removeID,
          {
            headers: {
              Authorization: 'Bearer ' + secureLocalStorage.getItem("accessToken"),
            },
          });

      } catch (err) {
        // setErrorClosedTicket(false);
      }
    };

    deleteBrand();
    setTimeout(() => { fetchData(); }, 2000)
    // Add logic here to save the new item (e.g., send to backend)
    handleDelClose();
  };

  return (
    <>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{t("createNewBrand")}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label={t("name")}
            type="text"
            fullWidth
            variant="outlined"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            {t("cancel")}
          </Button>
          <Button onClick={handleSave} color="primary">
            {t("create")}
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={openDeleteModal} onClose={handleDelClose}>
        <DialogTitle>{t("deleteBrand")}</DialogTitle>
        <DialogContent>
          {i18n.language==='en' ?
            <Typography component='div'>{t('deleteBrandMessage') }<Box fontWeight='fontWeightBold' display='inline'>{nameDel}</Box>?</Typography>
            : <Typography> <Box fontWeight='fontWeightBold' display='inline'>{nameDel}</Box> {t('deleteBrandMessage') }</Typography>}

        </DialogContent>
        <DialogActions>
          <Button onClick={handleDelClose} color="secondary">
            {t("cancel")}
          </Button>
          <Button onClick={handleDelSave} color="primary">
            {t("delete")}
          </Button>
        </DialogActions>
      </Dialog>
      <Grid container spacing={6}>
        <Grid item xs={12} sm={6} md={6} lg={6}>
          <Typography variant='h4'>{t("brandOps")}</Typography>
        </Grid>
        {/*<Grid item xs={12} sm={12} md={12} lg={12}>*/}
        {/*  <FormLayout title={"Yat Oluştur"}/>*/}
        {/*</Grid>*/}
        <Grid item xs={12} sm={12} md={12} lg={12}>
          <Card>
            <div className={"flex justify-end p-3"}>
              <IconButton  variant="contained" color="success" onClick={handleOpen}>
                <i className='tabler-plus' />
              </IconButton>
            </div>

            <CustomTable rows={rows} columns={columns} />

          </Card>
        </Grid>
      </Grid>

    </>

  )
}
