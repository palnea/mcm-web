"use client";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import CustomTable from "../../../../components/Table/CustomTable";
import Card from "@mui/material/Card";
import React, {useEffect, useState} from "react";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import {CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle} from "@mui/material";
import TextField from "@mui/material/TextField";
import {useTranslation} from "react-i18next";
import Box from "@mui/material/Box";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api from '../../../../api_helper/api';

export default function Page() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [editID, setEditID] = useState('');
  const [removeID, setRemoveID] = useState('');
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [nameDel, setNameDel] = useState('');
  const [isEdit, setIsEdit] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const {t, i18n} = useTranslation('common');
  const [errors, setErrors] = useState({
    name: '',
  });

  const fetchData = async () => {
    try {
      const response = await api.get('/Faults');
      setRows(response.data.data);
    } catch (err) {
      toast.error(t("Failed to fetch faults"));
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (isEdit) {
      setInputValue(name);
    }
  }, [isEdit, name]);

  const columns = [
    {id: "id", label: "ID"},
    {id: "name", label: "Name"},
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
            onClick={() => handleEdit(row.id, row.name)}
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

  const handleEdit = (id, name) => {
    setIsEdit(true);
    setName(name);
    setEditID(id);
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
    setEditID("");
    const clearValues = {
      name: '',
    }
    setErrors(param => ({
      ...param,
      ...clearValues
    }))
  };

  const handleSave = (event) => {
    event.preventDefault();
    let newErrors = {};

    if (inputValue === '') {
      newErrors.name = 'Name is required';
    }

    setErrors(newErrors);
    let is_successful = false;

    if (Object.keys(newErrors).length === 0) {
      setLoading(true);
      const params = isEdit
        ? { "id": editID, "name": inputValue }
        : { "name": inputValue };

      const saveFault = async () => {
        try {
          const response = isEdit
            ? await api.put('/Faults/Update', params)
            : await api.post('/Faults', params);

          if (response.status >= 200 && response.status < 300) {
            is_successful = true;
          }
        } catch (err) {
          toast.error(t("An error occurred. Please try again."));
        } finally {
          setTimeout(() => setLoading(false), 800);
        }
      };

      saveFault().then(() => {
        if (is_successful) {
          setTimeout(() => handleClose(), 800);
          setTimeout(() => toast.success(isEdit ? t('Fault updated successfully!') : t('Fault created successfully!')), 800);
          setTimeout(fetchData, 500);
        }
      });
    }
  };

  const handleDelClose = () => {
    setOpenDeleteModal(false);
    setNameDel('');
  };

  const handleDelSave = () => {
    setLoading(true);
    let is_successful = false;
    const deleteFault = async () => {
      try {
        const response = await api.get('/Faults/Remove/' + removeID);
        if (response.status >= 200 && response.status < 300) {
          is_successful = true;
        }
      } catch (err) {
        toast.error(t("An error occurred. Please try again."));
      } finally {
        setTimeout(() => setLoading(false), 800);
      }
    };

    deleteFault().then(() => {
      if (is_successful) {
        setTimeout(() => handleDelClose(), 800);
        setTimeout(() => toast.success(t('Fault deleted successfully!')), 800);
        setTimeout(fetchData, 500);
      }
    });
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} closeOnClick pauseOnHover />

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{isEdit ? t("Edit Fault") : t("Create New Fault")}</DialogTitle>
        <form
          noValidate
          autoComplete="off"
          onSubmit={handleSave}
          className="flex flex-col gap-5"
        >
          <DialogContent>
            <Box display="flex" sx={{ alignItems: 'baseline' }} gap={2}>
              <TextField
                autoFocus
                margin="dense"
                label={t("name")}
                type="text"
                fullWidth
                value={inputValue}
                error={!!errors.name}
                helperText={t(errors.name)}
                onChange={(e) => setInputValue(e.target.value)}
              />
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
        <DialogTitle>{t("Delete Fault")}</DialogTitle>
        <DialogContent>
          {i18n.language === 'en' ?
            <Typography component='div'>{t('Are you sure you want to delete')} <Box fontWeight='fontWeightBold' display='inline'>{nameDel}</Box>?</Typography>
            : <Typography><Box fontWeight='fontWeightBold' display='inline'>{nameDel}</Box> {t('silmek istediğinize emin misiniz?')}</Typography>}
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
          <Typography variant='h4'>{t("faults")}</Typography>
        </Grid>
        <Grid item xs={12} sm={12} md={12} lg={12}>
          <Card>
            <div className={"flex justify-end p-3"}>
              <IconButton variant="contained" color="success" onClick={handleOpen}>
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
