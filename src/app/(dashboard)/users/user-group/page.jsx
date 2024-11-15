"use client"; // Add this line at the top
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import FormLayout from '@components/form/FormLayout'
import CustomTable from "../../../../components/Table/CustomTable";
import Card from "@mui/material/Card";
import React, {useEffect, useState} from "react";
import axios from "axios";
import * as https from "https";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import {
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl, FormHelperText,
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
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Page() {

  const [open, setOpen] = useState(false);
  const [removeID, setRemoveID] = useState('');
  const [rows, setRows] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);

  const [errors, setErrors] = useState({
    name: "",
    isOpenTicket: "",
    isCloseTicket:"",
    isAssignOwn: "",
    isAssignAnyone: "",
    isAddProcess:"" ,
    isTransferAssign:"" ,
    isManageInventory: "",
    isManagePart: "",
    isManageUser: "",
    isManageGroup: "",
    isManageFault: "",
    isAcceptProcess: ""
  });

  const [params, setParams] = useState({
    "name": "",
    "isOpenTicket": false,
    "isCloseTicket": false,
    "isAssignOwn": false,
    "isAssignAnyone": false,
    "isAddProcess": false,
    "isTransferAssign": false,
    "isManageInventory": false,
    "isManagePart": false,
    "isManageUser": false,
    "isManageGroup": false,
    "isManageFault": false,
    "isAcceptProcess": false
  });

  const clearParams = () => {
    let clearValues = {
      "name": "",
      "isOpenTicket": false,
      "isCloseTicket": false,
      "isAssignOwn": false,
      "isAssignAnyone": false,
      "isAddProcess": false,
      "isTransferAssign": false,
      "isManageInventory": false,
      "isManagePart": false,
      "isManageUser": false,
      "isManageGroup": false,
      "isManageFault": false,
      "isAcceptProcess": false
    }
    setParams(param => ({
      ...param,
      ...clearValues
    }))

    let clearValues2 = {
      name: "",
      isOpenTicket: "",
      isCloseTicket:"",
      isAssignOwn: "",
      isAssignAnyone: "",
      isAddProcess:"" ,
      isTransferAssign:"" ,
      isManageInventory: "",
      isManagePart: "",
      isManageUser: "",
      isManageGroup: "",
      isManageFault: "",
      isAcceptProcess: ""
    }
    setErrors(param => ({
      ...param,
      ...clearValues2
    }))
  }

  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [id, setId] = useState('');

  const [nameDel, setNameDel] = useState('');
  const [isEdit, setIsEdit] = useState(false);
  const { t, i18n } = useTranslation('common');

  const fetchData = async (id, name) => {
    try {
      const response = await axios.get('http://localhost:7153/api/Groups',
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
      disableSorting: true,
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
    removeKeysWithFilter(["createdDate",  "updatedDate"]);  // Pass an array of keys to remove
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
    removeKeysWithFilter([ "id"]);
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
    event.preventDefault();
    let newErrors = {};
    let is_successful = false;
    // Validate required fields
    if (params.name === '') {
      newErrors.name = 'Name is required';
    }

    if (params.isOpenTicket === '' || params.isOpenTicket === null) {
      newErrors.isOpenTicket = 'isOpenTicket is required';
    }

    if (params.isCloseTicket === '' || params.isCloseTicket === null) {
      newErrors.isCloseTicket = 'isCloseTicket is required';
    }

    if (params.isAssignOwn === '' || params.isAssignOwn === null) {
      newErrors.isAssignOwn = 'isAssignOwn is required';
    }

    if (params.isAssignAnyone === '' || params.isAssignAnyone === null) {
      newErrors.isAssignAnyone = 'isAssignAnyone is required';
    }

    if (params.isAddProcess === '' || params.isAddProcess === null) {
      newErrors.isAddProcess = 'isAddProcess is required';
    }

    if (params.isTransferAssign === '' || params.isTransferAssign === null) {
      newErrors.isTransferAssign = 'isTransferAssign is required';
    }

    if (params.isManageInventory === '' || params.isManageInventory === null) {
      newErrors.isManageInventory = 'isManageInventory is required';
    }

    if (params.isManagePart === '' || params.isManagePart === null) {
      newErrors.isManagePart = 'isManagePart is required';
    }

    if (params.isManageUser === '' || params.isManageUser === null) {
      newErrors.isManageUser = 'isManageUser is required';
    }

    if (params.isManageGroup === '' || params.isManageGroup === null) {
      newErrors.isManageGroup = 'isManageGroup is required';
    }

    if (params.isManageFault === '' || params.isManageFault === null) {
      newErrors.isManageFault = 'isManageFault is required';
    }

    if (params.isAcceptProcess === '' || params.isAcceptProcess === null) {
      newErrors.isAcceptProcess = 'isAcceptProcess is required';
    }


    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      // if (isEdit) {
      //   const editGroup = async () => {
      //     try {
      //       const response = await axios.put('http://localhost:7153/api/Groups/Update', params,
      //         {
      //           headers: {
      //             Authorization: 'Bearer ' + secureLocalStorage.getItem("accessToken"),
      //           },
      //         });
      //
      //     } catch (err) {
      //       // setErrorClosedTicket(false);
      //     }
      //   };
      //
      //   editGroup();
      // }
      // else {
      //   const createGroup = async () => {
      //     try {
      //       const response = await axios.post('http://localhost:7153/api/Groups', params,
      //         {
      //           headers: {
      //             Authorization: 'Bearer ' + secureLocalStorage.getItem("accessToken"),
      //           },
      //         });
      //
      //     } catch (err) {
      //       // setErrorClosedTicket(false);
      //     }
      //   };
      //
      //   createGroup();
      // }
      // setTimeout(() => { fetchData(); }, 2000)
      // handleClose();
      setLoading(true);
      const saveBrand = async () => {
        try {
          const response = isEdit
            ? await axios.put('http://localhost:7153/api/Groups/Update', params, {
              headers: { Authorization: 'Bearer ' + secureLocalStorage.getItem("accessToken") },
            })
            : await axios.post('http://localhost:7153/api/Groups', params, {
              headers: { Authorization: 'Bearer ' + secureLocalStorage.getItem("accessToken") },
            });

          if (response.status >= 200 && response.status < 300) {
            is_successful = true;
          }
        } catch (err) {
          console.error("Error:", err);
          toast.error(t("An error occurred. Please try again."));
        } finally {
          setTimeout(() => setLoading(false), 800);
        }
      };
      saveBrand().then(() => {
        if (is_successful) {
          setTimeout(() => handleClose(), 800);
          setTimeout(() => toast.success(isEdit ? t('User group updated successfully!') : t('User group created successfully!')), 800);

          setTimeout(fetchData, 500); // Fetch updated data after closing
        }
      });
    }

  };

  const handleDelClose = () => {
    setOpenDeleteModal(false);
    handleClose();
    setNameDel(''); // Reset the input when closing
  };

  const handleDelSave = () => {
    setLoading(true);
    let is_successful = false;
    const deleteUser = async () => {
      try {
        const response = await axios.get('http://localhost:7153/api/Groups/Remove/' + removeID,
          {
            headers: {
              Authorization: 'Bearer ' + secureLocalStorage.getItem("accessToken"),
            },
          });
        if (response.status >= 200 && response.status < 300) {
          is_successful = true;
        }

      } catch (err) {
        console.error("Error:", err);
        toast.error(t("An error occurred. Please try again."));
      }finally {
        setTimeout(() => setLoading(false), 800);
      }
    };
    deleteUser().then(() => {
      if (is_successful) {
        setTimeout(() => handleDelClose(), 800);
        setTimeout(() => toast.success(t('User group deleted successfully!')), 800);

        setTimeout(fetchData, 500); // Fetch updated data after closing
      }
    });
  };

  const handleInputChange = (key, value) => {
    if (key === "expiryDate") {
      // Store the date value as full timestamp format
      const fullTimestamp = new Date(value).toISOString().slice(0, -1);  // Adjusted to get a full ISO timestamp
      setParams(prevParams => ({ ...prevParams, [key]: fullTimestamp }));
    } else {
      setParams(prevParams => ({ ...prevParams, [key]: value }));

    }
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} closeOnClick pauseOnHover />

      <Dialog open={open} onClose={handleClose}>
        {isEdit ? <DialogTitle>{t("editUserGroup")}</DialogTitle> :  <DialogTitle>{t("createNewUserGroup")}</DialogTitle>}
        <form
          noValidate
          autoComplete="off"
          onSubmit={handleSave}
          className="flex flex-col gap-5"
        >
          <DialogContent className={"pt-3"} sx={{ minWidth: "500px", maxWidth: "800px" }}>
            <Grid container spacing={4} >
              { Object.keys(params).map(key => (
                key !== "name"  && key !== "id" ? (
                  <Grid item xs={12} sm={6} key={key}>
                    <FormControl fullWidth variant="outlined" error={!!errors[key]}>
                      <InputLabel>{t(key)}</InputLabel>
                      <Select
                        margin="dense"
                        key={key}
                        label={t(key)}
                        fullWidth
                        variant="outlined"
                        value={params[key]}
                        onChange={(e) => handleInputChange(key, e.target.value)}
                        displayEmpty
                      >
                        {/*<MenuItem value="" disabled>{t("select"+key)}</MenuItem>*/}
                        <MenuItem value="true">{t("True")}</MenuItem>
                        <MenuItem value="false">{t("False")}</MenuItem>
                      </Select>
                      <FormHelperText>{t(errors[key])}</FormHelperText>
                    </FormControl>

                  </Grid>

                ) :  key !== "id" && (
                  <Grid item xs={12} sm={6} key={key}>
                    { key !== "id" &&
                      <TextField
                        key={key}
                        fullWidth
                        variant="outlined"
                        label={t(key)}
                        error={!!errors[key]}
                        helperText={t(errors[key])}
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
              {loading ? <CircularProgress size={24} />
                : isEdit ? t("edit") : t("create")}
            </Button>
          </DialogActions>
        </form>

      </Dialog>
      <Dialog open={openDeleteModal} onClose={handleDelClose}>
        <DialogTitle>{t("deleteUserGroup")}</DialogTitle>
        <DialogContent>
          {i18n.language==='en' ?
            <Typography component='div'>{t('deleteUserGroupMessage') }<Box fontWeight='fontWeightBold' display='inline'>{nameDel}</Box>?</Typography>
            : <Typography> <Box fontWeight='fontWeightBold' display='inline'>{nameDel}</Box> {t('deleteUserGroupMessage') }</Typography>}

        </DialogContent>
        <DialogActions>
          <Button onClick={handleDelClose} color="secondary">
            {t("cancel")}
          </Button>
          <Button onClick={handleDelSave} color="primary">
            {loading ? <CircularProgress size={24} /> : t("delete")}
          </Button>
        </DialogActions>
      </Dialog>
      <Grid container spacing={6}>
        <Grid item xs={12} sm={6} md={6} lg={6}>
          <Typography variant='h4'>{t("userGroupOps")}</Typography>
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
