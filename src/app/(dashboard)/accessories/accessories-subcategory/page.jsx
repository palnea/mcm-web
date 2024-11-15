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
import {
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormHelperText,
  InputLabel,
  Select
} from "@mui/material";
import TextField from "@mui/material/TextField";
import {useTranslation} from "react-i18next";
import secureLocalStorage from "react-secure-storage";
import Box from "@mui/material/Box";
import MenuItem from "@mui/material/MenuItem";
import {toast, ToastContainer} from "react-toastify";


export default function Page() {

  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [editID, setEditID] = useState('');
  const [brandId, setBrandID] = useState('');
  const [removeID, setRemoveID] = useState('');
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);

  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [nameDel, setNameDel] = useState('');
  const [isEdit, setIsEdit] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [idValue, setIdValue] = useState('');
  const { t, i18n } = useTranslation('common');
  const [options, setOptions] = useState([]); // Options for the Select component
  const [errors, setErrors] = useState({
    name: '',
    accessoryCategoryId: '',
  });

  const fetchData = async (id, name) => {
    try {
      const response = await axios.get('http://localhost:7153/api/AccessorySubCategories',
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

  const fetchSelect = async (id, name) => {
    try {
      const response = await axios.get('http://localhost:7153/api/AccessoryCategories',
        {
          headers: {
            Authorization: 'Bearer ' + secureLocalStorage.getItem("accessToken"),
          },
        });
      const optionsData = response.data.data.map(item => ({
        label: item.name,
        value: item.id,
      }));
      setOptions(optionsData);


    } catch (err) {
      // setErrorClosedTicket(false);
    }
  };


  useEffect(() => {
    fetchData();
    fetchSelect();

    // console.log(data)
  }, []);


  useEffect(() => {
    if (isEdit) {
      setInputValue(name);
      setIdValue(brandId);
    }
  }, [isEdit, name, brandId ]);

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
            // startIcon={<i className='tabler-pencil m-0' />}
            onClick={() => handleEdit(row.id,  row.name, row.accessoryCategoryId)}
          >
            <i className='tabler-pencil' />
          </IconButton>



          <IconButton
            color={'error'}
            size="small"
            // startIcon={<i className='tabler-trash' />}
            onClick={() => handleDelete(row.id, row.name, row.accessoryCategoryId)}
          >
            <i className='tabler-trash' />
          </IconButton>
        </>
      ),
    },
  ];

  const handleEdit = (id, name, brandId) => {
    setIsEdit(true);
    setName(name);
    setEditID(id);
    setBrandID(brandId);
    handleOpen();
    //edit logic here
  };


  const handleDelete = (id, name) => {
    handleOpenDeleteModal(true);
    setNameDel(name);
    setRemoveID(id);
    //delete logic here
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
    setEditID("");
    setBrandID("");
    setRemoveID("");
    const clearValues = {
      name: '',
      accessoryCategoryId: '',
    }
    setErrors(param => ({
      ...param,
      ...clearValues
    }))
  };

  const handleSave = () => {
    event.preventDefault();
    let is_successful = false;
    let newErrors = {};

    // Validate required fields
    if (inputValue === '') {
      newErrors.name = 'Name is required';
    }
    if (idValue === '') {
      newErrors.accessoryCategoryId = 'Accessory Category is required';
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      setLoading(true);
      const params = isEdit
        ? {"id": editID, "name": inputValue, "accessoryCategoryId": idValue}
        : {"name": inputValue, "accessoryCategoryId": idValue};

      const saveBrand = async () => {
        try {
          const response = isEdit
            ? await axios.put('http://localhost:7153/api/AccessorySubCategories/Update', params, {
              headers: { Authorization: 'Bearer ' + secureLocalStorage.getItem("accessToken") },
            })
            : await axios.post('http://localhost:7153/api/AccessorySubCategories', params, {
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
          setTimeout(() => toast.success(isEdit ? t('Accessory subcategory updated successfully!') : t('Accessory subcategory created successfully!')), 800);

          setTimeout(fetchData, 500); // Fetch updated data after closing
        }
      });
    }
    // if (Object.keys(newErrors).length === 0) {
    //   if (isEdit) {
    //     const params = {
    //       "id": editID,
    //       "name": inputValue,
    //       "accessoryCategoryId": idValue
    //     }
    //     const editModel = async () => {
    //       try {
    //         const response = await axios.put('http://localhost:7153/api/AccessorySubCategories/Update', params,
    //           {
    //             headers: {
    //               Authorization: 'Bearer ' + secureLocalStorage.getItem("accessToken"),
    //             },
    //           });
    //
    //       } catch (err) {
    //         // setErrorClosedTicket(false);
    //       }
    //     };
    //
    //     editModel();
    //   }
    //   else {
    //     const params = {
    //       "name": inputValue,
    //       "accessoryCategoryId":idValue
    //
    //     }
    //     const createModel = async () => {
    //       try {
    //         const response = await axios.post('http://localhost:7153/api/AccessorySubCategories', params,
    //           {
    //             headers: {
    //               Authorization: 'Bearer ' + secureLocalStorage.getItem("accessToken"),
    //             },
    //           });
    //
    //       } catch (err) {
    //         // setErrorClosedTicket(false);
    //       }
    //     };
    //
    //     createModel();
    //   }
    //   setTimeout(() => { fetchData(); }, 2000)
    //   // if ( 200 <= response.status && response.status < 300){
    //   //   handleClose();
    //   // }
    //   handleClose()
    //
    // }


  };

  const handleDelClose = () => {
    setOpenDeleteModal(false);
    setNameDel(''); // Reset the input when closing
  };

  const handleDelSave = () => {
    let is_successful = false;
    setLoading(true);
    const deleteBrand = async () => {
      try {
        const response = await axios.get('http://localhost:7153/api/AccessorySubCategories/Remove/' + removeID,
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
    deleteBrand().then(() => {
      if (is_successful) {
        setTimeout(() => handleDelClose(), 800);
        setTimeout(() => toast.success(t('Accessory subcategory deleted successfully!')), 800);

        setTimeout(fetchData, 500); // Fetch updated data after closing
      }
    });
  };

  const handleChange = (e) => {
    setIdValue(e.target.value);
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} closeOnClick pauseOnHover />

      <Dialog open={open} onClose={handleClose}>
        {isEdit ? <DialogTitle>{t("editAccessorySubCategory")}</DialogTitle> :  <DialogTitle>{t("createNewAccessorySubCategory")}</DialogTitle>}
        <form
          noValidate
          autoComplete="off"
          onSubmit={handleSave}
          className="flex flex-col gap-5"
        >
          <DialogContent sx={{ minWidth: "500px", maxWidth: "800px" }}>
            <Box display="flex" sx={{ alignItems: 'baseline' }}  gap={2}>
              <TextField
                autoFocus
                margin="dense"
                label={t("name")}
                type="text"
                value={inputValue}
                error={!!errors.name} // If there's an error, show it
                helperText={t(errors.name)} // Display the error message
                onChange={(e) => setInputValue(e.target.value)}
                sx = {{ flex: 1 }}
              />
              <FormControl variant="outlined"  error={!!errors.accessoryCategoryId}   sx={{ flex: 1 }}>
                <InputLabel>{t("selectAccessoryCategory")}</InputLabel>
                <Select
                  margin="dense"
                  fullWidth
                  variant="outlined"
                  className="p-0"
                  value={idValue}
                  label={t("selectAccessoryCategory")}
                  // helperText={t(errors.brandId)} // Display the error message
                  onChange={(e) => handleChange(e)}
                  displayEmpty

                >
                  {options.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText>{t(errors.accessoryCategoryId)}</FormHelperText>
              </FormControl>

            </Box>

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
        <DialogTitle>{t("deleteAccessorySubCategory")}</DialogTitle>
        <DialogContent>
          {i18n.language==='en' ?
            <Typography component='div'>{t('deleteAccessorySubCategoryMessage') }<Box fontWeight='fontWeightBold' display='inline'>{nameDel}</Box>?</Typography>
            : <Typography> <Box fontWeight='fontWeightBold' display='inline'>{nameDel}</Box> {t('deleteAccessorySubCategoryMessage') }</Typography>}

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
          <Typography variant='h4'>{t("accessorySubCategoryOps")}</Typography>
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
