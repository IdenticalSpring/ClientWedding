import React, { useState } from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Grid,
  FormLabel,
  Checkbox,
  FormControlLabel,
} from '@mui/material';
import { AdminAPI } from '../../../service/admin';

const ModalAddUser = ({ open, onClose, fetchUsers }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    isActive: false,
    dateOfBirth: '',
    role: '',
    avatar: '',
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === 'avatar') {
      setFormData((prev) => ({
        ...prev,
        avatar: files[0],
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  const handleSubmit = async () => {
    const { name, email, password, avatar } = formData;
    if (!name || !email || !password) {
      alert('Vui lòng điền đầy đủ thông tin bắt buộc.');
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append('name', formData?.name);
    formDataToSend.append('email', formData?.email);
    formDataToSend.append('password', formData.password);
    formDataToSend.append('phone', formData.phone);
    formDataToSend.append('isActive', formData.isActive);
    formDataToSend.append('dateOfBirth', formData.dateOfBirth);
    formDataToSend.append('role', formData.role);

    if (avatar) {
      formDataToSend.append('avatar', avatar);
    }

    try {
      const response = await AdminAPI.postUser(formData);
      if (response?.status === 201 || response?.status === 200) {
        console.log('done');
        onClose();
        fetchUsers();
        setFormData({
          name: '',
          email: '',
          password: '',
          phone: '',
          isActive: false,
          dateOfBirth: '',
          role: '',
          avatar: '',
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Thêm người dùng</DialogTitle>
      <DialogContent sx={{ overflowX: 'hidden' }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <FormLabel>Họ và Tên</FormLabel>
              <TextField
                name='name'
                value={formData.name}
                onChange={handleChange}
                error={!!errors.name}
                helperText={errors.name || ''}
                placeholder='Nguyễn Văn A'
                fullWidth
                required
                InputProps={{
                  sx: {
                    textAlign: 'center',
                    border: 'none',
                    outline: 'none',
                  },
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    border: 'none',
                    outline: 'none',
                  },
                }}
              />
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <FormLabel>Email</FormLabel>
              <TextField
                name='email'
                value={formData.email}
                onChange={handleChange}
                error={!!errors.email}
                helperText={errors.email || ''}
                placeholder='tu123@email.com'
                fullWidth
                required
                InputProps={{
                  sx: {
                    textAlign: 'center',
                    border: 'none',
                    outline: 'none',
                  },
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    border: 'none',
                    outline: 'none',
                  },
                }}
              />
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <FormLabel>Password</FormLabel>
              <TextField
                type='password'
                name='password'
                value={formData.password}
                onChange={handleChange}
                error={!!errors.password}
                helperText={errors.password || ''}
                placeholder='********'
                fullWidth
                required
                InputProps={{
                  sx: {
                    textAlign: 'center',
                    border: 'none',
                    outline: 'none',
                  },
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    border: 'none',
                    outline: 'none',
                  },
                }}
              />
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <FormLabel>Số điện thoại</FormLabel>
              <TextField
                name='phone'
                value={formData.phone}
                onChange={handleChange}
                error={!!errors.phone}
                helperText={errors.phone || ''}
                placeholder='0123456789'
                fullWidth
                InputProps={{
                  sx: {
                    textAlign: 'center',
                    border: 'none',
                    outline: 'none',
                  },
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    border: 'none',
                    outline: 'none',
                  },
                }}
              />
            </FormControl>
          </Grid>
          {/* 
          <Grid item xs={12}>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    name='isActive'
                    checked={formData.isActive}
                    onChange={handleCheckboxChange}
                  />
                }
                label='Hoạt động'
              />
            </FormControl>
          </Grid> */}

          <Grid item xs={12}>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <FormLabel>Ngày sinh</FormLabel>
              <TextField
                type='date'
                name='dateOfBirth'
                value={formData.dateOfBirth}
                onChange={handleChange}
                error={!!errors.dateOfBirth}
                helperText={errors.dateOfBirth || ''}
                fullWidth
                InputLabelProps={{
                  shrink: true,
                }}
                InputProps={{
                  sx: {
                    textAlign: 'center',
                    border: 'none',
                    outline: 'none',
                  },
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    border: 'none',
                    outline: 'none',
                  },
                }}
              />
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <FormLabel>Vai trò</FormLabel>
              <Select
                label='Vai trò'
                name='role'
                value={formData.role}
                onChange={handleChange}
                fullWidth
                sx={{
                  '& .MuiSelect-select': {
                    textAlign: 'center',
                  },
                  '& .MuiOutlinedInput-root': {
                    border: 'none',
                    outline: 'none',
                  },
                }}
              >
                <MenuItem value='admin'>Admin</MenuItem>
                <MenuItem value='user'>User</MenuItem>
                <MenuItem value='moderator'>Moderator</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <FormLabel>Avatar</FormLabel>
              <TextField
                type='file'
                name='avatar'
                onChange={handleChange}
                fullWidth
                InputProps={{
                  sx: {
                    textAlign: 'center',
                    border: 'none',
                    outline: 'none',
                  },
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    border: 'none',
                    outline: 'none',
                  },
                }}
              />
            </FormControl>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color='primary'>
          Hủy
        </Button>
        <Button onClick={handleSubmit} color='secondary'>
          Lưu
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ModalAddUser;
