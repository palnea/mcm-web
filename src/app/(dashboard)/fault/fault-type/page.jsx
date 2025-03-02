"use client";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import CustomTable from "../../../../components/Table/CustomTable";
import Card from "@mui/material/Card";
import React, {useEffect, useState} from "react";
import api from '../../../../api_helper/api';
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
import Box from "@mui/material/Box";
import MenuItem from "@mui/material/MenuItem";
import {toast, ToastContainer} from "react-toastify";

export default function Page() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [editID, setEditID] = useState('');
  const [faultId, setFaultId] = useState('');
  const [removeID, setRemoveID] = useState('');
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [nameDel, setNameDel] = useState('');
  const [isEdit, setIsEdit] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [idValue, setIdValue] = useState('');
  const {t, i18n} = useTranslation('common');
  const [faults, setFaults] = useState([]); // Options for the Select component
  const [errors, setErrors] = useState({
    name: '',
    faultId: '',
  });

  const fetchData = async () => {
    try {
      const response = await api.get('/FaultTypes');
      setRows(response.data.data);
    } catch (err) {
      toast.error(t("Failed to fetch fault types"));
    }
  };

  const fetchFaults = async () => {
    try {
      const response = await api.get('/Faults');
      const faultsData = response.data.data.map(item => ({
        label: item.name,
        value: item.id,
      }));
      setFaults(faultsData);
    } catch (err) {
      toast.error(t("Failed to fetch faults"));
    }
  };

  useEffect(() => {
    fetchData();
    fetchFaults();
  }, []);

  useEffect(() => {
    if (isEdit) {
      setInputValue(name);
      setIdValue(faultId);
    }
  }, [isEdit, name, faultId]);

  const columns = [
    {id: "id", label: "ID"},
    {id: "name", label: "Name"},
    {id: "ticketCount", label: "Ticket Count"},
    {
      id: "createdDate",
      label: "Created Date",
      render: (row) => {
        const date = new Date(row.createdDate);
        return date.toLocaleDateString();
      }
    },
    {
      id: "updatedDate",
      label: "Updated Date",
      render: (row) => {
        const date = new Date(row.updatedDate);
        return date.toLocaleDateString();
      }
    },
    {
      id: 'actions',
      label: 'Actions',
      disableSorting: true,
      minWidth: 100,
      render: (row) => (
        <>
          <IconButton
            size="small"
            color={'primary'}
            onClick={() => handleEdit(row.id, row.name, row.faultId)}
          >
            <i className='tabler-pencil'/>
          </IconButton>
          <IconButton
            color={'error'}
            size="small"
            onClick={() => handleDelete(row.id, row.name)}
          >
            <i className='tabler-trash'/>
          </IconButton>
        </>
      ),
    },
  ];

  const handleEdit = (id, name, faultId) => {
    setIsEdit(true);
    setName(name);
    setEditID(id);
    setFaultId(faultId);
    handleOpen();
  };

  const handleDelete = (id, name) => {
    setOpenDeleteModal(true);
    setNameDel(name);
    setRemoveID(id);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setIsEdit(false);
    setInputValue('');
    setIdValue("");
    setEditID("");
    setFaultId("");
    setRemoveID("");
    setErrors({
      name: '',
      faultId: '',
    });
  };

  const handleSave = (event) => {
    event.preventDefault();
    let is_successful = false;
    let newErrors = {};

    if (inputValue === '') {
      newErrors.name = 'Name is required';
    }
    if (idValue === '') {
      newErrors.faultId = 'Parent Fault is required';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setLoading(true);
      const params = isEdit
        ? {"id": editID, "name": inputValue, "faultId": idValue}
        : {"name": inputValue, "faultId": idValue};

      const saveFaultType = async () => {
        try {
          const response = isEdit
            ? await api.put('/FaultTypes/Update', params)
            : await api.post('/FaultTypes', params);

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

      saveFaultType().then(() => {
        if (is_successful) {
          setTimeout(() => handleClose(), 800);
          setTimeout(() => toast.success(isEdit ? t('Fault type updated successfully!') : t('Fault type created successfully!')), 800);
          setTimeout(fetchData, 500);
        }
      });
    }
  };

  const handleDelSave = () => {
    let is_successful = false;
    setLoading(true);
    const deleteFaultType = async () => {
      try {
        const response = await api.get('/FaultTypes/Remove/' + removeID);
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

    deleteFaultType().then(() => {
      if (is_successful) {
        setTimeout(() => handleDelClose(), 800);
        setTimeout(() => toast.success(t('Fault type deleted successfully!')), 800);
        setTimeout(fetchData, 500);
      }
    });
  };

  const handleDelClose = () => {
    setOpenDeleteModal(false);
    setNameDel('');
  };

  const handleChange = (e) => {
    setIdValue(e.target.value);
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} closeOnClick pauseOnHover/>

      <Dialog open={open} onClose={handleClose}>
        {isEdit ? <DialogTitle>{t("Edit Fault Type")}</DialogTitle> : <DialogTitle>{t("Create Fault Type")}</DialogTitle>}
        <form
          noValidate
          autoComplete="off"
          onSubmit={handleSave}
          className="flex flex-col gap-5"
        >
          <DialogContent sx={{minWidth: "500px", maxWidth: "800px"}}>
            <Box display="flex" sx={{alignItems: 'baseline'}} gap={2}>
              <TextField
                autoFocus
                margin="dense"
                label={t("name")}
                type="text"
                value={inputValue}
                error={!!errors.name}
                helperText={t(errors.name)}
                onChange={(e) => setInputValue(e.target.value)}
                sx={{flex: 1}}
              />
              <FormControl variant="outlined" error={!!errors.faultId} sx={{flex: 1}}>
                <InputLabel>{t("Select Parent Fault")}</InputLabel>
                <Select
                  margin="dense"
                  fullWidth
                  variant="outlined"
                  className="p-0"
                  value={idValue}
                  label={t("Select Parent Fault")}
                  onChange={(e) => handleChange(e)}
                  displayEmpty
                >
                  {faults.map((fault) => (
                    <MenuItem key={fault.value} value={fault.value}>
                      {fault.label}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText>{t(errors.faultId)}</FormHelperText>
              </FormControl>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="secondary">
              {t("cancel")}
            </Button>
            <Button onClick={handleSave} color="primary">
              {loading ? <CircularProgress size={24}/> : isEdit ? t("edit") : t("create")}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      <Dialog open={openDeleteModal} onClose={handleDelClose}>
        <DialogTitle>{t("Delete Fault Type")}</DialogTitle>
        <DialogContent>
          {i18n.language === 'en' ?
            <Typography component='div'>{t('Are you sure you want to delete')}<Box fontWeight='fontWeightBold'
                                                                                   display='inline'>{nameDel}</Box>?</Typography>
            : <Typography><Box fontWeight='fontWeightBold' display='inline'>{nameDel}</Box> {t('silmek istediğinize emin misiniz?')}</Typography>}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDelClose} color="secondary">
            {t("cancel")}
          </Button>
          <Button onClick={handleDelSave} color="primary">
            {loading ? <CircularProgress size={24}/> : t("delete")}
          </Button>
        </DialogActions>
      </Dialog>

      <Grid container spacing={6}>
        <Grid item xs={12} sm={6} md={6} lg={6}>
          <Typography variant='h4'>{t("faultTypes")}</Typography>
        </Grid>
        <Grid item xs={12} sm={12} md={12} lg={12}>
          <Card>
            <div className={"flex justify-end p-3"}>
              <IconButton variant="contained" color="success" onClick={handleOpen}>
                <i className='tabler-plus'/>
              </IconButton>
            </div>
            <CustomTable rows={rows} columns={columns}/>
          </Card>
        </Grid>
      </Grid>
    </>
  )
}
