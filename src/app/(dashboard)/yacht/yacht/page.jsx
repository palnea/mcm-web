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
import {Dialog, DialogActions, DialogContent, DialogTitle, Select, Tab, Tabs} from "@mui/material";
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
    "officialNumber": "",
    "userId": null,
    "yachtBrandId": null,
    "yachtModelId": null,
    // "shipType": "",
    // "methodOfPropulsion": "",
    // "salesStatus": "",
    "expiryDate": "",
    "imoNumber": "",
    "radioCallSign": "",
    "registeredLength": null,
    "overallLength": null,
    "depth": null,
    "breadth": null,
    "grossTonnage": null,
    "netTonnage": null,
    "yearOfBuild": null,
    "hin": "",
    "port": "",
    "engineMakeAndModel": "",
    "enginePower": null
  });

  const clearParams = () => {
    let clearValues = {
      "name": "",
      "officialNumber": "",
      "userId": null,
      "yachtBrandId": null,
      "yachtModelId": null,
      // "shipType": "",
      // "methodOfPropulsion": "",
      // "salesStatus": "",
      "expiryDate": "",
      "imoNumber": "",
      "radioCallSign": "",
      "registeredLength": null,
      "overallLength": null,
      "depth": null,
      "breadth": null,
      "grossTonnage": null,
      "netTonnage": null,
      "yearOfBuild": null,
      "hin": "",
      "port": "",
      "engineMakeAndModel": "",
      "enginePower": null
    }
    setParams(param => ({
      ...param,
      ...clearValues
    }))
  }

  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openNotesModal, setOpenNotesModal] = useState(false);
  const [id, setId] = useState('');

  const [nameDel, setNameDel] = useState('');
  const [isEdit, setIsEdit] = useState(false);
  const { t, i18n } = useTranslation('common');
  const [optionsBrands, setOptionsBrands] = useState([]); // Options for the Select component
  const [optionsModels, setOptionsModels] = useState([]); // Options for the Select component
  const [optionsUsers, setOptionsUsers] = useState([]); // Options for the Select component
  const [activeTab, setActiveTab] = useState(0);  // 0 for yacht fields tab, 1 for notes tab
  const [notes, setNotes] = useState( []);


  const fetchData = async (id, name) => {
    try {
      const response = await axios.get('http://localhost:7153/api/Yachts',
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

  const fetchSelectModel = async (id, name) => {
    try {
      const response = await axios.get('http://localhost:7153/api/YachtModels',
        {
          headers: {
            Authorization: 'Bearer ' + secureLocalStorage.getItem("accessToken"),
          },
        });
      const optionsData = response.data.data.map(item => ({
        label: item.name,
        value: item.id,
      }));
      setOptionsModels(optionsData);


    } catch (err) {
      // setErrorClosedTicket(false);
    }
  };

  const fetchSelectUser = async (id, name) => {
    try {
      const response = await axios.get('http://localhost:7153/api/Users',
        {
          headers: {
            Authorization: 'Bearer ' + secureLocalStorage.getItem("accessToken"),
          },
        });
      const optionsData = response.data.data.map(item => ({
        label: item.username,
        value: item.id,
      }));
      setOptionsUsers(optionsData);


    } catch (err) {
      // setErrorClosedTicket(false);
    }
  };

  const getYachtNoteByID = async (id) => {
    try {
      const response = await axios.get('http://localhost:7153/api/YachtNotes/GetByYachtId/' + id,
        {
          headers: {
            Authorization: 'Bearer ' + secureLocalStorage.getItem("accessToken"),
          },
        });

      // console.log(response.data.data);

      setNotes(response.data.data);


    } catch (err) {
      // setErrorClosedTicket(false);
    }
  };

  useEffect(() => {
    fetchData();
    fetchSelectBrand();
    fetchSelectModel();
    fetchSelectUser();

  }, []);


  // useEffect(() => {
  //   // if (isEdit) {
  //   //   setInputValue(name);
  //   // }
  //   console.log(notes)
  // }, [notes]);


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
            // startIcon={<i className='tabler-pencil m-null' />}
            onClick={() => handleEdit(row)}
          >
            <i className='tabler-pencil' />
          </IconButton>



          <IconButton
            color={'error'}
            size="small"
            // startIcon={<i className='tabler-trash' />}
            onClick={() => handleDelete(row.id, row.name, row.yachtBrandId)}
          >
            <i className='tabler-trash' />
          </IconButton>

          <IconButton
            size="small"
            color={'secondary'}
            // startIcon={<i className='tabler-pencil m-null' />}
            onClick={() => handleNote(row.id)}
          >
            <i className='tabler-notes' />
          </IconButton>
        </>
      ),
    },
  ];

  const handleEdit = (row) => {
    setIsEdit(true);
    setParams(row);
    getYachtNoteByID(row.id);
    removeKeysWithFilter(["user", "yachtModel", "yachtBrand", "shipType", "methodOfPropulsion", "salesStatus", "yachtNotes", "createdDate",  "updatedDate"]);  // Pass an array of keys to remove
    handleOpen();
  };


  const handleDelete = (id, name) => {
    handleOpenDeleteModal(true);
    setNameDel(name);
    setRemoveID(id);
  };

  const handleNote = (id) => {
    handleOpenNoteModal(true);
    setId(id);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleOpenDeleteModal = () => {
    setOpenDeleteModal(true);
  };

  const handleOpenNoteModal = () => {
    setOpenNotesModal(true);
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
          const response = await axios.put('http://localhost:7153/api/Yachts/Update', params,
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
      const createYacht = async () => {
        try {
          const response = await axios.post('http://localhost:7153/api/Yachts', params,
            {
              headers: {
                Authorization: 'Bearer ' + secureLocalStorage.getItem("accessToken"),
              },
            });

        } catch (err) {
          // setErrorClosedTicket(false);
        }
      };

      createYacht();
    }
    setTimeout(() => { fetchData(); }, 2000)

    handleClose();
  };

  const handleNotesSave = () => {
      const createNote = async () => {
        const notes = {
          "name": inputValue,
          "yachtId": id
        }
        try {
          const response = await axios.post('http://localhost:7153/api/YachtNotes', notes,
            {
              headers: {
                Authorization: 'Bearer ' + secureLocalStorage.getItem("accessToken"),
              },
            });

        } catch (err) {
          // setErrorClosedTicket(false);
        }
      };

    createNote();

    setTimeout(() => { fetchData(); }, 2000)

    handleNotesClose();
  };

  const handleDelClose = () => {
    setOpenDeleteModal(false);
    setNameDel(''); // Reset the input when closing
  };

  const handleNotesClose = () => {
    setOpenNotesModal(false);
    // setNameDel(''); // Reset the input when closing
  };

  const handleDelSave = () => {
    const deleteYacht = async () => {
      try {
        const response = await axios.get('http://localhost:7153/api/Yachts/Remove/' + removeID,
          {
            headers: {
              Authorization: 'Bearer ' + secureLocalStorage.getItem("accessToken"),
            },
          });

      } catch (err) {
        // setErrorClosedTicket(false);
      }
    };

    deleteYacht();
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

  const handleNoteChange = (index, newName) => {
    const updatedNotes = [...notes];
    updatedNotes[index].name = newName;  // Update the specific note's name
    setNotes(updatedNotes);


  };

  const handleDeleteNote = (note_id) => {
    const deleteNote = async () => {
      try {
        const response = await axios.get('http://localhost:7153/api/YachtNotes/Remove/' + note_id,
          {
            headers: {
              Authorization: 'Bearer ' + secureLocalStorage.getItem("accessToken"),
            },
          });

      } catch (err) {
        // setErrorClosedTicket(false);
      }
    };

    deleteNote();
    setTimeout(() => { getYachtNoteByID(id); }, 2000)

  };

  const handleUpdateNote = (note_id) => {
    for (let i = 0; i < notes.length; i++) {
      if (notes[i].id === note_id) {
        const param = {
          "id": notes[i].id,
          "name": notes[i].name,
          "yachtId": notes[i].yachtId
        }
        const updateNote = async () => {
          try {
            const response = await axios.put('http://localhost:7153/api/YachtNotes/Update', param,
              {
                headers: {
                  Authorization: 'Bearer ' + secureLocalStorage.getItem("accessToken"),
                },
              });

          } catch (err) {
            // setErrorClosedTicket(false);
          }
        };

        updateNote();
      }
    }

    setTimeout(() => { getYachtNoteByID(id); }, 2000)

  };

  return (
    <>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{t("createNewModel")}</DialogTitle>
        <DialogContent className={"pt-3"} sx={{ minWidth: "500px", maxWidth: "800px" }}>

          {isEdit &&
            <Box className={"mb-3"}>

              <Grid container spacing={4} >
                <Tabs value={activeTab} onChange={handleTabChange} aria-label="Edit Yacht Tabs">
                  <Tab label="Yacht Fields" />
                  <Tab label="Yacht Notes" />
                </Tabs>
              </Grid>
            </Box>
          }

            {activeTab === 0   &&
              <Grid container spacing={4} >
                { Object.keys(params).map(key => (
                    key === "yachtBrandId" ? (
                        <Grid item xs={12} sm={6} key={key}>
                          <Select
                            margin="dense"
                            key={key}
                            fullWidth
                            variant="outlined"
                            value={params[key] || "" }
                            onChange={(e) => handleInputChange(key, e.target.value)}
                            displayEmpty
                          >
                            <MenuItem value="" disabled>{t("selectBrand")}</MenuItem>
                            {optionsBrands.map(option => (
                              <MenuItem key={option.value} value={option.value}>
                                {option.label}
                              </MenuItem>
                            ))}
                          </Select>

                        </Grid>

                      ) :
                      key === "yachtModelId" ? (
                          <Grid item xs={12} sm={6} key={key}>
                            <Select
                              key={key}
                              fullWidth
                              variant="outlined"
                              value={params[key]|| "" }
                              onChange={(e) => handleInputChange(key, e.target.value)}
                              displayEmpty
                            >
                              <MenuItem value="" disabled>{t("selectModel")}</MenuItem>
                              {optionsModels.map(option => (
                                <MenuItem key={option.value} value={option.value}>
                                  {option.label}
                                </MenuItem>
                              ))}
                            </Select>
                          </Grid>

                        ):
                        key === "userId" ? (
                          <Grid item xs={12} sm={6} key={key}>
                            <Select
                              key={key}
                              fullWidth
                              variant="outlined"
                              value={params[key]|| "" }
                              onChange={(e) => handleInputChange(key, e.target.value)}
                              displayEmpty
                            >
                              <MenuItem value="" disabled>{t("selectUsers")}</MenuItem>
                              {optionsUsers.map(option => (
                                <MenuItem key={option.value} value={option.value}>
                                  {option.label}
                                </MenuItem>
                              ))}
                            </Select>
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
                notes.map((note, index) => (
                  <div>
                    <Divider flexItem={true}/>
                    <Box className={"mb-3 flex"} sx={{ alignItems: 'flex-end' , justifyContent: "space-between"}}>
                        <Grid item xs={10} sm={6} key={index} className={"me-8"}>
                          <TextField
                            variant="outlined"
                            // label={`Note ${index + 1} Name`}
                            label={t("noteName")}
                            value={note.name}
                            className={"ms-2 mt-4"}
                            onChange={(e) => handleNoteChange(index, e.target.value)}

                          />

                        </Grid>
                        <Grid item xs={4} sm={6} key={index + "buttonsUpdate"} className={"ms-8"}>
                          <Button onClick={(e) => handleUpdateNote(note.id)} color="success" key={index + "update"}>
                            {t("update")}
                          </Button>
                          <Button onClick={(e) => handleDeleteNote(note.id)} color="error" key={index + "delete"}>
                            {t("delete")}
                          </Button>
                        </Grid>
                      </Box>
                    <Divider flexItem={true}/>

                  </div>





                ))
          }







        </DialogContent>

        {activeTab === 0 &&
          <DialogActions>
            <Button onClick={handleClose} color="secondary">
              {t("cancel")}
            </Button>
            <Button onClick={handleSave} color="primary">
              {t("create")}
            </Button>
          </DialogActions>
        }

      </Dialog>
      <Dialog open={openDeleteModal} onClose={handleDelClose}>
        <DialogTitle>{t("deleteModel")}</DialogTitle>
        <DialogContent>
          {i18n.language==='en' ?
            <Typography component='div'>{t('deleteModelMessage') }<Box fontWeight='fontWeightBold' display='inline'>{nameDel}</Box>?</Typography>
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
      <Dialog open={openNotesModal} onClose={handleNotesClose} fullWidth>
        <DialogTitle>{t("createNote")}</DialogTitle>
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
          <Button onClick={handleNotesClose} color="secondary">
            {t("cancel")}
          </Button>
          <Button onClick={handleNotesSave} color="primary">
            {t("create")}
          </Button>
        </DialogActions>
      </Dialog>
      <Grid container spacing={6}>
        <Grid item xs={12} sm={6} md={6} lg={6}>
          <Typography variant='h4'>{t("yachtOps")}</Typography>
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
