"use client"; // Add this line at the top
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import CustomTable from "../../../../components/Table/CustomTable";
import Card from "@mui/material/Card";
import React, {useEffect, useState} from "react";
import axios from "axios";
import * as https from "https";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  Select,
  Tab,
  Tabs
} from "@mui/material";
import TextField from "@mui/material/TextField";
import {useTranslation} from "react-i18next";
import secureLocalStorage from "react-secure-storage";
import Box from "@mui/material/Box";
import MenuItem from "@mui/material/MenuItem";
import Divider from "@mui/material/Divider";


export default function Page() {

  const [open, setOpen] = useState(false);
  const [removeID, setRemoveID] = useState('');
  const [rows, setRows] = useState([]);
  const [inputValue, setInputValue] = useState('');

  const [params, setParams] = useState({
    "companyId": null,
    "username": "",
    "password": "",
    "name": "",
    "surname": "",
    "title": "",
    "phone": "",
    "groupId": null,
    "photoUrl": "",
    "notificationToken": "",
    "email": "",
  });

  const clearParams = () => {
    let clearValues = {
      "companyId": null,
      "username": "",
      "password": "",
      "name": "",
      "surname": "",
      "title": "",
      "phone": "",
      "groupId": null,
      "photoUrl": "",
      "notificationToken": "",
      "email": "",
    }
    setParams(param => ({
      ...param,
      ...clearValues
    }))
  }

  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [id, setId] = useState('');

  const [nameDel, setNameDel] = useState('');
  const [isEdit, setIsEdit] = useState(false);
  const { t, i18n } = useTranslation('common');
  const [optionsCompany, setOptionsCompany] = useState([]); // Options for the Select component
  const [optionsGroup, setOptionsGroup] = useState([]); // Options for the Select component


  const fetchData = async (id, name) => {
    try {
      const response = await axios.get('http://localhost:7153/api/Users',
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

  const fetchSelectCompany = async (id, name) => {
    try {
      const response = await axios.get('http://localhost:7153/api/Companies',
        {
          headers: {
            Authorization: 'Bearer ' + secureLocalStorage.getItem("accessToken"),
          },
        });
      const optionsData = response.data.data.map(item => ({
        label: item.name,
        value: item.id,
      }));
      setOptionsCompany(optionsData);

    } catch (err) {
      // setErrorClosedTicket(false);
    }
  };

  const fetchSelectGroup = async (id, name) => {
    try {
      const response = await axios.get('http://localhost:7153/api/Groups',
        {
          headers: {
            Authorization: 'Bearer ' + secureLocalStorage.getItem("accessToken"),
          },
        });
      const optionsData = response.data.data.map(item => ({
        label: item.name,
        value: item.id,
      }));
      setOptionsGroup(optionsData);

    } catch (err) {
      // setErrorClosedTicket(false);
    }
  };

  useEffect(() => {
    fetchData();
    fetchSelectCompany();
    fetchSelectGroup();

  }, []);

  const columns = [
    { id: "id", label: "id" },
    { id: "username", label: "username" },
    { id: "email", label: "email" },
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
            onClick={() => handleEdit(row)}
          >
            <i className='tabler-pencil' />
          </IconButton>
          <IconButton
            color={'error'}
            size="small"
            onClick={() => handleDelete(row.id, row.name)}
          >
            <i className='tabler-trash' />
          </IconButton>
        </>
      ),
    },
  ];

  const handleEdit = (row) => {
    setIsEdit(true);
    setParams(row);
    setParams(prevParams => ({
      ...prevParams,
      password: "xyz"
    }));
    removeKeysWithFilter(["companies", "company", "group", "selectedCompanies", "createdDate",  "updatedDate"]);  // Pass an array of keys to remove
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
    clearParams()
  };

  const removeKeysWithFilter = (keysToRemove) => {
    setParams(prevParams =>
      Object.fromEntries(
        Object.entries(prevParams).filter(
          ([key]) => !keysToRemove.includes(key)
        )
      )
    );
  };

  const handleSave = () => {
    if (isEdit) {
      const editUser = async () => {
        try {
          const response = await axios.put('http://localhost:7153/api/Users/Update', params,
            {
              headers: {
                Authorization: 'Bearer ' + secureLocalStorage.getItem("accessToken"),
              },
            });

        } catch (err) {
          // setErrorClosedTicket(false);
        }
      };

      editUser();
    }
    else {
      const createUser = async () => {
        try {
          const response = await axios.post('http://localhost:7153/api/Users', params,
            {
              headers: {
                Authorization: 'Bearer ' + secureLocalStorage.getItem("accessToken"),
              },
            });

        } catch (err) {
          // setErrorClosedTicket(false);
        }
      };

      createUser();
    }
    setTimeout(() => { fetchData(); }, 2000)
    handleClose();
  };

  const handleDelClose = () => {
    setOpenDeleteModal(false);
    setNameDel(''); // Reset the input when closing
  };

  const handleDelSave = () => {
    const deleteUser = async () => {
      try {
        const response = await axios.get('http://localhost:7153/api/Users/Remove/' + removeID,
          {
            headers: {
              Authorization: 'Bearer ' + secureLocalStorage.getItem("accessToken"),
            },
          });

      } catch (err) {
        // setErrorClosedTicket(false);
      }
    };

    deleteUser();
    setTimeout(() => { fetchData(); }, 2000)
    handleDelClose();
  };

  const handleInputChange = (key, value) => {
    if (key === "expiryDate") {
      // Store the date value as full timestamp format
      const fullTimestamp = new Date(value).toISOString().slice(0, -1);  // Adjusted to get a full ISO timestamp
      setParams(prevParams => ({ ...prevParams, [key]: fullTimestamp }));
    } else {
      setParams(prevParams => ({
        ...prevParams,
        [key]: typeof prevParams[key] === "string" ? value  : Number(value),
      }));
    }
  };

  return (
    <>
      <Dialog open={open} onClose={handleClose}>
        {isEdit ? <DialogTitle>{t("editUser")}</DialogTitle> :  <DialogTitle>{t("createNewUser")}</DialogTitle>}

        <DialogContent className={"pt-3"} sx={{ minWidth: "500px", maxWidth: "800px" }}>
              <Grid container spacing={4} >
                { Object.keys(params).map(key => (
                    key === "groupId" ? (
                        <Grid item xs={12} sm={6} key={key}>
                          <FormControl fullWidth variant="outlined">
                            <InputLabel>{t("selectGroup")}</InputLabel>
                            <Select
                              margin="dense"
                              key={key}
                              label={t("selectGroup")}
                              fullWidth
                              variant="outlined"
                              value={params[key] || "" }
                              onChange={(e) => handleInputChange(key, e.target.value)}
                              displayEmpty
                            >
                              {/*<MenuItem value="" disabled>{t("selectGroup")}</MenuItem>*/}
                              {optionsGroup.map(option => (
                                <MenuItem key={option.value} value={option.value}>
                                  {option.label}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>


                        </Grid>

                      ) :
                      key === "companyId" ? (
                          <Grid item xs={12} sm={6} key={key}>
                            <FormControl fullWidth variant="outlined">
                              <InputLabel>{t("selectCompany")}</InputLabel>
                              <Select
                                key={key}
                                fullWidth
                                variant="outlined"
                                label={t("selectCompany")}
                                value={params[key]|| "" }
                                onChange={(e) => handleInputChange(key, e.target.value)}
                                displayEmpty
                              >
                                {/*<MenuItem value="" disabled>{t("selectCompany")}</MenuItem>*/}
                                {optionsCompany.map(option => (
                                  <MenuItem key={option.value} value={option.value}>
                                    {option.label}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                          </Grid>
                        ): (
                          <Grid item xs={12} sm={6} key={key}>
                            { key !== "id" &&
                              <TextField
                                key={key}
                                fullWidth
                                variant="outlined"
                                label={t(key)}
                                type={typeof params[key] === "string" ? "text" : "number"}
                                value={params[key]}
                                onChange={(e) => handleInputChange(key, e.target.value)}
                              />
                            }
                          </Grid>
                        )
                  ))}
              </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            {t("cancel")}
          </Button>
          <Button onClick={handleSave} color="primary">
            {isEdit ? t("edit") : t("create")}
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={openDeleteModal} onClose={handleDelClose}>
        <DialogTitle>{t("deleteUser")}</DialogTitle>
        <DialogContent>
          {i18n.language==='en' ?
            <Typography component='div'>{t('deleteUserMessage') }<Box fontWeight='fontWeightBold' display='inline'>{nameDel}</Box>?</Typography>
            : <Typography> <Box fontWeight='fontWeightBold' display='inline'>{nameDel}</Box> {t('deleteUserMessage') }</Typography>}

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
          <Typography variant='h4'>{t("userOps")}</Typography>
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