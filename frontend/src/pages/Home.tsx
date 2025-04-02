import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Paper,
  CircularProgress,
  SelectChangeEvent,
} from '@mui/material';
import { Theme, Subtheme, Category } from '../types';
import * as api from '../services/api';

const Home: React.FC = () => {
  const [themes, setThemes] = useState<Theme[]>([]);
  const [subthemes, setSubthemes] = useState<Subtheme[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedTheme, setSelectedTheme] = useState<string>('');
  const [selectedSubtheme, setSelectedSubtheme] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [randomName, setRandomName] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchThemes = async () => {
      try {
        const data = await api.getThemes();
        setThemes(data);
      } catch (error) {
        console.error('Error fetching themes:', error);
      }
    };
    fetchThemes();
  }, []);

  const handleThemeChange = async (event: SelectChangeEvent) => {
    const themeId = event.target.value;
    setSelectedTheme(themeId);
    setSelectedSubtheme('');
    setSelectedCategory('');
    setRandomName('');

    if (themeId) {
      try {
        const data = await api.getSubthemes(Number(themeId));
        setSubthemes(data);
      } catch (error) {
        console.error('Error fetching subthemes:', error);
      }
    }
  };

  const handleSubthemeChange = async (event: SelectChangeEvent) => {
    const subthemeId = event.target.value;
    setSelectedSubtheme(subthemeId);
    setSelectedCategory('');
    setRandomName('');

    if (subthemeId) {
      try {
        const data = await api.getCategories(Number(subthemeId));
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    }
  };

  const handleCategoryChange = (event: SelectChangeEvent) => {
    setSelectedCategory(event.target.value);
    setRandomName('');
  };

  const handleGetRandomName = async () => {
    if (!selectedCategory) return;

    setLoading(true);
    try {
      const data = await api.getRandomName(Number(selectedCategory));
      setRandomName(data.name || 'No names found for this category');
    } catch (error) {
      console.error('Error fetching random name:', error);
      setRandomName('Error fetching random name');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Name Generator
        </Typography>
        <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Theme</InputLabel>
            <Select value={selectedTheme} onChange={handleThemeChange} label="Theme">
              {themes.map((theme) => (
                <MenuItem key={theme.id} value={theme.id}>
                  {theme.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth sx={{ mb: 2 }} disabled={!selectedTheme}>
            <InputLabel>Subtheme</InputLabel>
            <Select
              value={selectedSubtheme}
              onChange={handleSubthemeChange}
              label="Subtheme"
            >
              {subthemes.map((subtheme) => (
                <MenuItem key={subtheme.id} value={subtheme.id}>
                  {subtheme.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth sx={{ mb: 3 }} disabled={!selectedSubtheme}>
            <InputLabel>Category</InputLabel>
            <Select
              value={selectedCategory}
              onChange={handleCategoryChange}
              label="Category"
            >
              {categories.map((category) => (
                <MenuItem key={category.id} value={category.id}>
                  {category.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Button
            fullWidth
            variant="contained"
            onClick={handleGetRandomName}
            disabled={!selectedCategory || loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Get Random Name'}
          </Button>

          {randomName && (
            <Box sx={{ mt: 3, textAlign: 'center' }}>
              <Typography variant="h5" component="div" gutterBottom>
                {randomName}
              </Typography>
              <Button
                variant="outlined"
                onClick={handleGetRandomName}
                disabled={loading}
                sx={{ mt: 1 }}
              >
                Get Another Name
              </Button>
            </Box>
          )}
        </Paper>
      </Box>
    </Container>
  );
};

export default Home; 