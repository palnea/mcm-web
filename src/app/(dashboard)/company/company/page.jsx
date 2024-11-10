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
import {Dialog, DialogActions, DialogContent, DialogTitle, Select} from "@mui/material";
import TextField from "@mui/material/TextField";
import {useTranslation} from "react-i18next";
import secureLocalStorage from "react-secure-storage";
import Box from "@mui/material/Box";

export default function Page() {

  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [img, setIMG] = useState('');
  const [editID, setEditID] = useState('');
  const [brandId, setBrandID] = useState('');
  const [removeID, setRemoveID] = useState('');
  const [rows, setRows] = useState([]);

  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [nameDel, setNameDel] = useState('');
  const [isEdit, setIsEdit] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [inputIMGValue, setInputIMGValue] = useState('');
  const [idValue, setIdValue] = useState('');
  const { t, i18n } = useTranslation('common');
  const [options, setOptions] = useState([]); // Options for the Select component
  const [errors, setErrors] = useState({
    name: '',
    imgUrl: '',
  });

  const fetchData = async (id, name) => {
    try {
      const response = await axios.get('http://localhost:7153/api/Companies',
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
  }, []);


  useEffect(() => {
    if (isEdit) {
      setInputValue(name);
      setInputIMGValue(img);
      setIdValue(brandId);
    }
  }, [isEdit, name, brandId, img ]);

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
            onClick={() => handleEdit(row.id,  row.name, row.imgUrl)}
          >
            <i className='tabler-pencil' />
          </IconButton>
          <IconButton
            color={'error'}
            size="small"
            onClick={() => handleDelete(row.id, row.name, row.imgUrl)}
          >
            <i className='tabler-trash' />
          </IconButton>
        </>
      ),
    },
  ];

  const handleEdit = (id, name, imgUrl) => {
    setIsEdit(true);
    setName(name);
    setEditID(id);
    setIMG(imgUrl);
    handleOpen();
  };

  const handleDelete = (id, name) => {
    handleOpenDeleteModal(true);
    setNameDel(name);
    setRemoveID(id);
  };

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
    setIdValue("")
    setInputIMGValue("")
    setIMG("")
    setEditID("");
    setBrandID("");
    setRemoveID("");
    const clearValues = {
      name: '',
      imgUrl: '',
    }
    setErrors(param => ({
      ...param,
      ...clearValues
    }))
  };

  const handleSave = () => {
    event.preventDefault();
    let newErrors = {};

    // Validate required fields
    if (inputValue === '') {
      newErrors.name = 'Name is required';
    }

    if (inputIMGValue === '') {
      newErrors.imgUrl = 'Image Url is required';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      if (isEdit) {
        const params = {
          "id": editID,
          "name": inputValue,
          "imgUrl": inputIMGValue
        }
        const editModel = async () => {
          try {
            const response = await axios.put('http://localhost:7153/api/Companies/Update', params,
              {
                headers: {
                  Authorization: 'Bearer ' + secureLocalStorage.getItem("accessToken"),
                },
              });

          } catch (err) {
            // setErrorClosedTicket(false);
          }
        };

        editModel();
      }
      else {
        const params = {
          "name": inputValue,
          "imgUrl":inputIMGValue

        }
        const createModel = async () => {
          try {
            const response = await axios.post('http://localhost:7153/api/Companies', params,
              {
                headers: {
                  Authorization: 'Bearer ' + secureLocalStorage.getItem("accessToken"),
                },
              });

          } catch (err) {
            // setErrorClosedTicket(false);
          }
        };

        createModel();
      }
      setTimeout(() => { fetchData(); }, 2000)

      handleClose();
    }

  };

  const handleDelClose = () => {
    setOpenDeleteModal(false);
    setNameDel(''); // Reset the input when closing
  };

  const handleDelSave = () => {
    const deleteBrand = async () => {
      try {
        const response = await axios.get('http://localhost:7153/api/Companies/Remove/' + removeID,
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

  const handleChange = (e) => {
    setIdValue(e.target.value);
  };

  return (
    <>
      <Dialog open={open} onClose={handleClose}>
        {isEdit ? <DialogTitle>{t("editCompany")}</DialogTitle> :  <DialogTitle>{t("createNewCompany")}</DialogTitle>}
        <form
          noValidate
          autoComplete="off"
          onSubmit={handleSave}
          className="flex flex-col gap-5"
        >
          <DialogContent>
            <Box display="flex" sx={{ alignItems: 'baseline' }}  gap={2}>
              <TextField
                autoFocus
                margin="dense"
                label={t("name")}
                type="text"
                fullWidth
                value={inputValue}
                error={!!errors.name} // If there's an error, show it
                helperText={t(errors.name)}
                onChange={(e) => setInputValue(e.target.value)}
                sx = {{ flex: 2 }}
              />
              <TextField
                autoFocus
                margin="dense"
                label={t("imgUrl")}
                type="text"
                fullWidth
                value={inputIMGValue}
                error={!!errors.imgUrl} // If there's an error, show it
                helperText={t(errors.imgUrl)}
                onChange={(e) => setInputIMGValue(e.target.value)}
                sx = {{ flex: 2 }}
              />

            </Box>

          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="secondary">
              {t("cancel")}
            </Button>
            <Button onClick={handleSave} color="primary">
              {isEdit ? t("edit") : t("create")}
            </Button>
          </DialogActions>
        </form>

      </Dialog>
      <Dialog open={openDeleteModal} onClose={handleDelClose}>
        <DialogTitle>{t("deleteCompany")}</DialogTitle>
        <DialogContent>
          {i18n.language==='en' ?
            <Typography component='div'>{t('deleteCompanyMsg') }<Box fontWeight='fontWeightBold' display='inline'>{nameDel}</Box>?</Typography>
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
          <Typography variant='h4'>{t("companyOps")}</Typography>
        </Grid>
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
