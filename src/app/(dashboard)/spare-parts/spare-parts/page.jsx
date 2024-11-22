"use client"; // Add this line at the top
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import FormLayout from '@components/form/FormLayout'
import CustomTable from "../../../../components/Table/CustomTable";
import Card from "@mui/material/Card";
import React, {useEffect, useState} from "react";
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
import api from '../../../../api_helper/api';

import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Page() {

  const [open, setOpen] = useState(false);
  const [editID, setEditID] = useState('');
  const [removeID, setRemoveID] = useState('');
  const [rows, setRows] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);

  const [params, setParams] = useState({
    "name": "",
    "companyId": null,
    "yachtBrandId": null,
    "sparePartCategoryId": null,
    "description": "",
  });

  const [errors, setErrors] = useState({
    name: '',
    companyId: '',
    yachtBrandId: '',
    sparePartCategoryId: '',
  });

  const [partErrors, setPartErrors] = useState({
    name: '',
  });

  const clearParams = () => {
    let clearValues = {
      "name": "",
      "description": "",
      "companyId": null,
      "yachtBrandId": null,
      "sparePartCategoryId": null,
    }
    setParams(param => ({
      ...param,
      ...clearValues
    }))

     let clearValues2 = {
       name: '',
       companyId: '',
       yachtBrandId: '',
       sparePartCategoryId: '',
    }
    setErrors(param => ({
      ...param,
      ...clearValues2
    }))
  }

  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openPartCodeModal, setOpenPartCodeModal] = useState(false);
  const [id, setId] = useState('');

  const [nameDel, setNameDel] = useState('');
  const [isEdit, setIsEdit] = useState(false);
  const { t, i18n } = useTranslation('common');
  const [optionsBrands, setOptionsBrands] = useState([]); // Options for the Select component
  const [optionsSparePartCategories, setOptionsSparePartCategories] = useState([]); // Options for the Select component
  const [optionsCompanies, setOptionsCompanies] = useState([]); // Options for the Select component
  const [activeTab, setActiveTab] = useState(0);  // 0 for yacht fields tab, 1 for PartCodes tab
  const [PartCodes, setPartCodes] = useState( []);
  const [PartCodesLoad, setPartCodesLoad] = useState( []);
  const [PartCodesLoadEdit, setPartCodesLoadEdit] = useState( []);


  const fetchData = async (id, name) => {
    try {
      const response = await api.get('/SpareParts/GetAllWithDetails');
      setRows(response.data.data);


    } catch (err) {
      // setErrorClosedTicket(false);
    }
  };

  const fetchSelectBrand = async (id, name) => {
    try {
      const response = await api.get('/YachtBrands');
      const optionsData = response.data.data.map(item => ({
        label: item.name,
        value: item.id,
      }));
      setOptionsBrands(optionsData);


    } catch (err) {
      // setErrorClosedTicket(false);
    }
  };

  const fetchSelectCompany = async (id, name) => {
    try {
      const response = await api.get('/Companies');
      const optionsData = response.data.data.map(item => ({
        label: item.name,
        value: item.id,
      }));
      setOptionsCompanies(optionsData);


    } catch (err) {
      // setErrorClosedTicket(false);
    }
  };

  const fetchSelectSparePartCategory = async (id, name) => {
    try {
      const response = await api.get('/SparePartCategories');
      const optionsData = response.data.data.map(item => ({
        label: item.name,
        value: item.id,
      }));
      setOptionsSparePartCategories(optionsData);


    } catch (err) {
      // setErrorClosedTicket(false);
    }
  };

  const getPartCodeByID = async (id) => {
    try {
      const response = await api.get('/SparePartCodes/GetBySparePartId/' + id);

      // console.log(response.data.data);

      setPartCodes(response.data.data);


    } catch (err) {
      // setErrorClosedTicket(false);
    }
  };

  useEffect(() => {
    fetchData();
    fetchSelectBrand();
    fetchSelectCompany();
    fetchSelectSparePartCategory();

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
          <IconButton
            size="small"
            color={'secondary'}
            onClick={() => handlePartCode(row.id)}
          >
            <i className='tabler-tool' />
          </IconButton>
        </>
      ),
    },
  ];

  const handleEdit = (row) => {
    setIsEdit(true);
    setParams(row);
    getPartCodeByID(row.id);
    removeKeysWithFilter([ "sparePartCodes", "createdDate",  "updatedDate"]);  // Pass an array of keys to remove
    handleOpen();
  };

  const handleDelete = (id, name) => {
    handleOpenDeleteModal(true);
    setNameDel(name);
    setRemoveID(id);
  };

  const handlePartCode = (id) => {
    handleOpenPartCodeModal(true);
    setId(id);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleOpenDeleteModal = () => {
    setOpenDeleteModal(true);
  };

  const handleOpenPartCodeModal = () => {
    setOpenPartCodeModal(true);
  };
  const handleClose = () => {
    setOpen(false);
    setIsEdit(false);
    setInputValue(''); // Reset the input when closing
    setActiveTab(0);
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

    if (params.companyId === '' || params.companyId === null) {
      newErrors.companyId = 'Company is required';
    }

    if (params.yachtBrandId === '' || params.yachtBrandId === null) {
      newErrors.yachtBrandId = 'Brand is required';
    }

    if (params.sparePartCategoryId === '' || params.sparePartCategoryId === null) {
      newErrors.sparePartCategoryId = 'Spare part category is required';
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      setLoading(true);
      const saveBrand = async () => {
        try {
          const response = isEdit
            ? await api.put('/SpareParts/Update', params)
            : await api.post('/SpareParts', params);

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
          setTimeout(() => toast.success(isEdit ? t('Spare Part updated successfully!') : t('Spare Part created successfully!')), 800);

          setTimeout(fetchData, 500); // Fetch updated data after closing
        }
      });
    }
    // if (Object.keys(newErrors).length === 0) {
    //   if (isEdit) {
    //     const editModel = async () => {
    //       try {
    //         const response = await api.put('/SpareParts/Update', params,
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
    //     const createSparePart = async () => {
    //       try {
    //         const response = await api.post('/SpareParts', params,
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
    //     createSparePart();
    //   }
    //   setTimeout(() => { fetchData(); }, 2000)
    //
    //   handleClose();
    // }

  };

  const handlePartCodesSave = () => {
    event.preventDefault();
    let newErrors = {};
    let is_successful = false;
    // Validate required fields
    if (inputValue === '') {
      newErrors.name = 'Name is required';
    }

    setPartErrors(newErrors);

    // if (Object.keys(newErrors).length === 0) {
    //   const createPartCode = async () => {
    //     const partCodes = {
    //       "name": inputValue,
    //       "sparePartId": id
    //     }
    //     try {
    //       const response = await api.post('/SparePartCodes', partCodes,
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
    //   createPartCode();
    //   setTimeout(() => { fetchData(); }, 2000)
    //   handlePartCodeClose();
    // }
    if (Object.keys(newErrors).length === 0) {
      setLoading(true);
      const partCodes = {
          "name": inputValue,
          "sparePartId": id
        }

      const saveBrand = async () => {
        try {
          const response = await api.post('/SparePartCodes', partCodes);

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
          setTimeout(() => handlePartCodeClose(), 800);
          setTimeout(() => toast.success(t('Spare Part Code created successfully!')), 800);

          setTimeout(fetchData, 500); // Fetch updated data after closing
        }
      });
    }
  };

  const handleDelClose = () => {
    setOpenDeleteModal(false);
    setNameDel(''); // Reset the input when closing
  };

  const handlePartCodeClose = () => {
    setOpenPartCodeModal(false);
    setInputValue("");
  };

  const handleDelSave = () => {
    setLoading(true);
    let is_successful = false;
    const deleteSparePart = async () => {
      try {
        const response = await api.get('/SpareParts/Remove/' + removeID);
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
    deleteSparePart().then(() => {
      if (is_successful) {
        setTimeout(() => handleDelClose(), 800);
        setTimeout(() => toast.success(t('Spare Part deleted successfully!')), 800);

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
      setParams(prevParams => ({
        ...prevParams,
        [key]: typeof prevParams[key] === "string" ? value  : Number(value),
      }));
    }
  };

  const handleTabChange = (event, newTab) => {
    setActiveTab(newTab);
  };

  const handlePartCodeChange = (index, newName) => {
    const updatedPartCodes = [...PartCodes];
    updatedPartCodes[index].name = newName;  // Update the specific PartCode's name
    setPartCodes(updatedPartCodes);

  };

  const handleDeletePartCode = (partCode_id) => {
    setPartCodesLoad({ ...PartCodesLoad, [partCode_id]: true });
    let is_successful = false;
    const deletePartCode = async () => {
      try {
        const response = await api.get('/SparePartCodes/Remove/' + partCode_id);
        if (response.status >= 200 && response.status < 300) {
          is_successful = true;
        }

      } catch (err) {
        console.error("Error:", err);
        // toast.error(t("An error occurred. Please try again."));
      }finally {
        setTimeout(() => setPartCodesLoad({ ...PartCodesLoad, [partCode_id]: false }), 800);
      }
    };
    deletePartCode().then(() => {
      if (is_successful) {
        // setTimeout(() => toast.success(t('Accessory category deleted successfully!')), 800);

        setTimeout( () => { getPartCodeByID(id); }, 500); // Fetch updated data after closing
      }
    });
    // deletePartCode();
    // setTimeout(() => { getPartCodeByID(id); }, 2000)

  };

  const handleUpdatePartCode = (PartCode_id) => {
    setPartCodesLoadEdit({ ...PartCodesLoad, [PartCode_id]: true });
    let is_successful = false;
    for (let i = 0; i < PartCodes.length; i++) {
      if (PartCodes[i].id === PartCode_id) {
        const param = {
          "id": PartCodes[i].id,
          "name": PartCodes[i].name,
          "sparePartId": PartCodes[i].sparePartId
        }
        const updatePartCode = async () => {
          try {
            const response = await api.put('/SparePartCodes/Update', param);
            if (response.status >= 200 && response.status < 300) {
              is_successful = true;
            }

          } catch (err) {
            console.error("Error:", err);
            // toast.error(t("An error occurred. Please try again."));
          }finally {
            setTimeout(() => setPartCodesLoadEdit({ ...PartCodesLoad, [PartCode_id]: false }), 800);
          }
        };
        updatePartCode().then(() => {
          if (is_successful) {
            // setTimeout(() => toast.success(t('Accessory category deleted successfully!')), 800);
            setTimeout( () => { getPartCodeByID(id); }, 500); // Fetch updated data after closing
          }
        });
      }
    }

  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} closeOnClick pauseOnHover />

      <Dialog open={open} onClose={handleClose}>
        {isEdit ? <DialogTitle>{t("editSparePart")}</DialogTitle> :  <DialogTitle>{t("createNewSparePart")}</DialogTitle>}

        <form
          noValidate
          autoComplete="off"
          onSubmit={handleSave}
          className="flex flex-col gap-5"
        >
          <DialogContent className={"pt-3"} sx={{ minWidth: "500px", maxWidth: "800px" }}>
            {isEdit &&
              <Box className={"mb-3"}>
                <Grid container spacing={4} >
                  <Tabs value={activeTab} onChange={handleTabChange}>
                    <Tab label={t("spareParts")} />
                    <Tab label={t("partCodes")} />
                  </Tabs>
                </Grid>
              </Box>
            }
            {activeTab === 0   &&
              <Grid container spacing={4} >
                { Object.keys(params).map(key => (
                  key === "yachtBrandId" ? (
                      <Grid item xs={12} sm={6} key={key}>
                        <FormControl fullWidth variant="outlined" error={!!errors[key]}>
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
                    key === "sparePartCategoryId" ? (
                        <Grid item xs={12} sm={6} key={key}>
                          <FormControl fullWidth variant="outlined" error={!!errors[key]}>
                            <InputLabel>{t("selectSparePartCategory")}</InputLabel>
                            <Select
                              key={key}
                              fullWidth
                              label={t("selectSparePartCategory")}
                              variant="outlined"
                              value={params[key]|| "" }
                              onChange={(e) => handleInputChange(key, e.target.value)}
                              displayEmpty
                            >
                              {/*<MenuItem value="" disabled>{t("selectSparePartCategory")}</MenuItem>*/}
                              {optionsSparePartCategories.map(option => (
                                <MenuItem key={option.value} value={option.value}>
                                  {option.label}
                                </MenuItem>
                              ))}
                            </Select>
                            <FormHelperText>{t(errors[key])}</FormHelperText>
                          </FormControl>
                        </Grid>
                      ):
                      key === "companyId" ? (
                        <Grid item xs={12} sm={6} key={key}>
                          <FormControl fullWidth variant="outlined" error={!!errors[key]}>
                            <InputLabel>{t("selectCompany")}</InputLabel>
                            <Select
                              key={key}
                              fullWidth
                              label={t("selectCompany")}
                              variant="outlined"
                              value={params[key]|| "" }
                              onChange={(e) => handleInputChange(key, e.target.value)}
                              displayEmpty
                            >
                              {/*<MenuItem value="" disabled>{t("selectCompany")}</MenuItem>*/}
                              {optionsCompanies.map(option => (
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
                          {key === "description"  ?
                            <TextField
                              key={key}
                              fullWidth
                              multiline  // Makes the field a textarea
                              rows={4}  // Adjusts the number of visible rows (height)
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
            }

            {activeTab === 1 &&
              PartCodes && PartCodes.map((PartCode, index) => (
                <div>
                  <Divider flexItem={true}/>
                  <Box className={"mb-3 flex"} sx={{ alignItems: 'flex-end' , justifyContent: "space-between"}}>
                    <Grid item xs={10} sm={6} key={index} className={"me-8"}>
                      <TextField
                        variant="outlined"
                        // label={`PartCode ${index + 1} Name`}
                        label={t("partCodeName")}
                        value={PartCode.name}
                        className={"ms-2 mt-4"}
                        onChange={(e) => handlePartCodeChange(index, e.target.value)}

                      />

                    </Grid>
                    <Grid item xs={4} sm={6} key={index + "buttonsUpdate"} className={"ms-8"}>
                      <Button onClick={(e) => handleUpdatePartCode(PartCode.id)} color="success" key={index + "update"}>
                        {PartCodesLoadEdit[PartCode.id] ? <CircularProgress size={24} /> : t("update")}
                      </Button>
                      <Button onClick={(e) => handleDeletePartCode(PartCode.id)} color="error" key={index + "delete"}>
                        {PartCodesLoad[PartCode.id] ? <CircularProgress size={24} /> : t("delete")}

                      </Button>
                    </Grid>
                  </Box>
                  <Divider flexItem={true}/>
                </div>
              ))
            }
            {PartCodes && PartCodes.length === 0 && activeTab === 1 &&
              <div>
                <Box className={"mb-3 flex"} sx={{ alignItems: 'flex-end' , justifyContent: "space-between"}}>
                  <Grid item xs={10} sm={6} className={"me-8"}>
                    <Typography>{t('thereAreNoPartCode')}</Typography>


                  </Grid>
                </Box>
              </div>
            }
          </DialogContent>

          {activeTab === 0 &&
            <DialogActions>
              <Button onClick={handleClose} color="secondary">
                {t("cancel")}
              </Button>
              <Button onClick={handleSave} color="primary">
                {loading ? <CircularProgress size={24} />
                  : isEdit ? t("edit") : t("create")}
              </Button>
            </DialogActions>
          }
        </form>


      </Dialog>
      <Dialog open={openDeleteModal} onClose={handleDelClose}>
        <DialogTitle>{t("deleteSparePart")}</DialogTitle>
        <DialogContent>
          {i18n.language==='en' ?
            <Typography component='div'>{t('deleteSparePartMessage') }<Box fontWeight='fontWeightBold' display='inline'>{nameDel}</Box>?</Typography>
            : <Typography> <Box fontWeight='fontWeightBold' display='inline'>{nameDel}</Box> {t('deleteSparePartMessage') }</Typography>}

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
      <Dialog open={openPartCodeModal} onClose={handlePartCodeClose} fullWidth>
        <DialogTitle>{t("createPartCode")}</DialogTitle>
        <form
          noValidate
          autoComplete="off"
          onSubmit={handlePartCodesSave}
          className="flex flex-col gap-5"
        >
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label={t("name")}
              type="text"
              fullWidth
              error={!!partErrors.name} // If there's an error, show it
              helperText={t(partErrors.name)} // Display the error message
              variant="outlined"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handlePartCodeClose} color="secondary">
              {t("cancel")}
            </Button>
            <Button onClick={handlePartCodesSave} color="primary">
              {loading ? <CircularProgress size={24} /> : t("create")}
              {/*{t("create")}*/}
            </Button>
          </DialogActions>
        </form>

      </Dialog>
      <Grid container spacing={6}>
        <Grid item xs={12} sm={6} md={6} lg={6}>
          <Typography variant='h4'>{t("sparePartOps")}</Typography>
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
