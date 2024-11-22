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
import Divider from "@mui/material/Divider";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Page() {

  const [open, setOpen] = useState(false);
  const [editID, setEditID] = useState('');
  const [removeID, setRemoveID] = useState('');
  const [rows, setRows] = useState([]);
  // const [inputValue, setInputValue] = useState('');

  const [errors, setErrors] = useState({
    name: '',
    companyId: '',
    yachtBrandId: '',
    accessoryCategoryId: '',
    accessorySubCategoryId: '',
  });


  const [params, setParams] = useState({
    "name": "",
    "companyId": null,
    "yachtBrandId": null,
    "accessoryCategoryId": null,
    "accessorySubCategoryId": null,
    "description": "",
  });

  const clearParams = () => {
    let clearValues = {
      "name": "",
      "companyId": null,
      "yachtBrandId": null,
      "accessoryCategoryId": null,
      "accessorySubCategoryId": null,
      "description": "",
    }
    setParams(param => ({
      ...param,
      ...clearValues
    }))

    let clearValues2 = {
      name: '',
      companyId: '',
      yachtBrandId: '',
      accessoryCategoryId: '',
      accessorySubCategoryId: '',
    }
    setErrors(param => ({
      ...param,
      ...clearValues2
    }))

  }

  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openNotesModal, setOpenNotesModal] = useState(false);
  const [id, setId] = useState('');

  const [nameDel, setNameDel] = useState('');
  const [isEdit, setIsEdit] = useState(false);
  const { t, i18n } = useTranslation('common');
  const [optionsBrands, setOptionsBrands] = useState([]); // Options for the Select component
  const [optionsCompany, setOptionsCompany] = useState([]); // Options for the Select component
  const [optionsCategory, setOptionsCategory] = useState([]); // Options for the Select component
  const [optionsSubCategory, setOptionsSubCategory] = useState([]); // Options for the Select component
  const [activeTab, setActiveTab] = useState(0);  // 0 for yacht fields tab, 1 for notes tab
  const [notes, setNotes] = useState( []);
  const [loading, setLoading] = useState(false);


  const fetchData = async (id, name) => {
    try {
      const response = await axios.get('http://localhost:7153/api/Accessories',
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

  const fetchSelectBrand = async (id, name) => {
    try {
      const response = await axios.get('http://localhost:7153/api/YachtBrands',
        {
          headers: {
            Authorization: 'Bearer ' + secureLocalStorage.getItem("accessToken"),
          },
        });
      const optionsData = [
        ...response.data.data.map(item => ({
          label: item.name,
          value: item.id,
        })),
        { label: 'Compatible with All', value: -1 }
      ];
      setOptionsBrands(optionsData);

    } catch (err) {
      // setErrorClosedTicket(false);
    }
  };

  const fetchSelectComapny = async (id, name) => {
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

  const fetchSelectAccessoryCategories = async (id, name) => {
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
      setOptionsCategory(optionsData);

    } catch (err) {
      // setErrorClosedTicket(false);
    }
  };

  const fetchSelectAccessorySubCategories = async (value) => {
    try {
      const response = await axios.get('http://localhost:7153/api/AccessorySubCategories/GetByCategoryId/' + value,
        {
          headers: {
            Authorization: 'Bearer ' + secureLocalStorage.getItem("accessToken"),
          },
        });
      const optionsData = response.data.data.map(item => ({
        label: item.name,
        value: item.id,
      }));
      setOptionsSubCategory(optionsData);

    } catch (err) {
      // setErrorClosedTicket(false);
    }
  };

  useEffect(() => {
    fetchData();
    fetchSelectBrand();
    // fetchSelectAccessorySubCategories();
    fetchSelectAccessoryCategories();
    fetchSelectComapny();

  }, []);

  const columns = [
    { id: "id", label: "id" },
    { id: "name", label: "name" },
    { id: "description", label: "description" },
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
            onClick={() => handleDelete(row.id, row.name, row.yachtBrandId)}
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
    removeKeysWithFilter([ "createdDate",  "updatedDate"]);  // Pass an array of keys to remove
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
    removeKeysWithFilter([ "id"]);
    setActiveTab(0);
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

    // Validate required fields
    if (params.name === '') {
      newErrors.name = 'Name is required';
    }

    if (params.companyId === '' || params.companyId === null) {
      newErrors.companyId = 'Company is required';
    }

    if (params.yachtBrandId === '' || params.yachtBrandId === null) {
      newErrors.yachtBrandId = 'Brand is required';
    }

    if (params.accessoryCategoryId === '' || params.accessoryCategoryId === null) {
      newErrors.accessoryCategoryId = 'Accessory Category is required';
    }
    if (params.accessorySubCategoryId === '' || params.accessorySubCategoryId === null) {
      newErrors.accessorySubCategoryId = 'Accessory Sub Category is required';
    }

    setErrors(newErrors);
    let is_successful = false;
    if (Object.keys(newErrors).length === 0) {
      setLoading(true);
      const saveBrand = async () => {
        console.log("saveBrand", params);
        try {
          const response = isEdit
            ? await axios.put('http://localhost:7153/api/Accessories/Update', params, {
              headers: { Authorization: 'Bearer ' + secureLocalStorage.getItem("accessToken") },
            })
            : await axios.post('http://localhost:7153/api/Accessories', params, {
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
          setTimeout(() => toast.success(isEdit ? t('Accessory updated successfully!') : t('Accessory created successfully!')), 800);

          setTimeout(fetchData, 500); // Fetch updated data after closing
        }
      });
    }

    // if (Object.keys(newErrors).length === 0) {
    //   if (isEdit) {
    //     const editModel = async () => {
    //       try {
    //         const response = await axios.put('http://localhost:7153/api/Accessories/Update', params,
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
    //     const createYacht = async () => {
    //       try {
    //         const response = await axios.post('http://localhost:7153/api/Accessories', params,
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
    //     createYacht();
    //   }
    //   setTimeout(() => { fetchData(); }, 2000)
    //
    //   handleClose();
    // }

  };

  const handleDelClose = () => {
    setOpenDeleteModal(false);
    setNameDel(''); // Reset the input when closing
  };


  const handleDelSave = () => {
    setLoading(true);
    let is_successful = false;
    const deleteYacht = async () => {
      try {
        const response = await axios.get('http://localhost:7153/api/Accessories/Remove/' + removeID,
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

    deleteYacht().then(() => {
      if (is_successful) {
        setTimeout(() => handleDelClose(), 800);
        setTimeout(() => toast.success(t('Accessory deleted successfully!')), 800);

        setTimeout(fetchData, 500); // Fetch updated data after closing
      }
    });
  };

  const handleInputChange = (key, value) => {
    if (key === "accessoryCategoryId") {
      fetchSelectAccessorySubCategories(value);

    }

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
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} closeOnClick pauseOnHover />

      <Dialog open={open} onClose={handleClose}>
        {isEdit ? <DialogTitle>{t("editAccessory")}</DialogTitle> :  <DialogTitle>{t("createNewAccessory")}</DialogTitle>}
        <form
          noValidate
          autoComplete="off"
          onSubmit={handleSave}
          className="flex flex-col gap-5"
        >
          <DialogContent className={"pt-3"} sx={{ minWidth: "500px", maxWidth: "800px" }}>

              <Grid container spacing={4} >
                { Object.keys(params).map(key => (
                  key === "yachtBrandId" ? (
                      <Grid item xs={12} sm={6} key={key}>
                        <FormControl fullWidth variant="outlined" error={!!errors[key]}  >
                          <InputLabel>{t("selectBrand")}</InputLabel>
                          <Select
                            margin="dense"
                            key={key}
                            fullWidth
                            label={t("selectBrand")}
                            variant="outlined"
                            value={params[key] || "" }
                            onChange={(e) => handleInputChange(key, e.target.value)}
                            displayEmpty
                          >
                            {/*<MenuItem value="" disabled>{t("selectBrand")}</MenuItem>*/}
                            {optionsBrands.map(option => (
                              <MenuItem key={option.value} value={option.value}>
                                {option.label}
                              </MenuItem>
                            ))}
                          </Select>
                          <FormHelperText>{t(errors[key])}</FormHelperText>
                        </FormControl>


                      </Grid>

                    ) :
                    key === "companyId" ? (
                        <Grid item xs={12} sm={6} key={key}>
                          <FormControl fullWidth variant="outlined" error={!!errors[key]}>
                            <InputLabel>{t("selectCompany")}</InputLabel>
                            <Select
                              key={key}
                              fullWidth
                              variant="outlined"
                              value={params[key]|| "" }
                              label={t("selectCompany")}
                              onChange={(e) => handleInputChange(key, e.target.value)}
                              displayEmpty
                            >
                              {/*<MenuItem value="" disabled>{t("selectModel")}</MenuItem>*/}
                              {optionsCompany.map(option => (
                                <MenuItem key={option.value} value={option.value}>
                                  {option.label}
                                </MenuItem>
                              ))}
                            </Select>
                            <FormHelperText>{t(errors[key])}</FormHelperText>
                          </FormControl>

                        </Grid>

                      ):
                      key === "accessoryCategoryId" ? (
                        <Grid item xs={12} sm={6} key={key}>
                          <FormControl fullWidth variant="outlined" error={!!errors[key]}>
                            <InputLabel>{t("selectAccessoryCategory")}</InputLabel>
                            <Select
                              key={key}
                              fullWidth
                              label={t("selectAccessoryCategory")}
                              variant="outlined"
                              value={params[key]|| "" }
                              onChange={(e) => handleInputChange(key, e.target.value)}
                              displayEmpty

                            >
                              {/*<MenuItem value="" disabled>{t("selectUsers")}</MenuItem>*/}
                              {optionsCategory.map(option => (
                                <MenuItem key={option.value} value={option.value}>
                                  {option.label}
                                </MenuItem>
                              ))}
                            </Select>
                            <FormHelperText>{t(errors[key])}</FormHelperText>
                          </FormControl>

                        </Grid>

                      ) : key === "accessorySubCategoryId" ? (
                          <Grid item xs={12} sm={6} key={key}>
                            <FormControl fullWidth variant="outlined" error={!!errors[key]}>
                              <InputLabel>{t("selectAccessorySubCategory")}</InputLabel>
                              <Select
                                key={key}
                                fullWidth
                                label={t("selectAccessorySubCategory")}
                                variant="outlined"
                                value={params[key]|| "" }
                                onChange={(e) => handleInputChange(key, e.target.value)}
                                displayEmpty
                                disabled={params.accessoryCategoryId === null}
                              >
                                {/*<MenuItem value="" disabled>{t("selectUsers")}</MenuItem>*/}
                                {optionsSubCategory.map(option => (
                                  <MenuItem key={option.value} value={option.value}>
                                    {option.label}
                                  </MenuItem>
                                ))}
                              </Select>
                              <FormHelperText>{t(errors[key])}</FormHelperText>
                            </FormControl>

                          </Grid>

                        ) : (
                        <Grid item xs={12} sm={6} key={key}>
                          {key === "expiryDate"  ?
                            <TextField
                              key={key}
                              fullWidth
                              type="date"  // Setting type to "date"
                              InputLabelProps={{ shrink: true }}
                              value={params[key].slice(0, 10)}  // Format date for display
                              variant="outlined"
                              label={t(key)}
                              onChange={(e) => handleInputChange(key, e.target.value)}
                            />
                            : key !== "id" &&
                            <TextField
                              key={key}
                              fullWidth
                              variant="outlined"
                              label={t(key)}
                              multiline  // Makes the field a textarea
                              rows={key === "description" ? 4 : 1}
                              type={typeof params[key] === "string" ? "text" : "number"}
                              value={params[key]}
                              error={key === "name" ? !!errors[key]: false} // If there's an error, show it
                              helperText={t(errors[key])} // Display the error message
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
        <DialogTitle>{t("deleteAccessory")}</DialogTitle>
        <DialogContent>
          {i18n.language==='en' ?
            <Typography component='div'>{t('deleteAccessoryMessage') }<Box fontWeight='fontWeightBold' display='inline'>{nameDel}</Box>?</Typography>
            : <Typography> <Box fontWeight='fontWeightBold' display='inline'>{nameDel}</Box> {t('deleteAccessoryMessage') }</Typography>}

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
          <Typography variant='h4'>{t("accessoryOps")}</Typography>
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
