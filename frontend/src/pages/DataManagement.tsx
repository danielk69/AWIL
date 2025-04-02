import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Chip,
  Stack,
  SelectChangeEvent,
} from '@mui/material';
import { Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';
import { Theme, Subtheme, Category, Name, AllData } from '../types';
import * as api from '../services/api';

const DataManagement: React.FC = () => {
  const [data, setData] = useState<AllData | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogType, setDialogType] = useState<'theme' | 'subtheme' | 'category' | 'name'>('theme');
  const [newItemName, setNewItemName] = useState('');
  const [selectedThemeId, setSelectedThemeId] = useState<string>('');
  const [selectedSubthemeId, setSelectedSubthemeId] = useState<string>('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const allData = await api.getAllData();
      setData(allData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleOpenDialog = (type: 'theme' | 'subtheme' | 'category' | 'name') => {
    setDialogType(type);
    setNewItemName('');
    setSelectedThemeId('');
    setSelectedSubthemeId('');
    setSelectedCategories([]);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleAddItem = async () => {
    try {
      switch (dialogType) {
        case 'theme':
          await api.addTheme(newItemName);
          break;
        case 'subtheme':
          if (selectedThemeId) {
            await api.addSubtheme(Number(selectedThemeId), newItemName);
          }
          break;
        case 'category':
          if (selectedSubthemeId) {
            await api.addCategory(Number(selectedSubthemeId), newItemName);
          }
          break;
        case 'name':
          if (selectedCategories.length > 0) {
            await api.addName(newItemName, selectedCategories.map(Number));
          }
          break;
      }
      await fetchData();
      handleCloseDialog();
    } catch (error) {
      console.error('Error adding item:', error);
    }
  };

  const handleDeleteName = async (id: number) => {
    try {
      await api.deleteName(id);
      await fetchData();
    } catch (error) {
      console.error('Error deleting name:', error);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        await api.importData(file);
        await fetchData();
      } catch (error) {
        console.error('Error importing data:', error);
      }
    }
  };

  const filteredNames = data?.names.filter((name) =>
    name.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Container>
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Data Management
        </Typography>

        <Paper sx={{ p: 2, mb: 3 }}>
          <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
            <Button
              variant="contained"
              component="label"
              startIcon={<AddIcon />}
            >
              Import Spreadsheet
              <input
                type="file"
                hidden
                accept=".xlsx,.xls"
                onChange={handleFileUpload}
              />
            </Button>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => handleOpenDialog('theme')}
            >
              Add Theme
            </Button>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => handleOpenDialog('subtheme')}
            >
              Add Subtheme
            </Button>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => handleOpenDialog('category')}
            >
              Add Category
            </Button>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => handleOpenDialog('name')}
            >
              Add Name
            </Button>
          </Stack>

          <TextField
            fullWidth
            label="Search Names"
            variant="outlined"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ mb: 3 }}
          />

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Categories</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredNames?.map((name) => (
                  <TableRow key={name.id}>
                    <TableCell>{name.name}</TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={1}>
                        {data?.nameCategories
                          .filter((nc) => nc.name_id === name.id)
                          .map((nc) => {
                            const category = data.categories.find(
                              (c) => c.id === nc.category_id
                            );
                            return (
                              <Chip
                                key={nc.category_id}
                                label={category?.name}
                                size="small"
                              />
                            );
                          })}
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <IconButton
                        color="error"
                        onClick={() => handleDeleteName(name.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        <Dialog open={openDialog} onClose={handleCloseDialog}>
          <DialogTitle>
            Add {dialogType.charAt(0).toUpperCase() + dialogType.slice(1)}
          </DialogTitle>
          <DialogContent>
            <Box sx={{ mt: 2 }}>
              <TextField
                fullWidth
                label="Name"
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
                sx={{ mb: 2 }}
              />
              {dialogType === 'subtheme' && (
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Theme</InputLabel>
                  <Select
                    value={selectedThemeId}
                    onChange={(e: SelectChangeEvent) =>
                      setSelectedThemeId(e.target.value)
                    }
                    label="Theme"
                  >
                    {data?.themes.map((theme) => (
                      <MenuItem key={theme.id} value={theme.id}>
                        {theme.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
              {dialogType === 'category' && (
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Subtheme</InputLabel>
                  <Select
                    value={selectedSubthemeId}
                    onChange={(e: SelectChangeEvent) =>
                      setSelectedSubthemeId(e.target.value)
                    }
                    label="Subtheme"
                  >
                    {data?.subthemes.map((subtheme) => (
                      <MenuItem key={subtheme.id} value={subtheme.id}>
                        {subtheme.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
              {dialogType === 'name' && (
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Categories</InputLabel>
                  <Select
                    multiple
                    value={selectedCategories}
                    onChange={(e: SelectChangeEvent<string[]>) =>
                      setSelectedCategories(
                        typeof e.target.value === 'string'
                          ? [e.target.value]
                          : e.target.value
                      )
                    }
                    label="Categories"
                  >
                    {data?.categories.map((category) => (
                      <MenuItem key={category.id} value={category.id}>
                        {category.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button onClick={handleAddItem} variant="contained">
              Add
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  );
};

export default DataManagement; 