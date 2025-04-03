import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  Paper,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
} from '@mui/material';
import { Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';
import * as api from '../services/api';
import { AllData } from '../types';

const DataManagement: React.FC = () => {
  const [data, setData] = useState<AllData | null>(null);
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [themeDialogOpen, setThemeDialogOpen] = useState(false);
  const [subthemeDialogOpen, setSubthemeDialogOpen] = useState(false);
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
  const [nameDialogOpen, setNameDialogOpen] = useState(false);
  const [newItem, setNewItem] = useState({ name: '' });
  const [selectedThemeId, setSelectedThemeId] = useState<number | ''>('');
  const [selectedSubthemeId, setSelectedSubthemeId] = useState<number | ''>('');
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<number[]>([]);

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

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        await api.importData(file);
        fetchData();
      } catch (error) {
        console.error('Error importing data:', error);
      }
    }
  };

  const handleAddTheme = async () => {
    try {
      await api.addTheme(newItem.name);
      setThemeDialogOpen(false);
      setNewItem({ name: '' });
      fetchData();
    } catch (error) {
      console.error('Error adding theme:', error);
    }
  };

  const handleAddSubtheme = async () => {
    if (!selectedThemeId) return;
    try {
      await api.addSubtheme(selectedThemeId, newItem.name);
      setSubthemeDialogOpen(false);
      setNewItem({ name: '' });
      setSelectedThemeId('');
      fetchData();
    } catch (error) {
      console.error('Error adding subtheme:', error);
    }
  };

  const handleAddCategory = async () => {
    if (!selectedSubthemeId) return;
    try {
      await api.addCategory(selectedSubthemeId, newItem.name);
      setCategoryDialogOpen(false);
      setNewItem({ name: '' });
      setSelectedSubthemeId('');
      fetchData();
    } catch (error) {
      console.error('Error adding category:', error);
    }
  };

  const handleAddName = async () => {
    if (selectedCategoryIds.length === 0) return;
    try {
      await api.addName(newItem.name, selectedCategoryIds);
      setNameDialogOpen(false);
      setNewItem({ name: '' });
      setSelectedCategoryIds([]);
      fetchData();
    } catch (error) {
      console.error('Error adding name:', error);
    }
  };

  const handleDeleteName = async (id: number) => {
    try {
      await api.deleteName(id);
      fetchData();
    } catch (error) {
      console.error('Error deleting name:', error);
    }
  };

  return (
    <Container>
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Data Management
        </Typography>

        <Paper sx={{ p: 2, mb: 3 }}>
          <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
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
                onChange={handleImport}
              />
            </Button>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setThemeDialogOpen(true)}
            >
              Add Theme
            </Button>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setSubthemeDialogOpen(true)}
            >
              Add Subtheme
            </Button>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setCategoryDialogOpen(true)}
            >
              Add Category
            </Button>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setNameDialogOpen(true)}
            >
              Add Name
            </Button>
          </Box>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Theme</TableCell>
                  <TableCell>Subtheme</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data?.names.map((name) => {
                  const nameCategory = data.nameCategories.find(
                    (nc) => nc.name_id === name.id
                  );
                  const category = data.categories.find(
                    (c) => c.id === nameCategory?.category_id
                  );
                  const subtheme = data.subthemes.find(
                    (s) => s.id === category?.subtheme_id
                  );
                  const theme = data.themes.find(
                    (t) => t.id === subtheme?.theme_id
                  );

                  return (
                    <TableRow key={name.id}>
                      <TableCell>{theme?.name}</TableCell>
                      <TableCell>{subtheme?.name}</TableCell>
                      <TableCell>{category?.name}</TableCell>
                      <TableCell>{name.name}</TableCell>
                      <TableCell>
                        <IconButton
                          color="error"
                          onClick={() => handleDeleteName(name.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        {/* Dialogs */}
        <Dialog open={themeDialogOpen} onClose={() => setThemeDialogOpen(false)}>
          <DialogTitle>Add Theme</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Theme Name"
              fullWidth
              value={newItem.name}
              onChange={(e) => setNewItem({ name: e.target.value })}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setThemeDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleAddTheme}>Add</Button>
          </DialogActions>
        </Dialog>

        <Dialog
          open={subthemeDialogOpen}
          onClose={() => setSubthemeDialogOpen(false)}
        >
          <DialogTitle>Add Subtheme</DialogTitle>
          <DialogContent>
            <FormControl fullWidth sx={{ mt: 2 }}>
              <InputLabel>Theme</InputLabel>
              <Select
                value={selectedThemeId}
                label="Theme"
                onChange={(e: SelectChangeEvent<number>) =>
                  setSelectedThemeId(Number(e.target.value))
                }
              >
                {data?.themes.map((theme) => (
                  <MenuItem key={theme.id} value={theme.id}>
                    {theme.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              autoFocus
              margin="dense"
              label="Subtheme Name"
              fullWidth
              value={newItem.name}
              onChange={(e) => setNewItem({ name: e.target.value })}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setSubthemeDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleAddSubtheme}>Add</Button>
          </DialogActions>
        </Dialog>

        <Dialog
          open={categoryDialogOpen}
          onClose={() => setCategoryDialogOpen(false)}
        >
          <DialogTitle>Add Category</DialogTitle>
          <DialogContent>
            <FormControl fullWidth sx={{ mt: 2 }}>
              <InputLabel>Subtheme</InputLabel>
              <Select
                value={selectedSubthemeId}
                label="Subtheme"
                onChange={(e: SelectChangeEvent<number>) =>
                  setSelectedSubthemeId(Number(e.target.value))
                }
              >
                {data?.subthemes.map((subtheme) => (
                  <MenuItem key={subtheme.id} value={subtheme.id}>
                    {subtheme.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              autoFocus
              margin="dense"
              label="Category Name"
              fullWidth
              value={newItem.name}
              onChange={(e) => setNewItem({ name: e.target.value })}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setCategoryDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleAddCategory}>Add</Button>
          </DialogActions>
        </Dialog>

        <Dialog open={nameDialogOpen} onClose={() => setNameDialogOpen(false)}>
          <DialogTitle>Add Name</DialogTitle>
          <DialogContent>
            <FormControl fullWidth sx={{ mt: 2 }}>
              <InputLabel>Categories</InputLabel>
              <Select
                multiple
                value={selectedCategoryIds}
                label="Categories"
                onChange={(e: SelectChangeEvent<number[]>) =>
                  setSelectedCategoryIds(
                    typeof e.target.value === 'string'
                      ? [Number(e.target.value)]
                      : e.target.value.map(Number)
                  )
                }
              >
                {data?.categories.map((category) => (
                  <MenuItem key={category.id} value={category.id}>
                    {category.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              autoFocus
              margin="dense"
              label="Name"
              fullWidth
              value={newItem.name}
              onChange={(e) => setNewItem({ name: e.target.value })}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setNameDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleAddName}>Add</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  );
};

export default DataManagement; 