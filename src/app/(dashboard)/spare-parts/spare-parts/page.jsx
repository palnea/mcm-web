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
  const [editID, setEditID] = useState('');
  const [removeID, setRemoveID] = useState('');
  const [rows, setRows] = useState([]);
  const [inputValue, setInputValue] = useState('');

  const [params, setParams] = useState({
    "name": "",
    "description": "",
    "companyId": null,
    "yachtBrandId": null,
    "sparePartCategoryId": null,
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

  const fetchData = async (id, name) => {
    try {
      const response = await axios.get('http://localhost:7153/api/SpareParts',
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
      setOptionsCompanies(optionsData);


    } catch (err) {
      // setErrorClosedTicket(false);
    }
  };

  const fetchSelectSparePartCategory = async (id, name) => {
    try {
      const response = await axios.get('http://localhost:7153/api/SparePartCategories',
        {
          headers: {
            Authorization: 'Bearer ' + secureLocalStorage.getItem("accessToken"),
          },
        });
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
      const response = await axios.get('http://localhost:7153/api/SparePartCodes/GetBySparePartId/' + id,
        {
          headers: {
            Authorization: 'Bearer ' + secureLocalStorage.getItem("accessToken"),
          },
        });

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
      const editModel = async () => {
        try {
          const response = await axios.put('http://localhost:7153/api/SpareParts/Update', params,
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
      const createSparePart = async () => {
        try {
          const response = await axios.post('http://localhost:7153/api/SpareParts', params,
            {
              headers: {
                Authorization: 'Bearer ' + secureLocalStorage.getItem("accessToken"),
              },
            });

        } catch (err) {
          // setErrorClosedTicket(false);
        }
      };

      createSparePart();
    }
    setTimeout(() => { fetchData(); }, 2000)

    handleClose();
  };

  const handlePartCodesSave = () => {
    const createPartCode = async () => {
      const partCodes = {
        "name": inputValue,
        "sparePartId": id
      }
      try {
        const response = await axios.post('http://localhost:7153/api/SparePartCodes', partCodes,
          {
            headers: {
              Authorization: 'Bearer ' + secureLocalStorage.getItem("accessToken"),
            },
          });

      } catch (err) {
        // setErrorClosedTicket(false);
      }
    };

    createPartCode();
    setTimeout(() => { fetchData(); }, 2000)
    handlePartCodeClose();
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
    const deleteSparePart = async () => {
      try {
        const response = await axios.get('http://localhost:7153/api/SpareParts/Remove/' + removeID,
          {
            headers: {
              Authorization: 'Bearer ' + secureLocalStorage.getItem("accessToken"),
            },
          });

      } catch (err) {
        // setErrorClosedTicket(false);
      }
    };

    deleteSparePart();
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

  const handleTabChange = (event, newTab) => {
    setActiveTab(newTab);
  };

  const handlePartCodeChange = (index, newName) => {
    const updatedPartCodes = [...PartCodes];
    updatedPartCodes[index].name = newName;  // Update the specific PartCode's name
    setPartCodes(updatedPartCodes);

  };

  const handleDeletePartCode = (partCode_id) => {
    const deletePartCode = async () => {
      try {
        const response = await axios.get('http://localhost:7153/api/SparePartCodes/Remove/' + partCode_id,
          {
            headers: {
              Authorization: 'Bearer ' + secureLocalStorage.getItem("accessToken"),
            },
          });

      } catch (err) {
        // setErrorClosedTicket(false);
      }
    };

    deletePartCode();
    setTimeout(() => { getPartCodeByID(id); }, 2000)

  };

  const handleUpdatePartCode = (PartCode_id) => {
    for (let i = 0; i < PartCodes.length; i++) {
      if (PartCodes[i].id === PartCode_id) {
        const param = {
          "id": PartCodes[i].id,
          "name": PartCodes[i].name,
          "sparePartId": PartCodes[i].sparePartId
        }
        const updatePartCode = async () => {
          try {
            const response = await axios.put('http://localhost:7153/api/SparePartCodes/Update', param,
              {
                headers: {
                  Authorization: 'Bearer ' + secureLocalStorage.getItem("accessToken"),
                },
              });

          } catch (err) {
            // setErrorClosedTicket(false);
          }
        };
        updatePartCode();
      }
    }
    setTimeout(() => { getPartCodeByID(id); }, 2000)

  };

  return (
    <>
      <Dialog open={open} onClose={handleClose}>
        {isEdit ? <DialogTitle>{t("editSparePart")}</DialogTitle> :  <DialogTitle>{t("createNewSparePart")}</DialogTitle>}

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
                      <FormControl fullWidth variant="outlined">
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
                      </FormControl>


                    </Grid>

                  ) :
                  key === "sparePartCategoryId" ? (
                      <Grid item xs={12} sm={6} key={key}>
                        <FormControl fullWidth variant="outlined">
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
                        </FormControl>
                      </Grid>
                    ):
                    key === "companyId" ? (
                      <Grid item xs={12} sm={6} key={key}>
                        <FormControl fullWidth variant="outlined">
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
                            type={typeof params[key] === "string" ? "text" : "number"}
                            value={params[key]}
                            onChange={(e) => handleInputChange(key, e.target.value)}
                          />
                        }
                      </Grid>
                    )
              ))}
            </Grid>
          }

          {activeTab === 1 &&
            PartCodes.map((PartCode, index) => (
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
                      {t("update")}
                    </Button>
                    <Button onClick={(e) => handleDeletePartCode(PartCode.id)} color="error" key={index + "delete"}>
                      {t("delete")}
                    </Button>
                  </Grid>
                </Box>
                <Divider flexItem={true}/>
              </div>
            ))
          }
          {PartCodes.length === 0 && activeTab === 1 &&
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
              {isEdit ? t("edit") : t("create")}
            </Button>
          </DialogActions>
        }

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
            {t("delete")}
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={openPartCodeModal} onClose={handlePartCodeClose} fullWidth>
        <DialogTitle>{t("createPartCode")}</DialogTitle>
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
          <Button onClick={handlePartCodeClose} color="secondary">
            {t("cancel")}
          </Button>
          <Button onClick={handlePartCodesSave} color="primary">
            {t("create")}
          </Button>
        </DialogActions>
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