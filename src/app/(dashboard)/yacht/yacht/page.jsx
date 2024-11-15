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
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Page() {

  const [open, setOpen] = useState(false);
  const [editID, setEditID] = useState('');
  const [removeID, setRemoveID] = useState('');
  const [rows, setRows] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [YachtLoad, setYachtLoad] = useState( []);
  const [YachtLoadEdit, setYachtLoadEdit] = useState( []);

  const [errors, setErrors] = useState({
    name: '',
    userId: '',
    yachtBrandId: '',
    yachtModelId: '',
  });

  const [noteErrors, setNoteErrors] = useState({
    name: '',
  });

  const [params, setParams] = useState({
    "name": "",
    "officialNumber": "",
    "userId": null,
    "groupId": null,
    "yachtBrandId": null,
    "yachtModelId": null,
    // "shipType": "",
    // "methodOfPropulsion": "",
    // "salesStatus": "",
    "expiryDate": "",
    "imoNumber": "",
    "radioCallSign": "",
    "registeredLength": "",
    "overallLength": "",
    "depth": "",
    "breadth": "",
    "grossTonnage": "",
    "netTonnage": "",
    "yearOfBuild": "",
    "hin": "",
    "port": "",
    "engineMakeAndModel": "",
    "enginePower": ""
  });

  const clearParams = () => {
    let clearValues = {
      "name": "",
      "officialNumber": "",
      "userId": null,
      "groupId": null,
      "yachtBrandId": null,
      "yachtModelId": null,
      // "shipType": "",
      // "methodOfPropulsion": "",
      // "salesStatus": "",
      "expiryDate": "",
      "imoNumber": "",
      "radioCallSign": "",
      "registeredLength": "",
      "overallLength": "",
      "depth": "",
      "breadth": "",
      "grossTonnage": "",
      "netTonnage": "",
      "yearOfBuild": "",
      "hin": "",
      "port": "",
      "engineMakeAndModel": "",
      "enginePower": ""
    }
    setParams(param => ({
      ...param,
      ...clearValues
    }))

    let clearValues2 = {
      name: '',
      // userId: '',
      yachtBrandId: '',
      yachtModelId: '',
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
  const [optionsModels, setOptionsModels] = useState([]); // Options for the Select component
  const [optionsUsers, setOptionsUsers] = useState([]); // Options for the Select component
  const [optionsGroups, setOptionsGroups] = useState([]); // Options for the Select component
  const [activeTab, setActiveTab] = useState(0);  // 0 for yacht fields tab, 1 for notes tab
  const [notes, setNotes] = useState( []);


  const fetchData = async (id, name) => {
    try {
      const response = await axios.get('http://localhost:7153/api/Yachts/GetAllWithDetails',
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

  const fetchSelectModel = async (value) => {
    try {
      const response = await axios.get('http://localhost:7153/api/YachtModels/GetByYachtBrandId/' + value,
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

  const fetchSelectGroups = async (id, name) => {
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
      setOptionsGroups(optionsData);

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
      setNotes(response.data.data);

    } catch (err) {
      // setErrorClosedTicket(false);
    }
  };

  useEffect(() => {
    fetchData();
    fetchSelectBrand();
    // fetchSelectModel();
    fetchSelectUser();
    fetchSelectGroups();

  }, []);

  const columns = [
    { id: "id", label: "id" },
    { id: "name", label: "name" },
    { id: "yachtBrand", label: "yachtBrand" ,
      render: (row) => {
        return row.yachtBrand.name;
      }},
    { id: "yachtModel", label: "yachtModel" ,
      render: (row) => {
        return row.yachtModel.name;
      }},
    { id: "port", label: "port" },
    { id: "depth", label: "depth" },
    { id: "breadth", label: "breadth" },
    { id: "grossTonnage", label: "grossTonnage" },
    { id: "netTonnage", label: "netTonnage" },
    { id: "yearOfBuild", label: "yearOfBuild" },

    { id: "expiryDate", label: "expiryDate",
      render: (row) => {
        const date = new Date(row.expiryDate);
        return date.toLocaleDateString();
      }},
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
    removeKeysWithFilter(["user","group", "yachtModel", "yachtBrand", "shipType", "methodOfPropulsion", "salesStatus", "yachtNotes", "createdDate",  "updatedDate"]);  // Pass an array of keys to remove
    handleOpen(row.id);
  };


  const yearOptions = Array.from(new Array(50), (_, index) => {
    const year = new Date().getFullYear() - index; // Adjust the range as needed
    return year.toString();
  });


  const handleDelete = (id, name) => {
    handleOpenDeleteModal(true);
    setNameDel(name);
    setRemoveID(id);
  };

  const handleNote = (id) => {
    handleOpenNoteModal(true);
    setId(id);
  };

  const handleOpen = (id) => {
    setOpen(true);
    setId(id);
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
    removeKeysWithFilter([ "id"]);
    clearParams();
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

    // if (params.userId === '' || params.userId === null) {
    //   newErrors.userId = 'User is required';
    // }

    if (params.yachtBrandId === '' || params.yachtBrandId === null) {
      newErrors.yachtBrandId = 'Brand is required';
    }

    if (params.yachtModelId === '' || params.yachtModelId === null) {
      newErrors.yachtModelId = 'Model is required';
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      // if (isEdit) {
      //   const editModel = async () => {
      //     try {
      //       const response = await axios.put('http://localhost:7153/api/Yachts/Update', params,
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
      //   editModel();
      // }
      // else {
      //   const createYacht = async () => {
      //     try {
      //       const response = await axios.post('http://localhost:7153/api/Yachts', params,
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
      //   createYacht();
      // }
      // setTimeout(() => { fetchData(); }, 2000)
      //
      // handleClose();
      setLoading(true);
      const saveBrand = async () => {
        try {
          const response = isEdit
            ? await axios.put('http://localhost:7153/api/Yachts/Update', params, {
              headers: { Authorization: 'Bearer ' + secureLocalStorage.getItem("accessToken") },
            })
            : await axios.post('http://localhost:7153/api/Yachts', params, {
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
          setTimeout(() => toast.success(isEdit ? t('Yacht updated successfully!') : t('Yacht created successfully!')), 800);

          setTimeout(fetchData, 500); // Fetch updated data after closing
        }
      });
    }

  };

  const handleNotesSave = () => {
    event.preventDefault();
    let newErrors = {};
    let is_successful = false;

    // Validate required fields
    if (inputValue === '') {
      newErrors.name = 'Name is required';
    }

    setNoteErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setLoading(true);

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
      createNote().then(() => {
        if (is_successful) {
          setTimeout(() => handleNotesClose(), 800);
          setTimeout(() => toast.success(t('Yacht note created successfully!')), 800);

          setTimeout(fetchData, 500); // Fetch updated data after closing
        }
      });
    }


  };

  const handleDelClose = () => {
    setOpenDeleteModal(false);
    setNameDel(''); // Reset the input when closing
  };

  const handleNotesClose = () => {
    setOpenNotesModal(false);
    setInputValue(''); // Reset the input when closing
    const clearValues = {
      name: '',
    }
    setNoteErrors(param => ({
      ...param,
      ...clearValues
    }))
    // setNameDel(''); // Reset the input when closing
  };

  const handleDelSave = () => {
    setLoading(true);
    let is_successful = false;
    const deleteYacht = async () => {
      try {
        const response = await axios.get('http://localhost:7153/api/Yachts/Remove/' + removeID,
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
        setTimeout(() => toast.success(t('Yacht deleted successfully!')), 800);

        setTimeout(fetchData, 500); // Fetch updated data after closing
      }
    });
  };

  const handleInputChange = (key, value) => {
    if (key === "yachtBrandId") {
      fetchSelectModel(value);

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

  const handleTabChange = (event, newTab) => {
    setActiveTab(newTab);
  };

  const handleNoteChange = (index, newName) => {
    const updatedNotes = [...notes];
    updatedNotes[index].name = newName;  // Update the specific note's name
    setNotes(updatedNotes);


  };

  const handleDeleteNote = (note_id) => {
    setYachtLoad({ ...YachtLoad, [note_id]: true });
    let is_successful = false;

    const deleteNote = async () => {
      try {
        const response = await axios.get('http://localhost:7153/api/YachtNotes/Remove/' + note_id,
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
        // toast.error(t("An error occurred. Please try again."));
      }finally {
        setTimeout(() => setYachtLoad({ ...YachtLoad, [note_id]: false }), 800);
      }
    };
    deleteNote().then(() => {
      if (is_successful) {
        // setTimeout(() => toast.success(t('Accessory category deleted successfully!')), 800);

        setTimeout( () => { getYachtNoteByID(id); }, 500); // Fetch updated data after closing
      }
    });

  };

  const handleUpdateNote = (note_id) => {
    setYachtLoadEdit({ ...YachtLoadEdit, [note_id]: true });
    let is_successful = false;
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
            if (response.status >= 200 && response.status < 300) {
              is_successful = true;
            }

          } catch (err) {
            console.error("Error:", err);
            // toast.error(t("An error occurred. Please try again."));
          }finally {
            setTimeout(() => setYachtLoadEdit({ ...YachtLoadEdit, [note_id]: false }), 800);
          }
        };
        updateNote().then(() => {
          if (is_successful) {
            console.log(id)
            // setTimeout(() => toast.success(t('Accessory category deleted successfully!')), 800);
            setTimeout( () => { getYachtNoteByID(id); }, 500); // Fetch updated data after closing
          }
        });

      }
    }

    // setTimeout(() => { getYachtNoteByID(id); }, 2000)

  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} closeOnClick pauseOnHover />

      <Dialog open={open} onClose={handleClose}>
        {isEdit ? <DialogTitle>{t("editYacht")}</DialogTitle> :  <DialogTitle>{t("createNewYacht")}</DialogTitle>}
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
                  <Tabs value={activeTab} onChange={handleTabChange} aria-label="Edit Yacht Tabs">
                    <Tab label={t("yachtFields")} />
                    <Tab label={t("yachtNotes")} />
                  </Tabs>
                </Grid>
              </Box>
            }

            {activeTab === 0   &&
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
                    key === "yachtModelId" ? (
                        <Grid item xs={12} sm={6} key={key}>
                          <FormControl fullWidth variant="outlined" error={!!errors[key]}>
                            <InputLabel>{t("selectModel")}</InputLabel>
                            <Select
                              key={key}
                              fullWidth
                              variant="outlined"
                              value={params[key]|| "" }
                              label={t("selectModel")}
                              onChange={(e) => handleInputChange(key, e.target.value)}
                              displayEmpty
                              disabled={params.yachtBrandId === null}
                            >
                              {/*<MenuItem value="" disabled>{t("selectModel")}</MenuItem>*/}
                              {optionsModels.map(option => (
                                <MenuItem key={option.value} value={option.value}>
                                  {option.label}
                                </MenuItem>
                              ))}
                            </Select>
                            <FormHelperText>{t(errors[key])}</FormHelperText>
                          </FormControl>

                        </Grid>

                      ):
                      key === "userId" ? (
                        <Grid item xs={12} sm={6} key={key}>
                          <FormControl fullWidth variant="outlined" error={!!errors[key]}>
                            <InputLabel>{t("selectUsers")}</InputLabel>
                            <Select
                              key={key}
                              fullWidth
                              label={t("selectUsers")}
                              variant="outlined"
                              value={params[key]|| "" }
                              onChange={(e) => handleInputChange(key, e.target.value)}
                              displayEmpty
                            >
                              {/*<MenuItem value="" disabled>{t("selectUsers")}</MenuItem>*/}
                              {optionsUsers.map(option => (
                                <MenuItem key={option.value} value={option.value}>
                                  {option.label}
                                </MenuItem>
                              ))}
                            </Select>
                            <FormHelperText>{t(errors[key])}</FormHelperText>
                          </FormControl>

                        </Grid>

                      ) :
                        key === "groupId" ? (
                            <Grid item xs={12} sm={6} key={key}>
                              <FormControl fullWidth variant="outlined" error={!!errors[key]}>
                                <InputLabel>{t("selectGroup")}</InputLabel>
                                <Select
                                  key={key}
                                  fullWidth
                                  label={t("selectGroup")}
                                  variant="outlined"
                                  value={params[key]|| "" }
                                  onChange={(e) => handleInputChange(key, e.target.value)}
                                  displayEmpty
                                >
                                  {optionsGroups.map(option => (
                                    <MenuItem key={option.value} value={option.value}>
                                      {option.label}
                                    </MenuItem>
                                  ))}
                                </Select>
                                <FormHelperText>{t(errors[key])}</FormHelperText>
                              </FormControl>

                            </Grid>

                          )


                        : (
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
                            /> : key === "yearOfBuild" ?
                              <FormControl fullWidth variant="outlined"  >
                                <InputLabel>{t(key)}</InputLabel>
                                <Select
                                  key={key}
                                  fullWidth
                                  label={t(key)}
                                  variant="outlined"
                                  value={params[key]|| "" }
                                  onChange={(e) => handleInputChange(key, e.target.value)}
                                  displayEmpty
                                >
                                  {/*<MenuItem value="" disabled>{t("selectUsers")}</MenuItem>*/}
                                  {yearOptions.map(year => (
                                    <MenuItem key={year} value={year}>
                                      {year}
                                    </MenuItem>
                                  ))}
                                </Select>
                              </FormControl>

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
            {activeTab === 1 && notes && notes.length === 0 && <Typography>{t("noNotes")}</Typography>}
            {activeTab === 1 && notes &&
              notes.map((note, index) => (
                <div>
                  <Divider flexItem={true}/>
                  <Box className={"mb-3 flex"} sx={{ alignItems: 'flex-end' , justifyContent: "space-between"}}>
                    <Grid item xs={10} sm={6} key={index} className={"me-8"}>
                      <TextField
                        variant="outlined"
                        // label={`Note ${index + 1} Name`}
                        multiline  // Makes the field a textarea
                        rows={4}  // Adjusts the number of visible rows (height)
                        label={t("name")}
                        value={note.name}
                        className={"ms-2 mt-4"}
                        onChange={(e) => handleNoteChange(index, e.target.value)}

                      />

                    </Grid>
                    <Grid item xs={4} sm={6} key={index + "buttonsUpdate"} className={"ms-8"}>
                      <Button onClick={(e) => handleUpdateNote(note.id)} color="success" key={index + "updateButton"}>
                        {YachtLoadEdit[note.id] ? <CircularProgress size={24} /> : t("update")}
                      </Button>
                      <Button onClick={(e) => handleDeleteNote(note.id)} color="error" key={index + "deleteButton"}>
                        {YachtLoad[note.id] ? <CircularProgress size={24} /> : t("delete")}
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
                {loading ? <CircularProgress size={24} />
                  : isEdit ? t("edit") : t("create")}
              </Button>
            </DialogActions>
          }
        </form>


      </Dialog>
      <Dialog open={openDeleteModal} onClose={handleDelClose}>
        <DialogTitle>{t("deleteYacht")}</DialogTitle>
        <DialogContent>
          {i18n.language==='en' ?
            <Typography component='div'>{t('deleteYachtMessage') }<Box fontWeight='fontWeightBold' display='inline'>{nameDel}</Box>?</Typography>
            : <Typography> <Box fontWeight='fontWeightBold' display='inline'>{nameDel}</Box> {t('deleteYachtMessage') }</Typography>}

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
      <Dialog open={openNotesModal} onClose={handleNotesClose} fullWidth>
        <DialogTitle>{t("createNote")}</DialogTitle>
        <form
          noValidate
          autoComplete="off"
          onSubmit={handleNotesSave}
          className="flex flex-col gap-5"
        >
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label={t("name")}
              multiline  // Makes the field a textarea
              rows={4}  // Adjusts the number of visible rows (height)
              type="text"
              fullWidth
              error={!!noteErrors.name} // If there's an error, show it
              helperText={t(noteErrors.name)} // Display the error message
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
              {loading ? <CircularProgress size={24} /> : t("create")}
            </Button>
          </DialogActions>
        </form>

      </Dialog>
      <Grid container spacing={6}>
        <Grid item xs={12} sm={6} md={6} lg={6}>
          <Typography variant='h4'>{t("yachtOps")}</Typography>
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
