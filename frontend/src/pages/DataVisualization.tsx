import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  Paper,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
} from '@mui/material';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';
import { AllData } from '../types';
import * as api from '../services/api';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const DataVisualization: React.FC = () => {
  const [data, setData] = useState<AllData | null>(null);
  const [selectedTheme, setSelectedTheme] = useState<string>('');

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

  const handleThemeChange = (event: SelectChangeEvent) => {
    setSelectedTheme(event.target.value);
  };

  const getThemeDistributionData = () => {
    if (!data) return null;

    const themeData = data.themes.map((theme) => {
      const subthemes = data.subthemes.filter((s) => s.theme_id === theme.id);
      const categories = subthemes.flatMap((s) =>
        data.categories.filter((c) => c.subtheme_id === s.id)
      );
      const nameCount = new Set(
        categories.flatMap((c) =>
          data.nameCategories
            .filter((nc) => nc.category_id === c.id)
            .map((nc) => nc.name_id)
        )
      ).size;

      return {
        theme: theme.name,
        nameCount,
      };
    });

    return {
      labels: themeData.map((d) => d.theme),
      datasets: [
        {
          label: 'Number of Names',
          data: themeData.map((d) => d.nameCount),
          backgroundColor: 'rgba(54, 162, 235, 0.5)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1,
        },
      ],
    };
  };

  const getSelectedThemeData = () => {
    if (!data || !selectedTheme) return null;

    const theme = data.themes.find((t) => t.id === Number(selectedTheme));
    if (!theme) return null;

    const subthemes = data.subthemes.filter((s) => s.theme_id === theme.id);
    const subthemeData = subthemes.map((subtheme) => {
      const categories = data.categories.filter(
        (c) => c.subtheme_id === subtheme.id
      );
      const nameCount = new Set(
        categories.flatMap((c) =>
          data.nameCategories
            .filter((nc) => nc.category_id === c.id)
            .map((nc) => nc.name_id)
        )
      ).size;

      return {
        subtheme: subtheme.name,
        nameCount,
      };
    });

    return {
      labels: subthemeData.map((d) => d.subtheme),
      datasets: [
        {
          data: subthemeData.map((d) => d.nameCount),
          backgroundColor: [
            'rgba(255, 99, 132, 0.5)',
            'rgba(54, 162, 235, 0.5)',
            'rgba(255, 206, 86, 0.5)',
            'rgba(75, 192, 192, 0.5)',
            'rgba(153, 102, 255, 0.5)',
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
          ],
          borderWidth: 1,
        },
      ],
    };
  };

  const themeDistributionData = getThemeDistributionData();
  const selectedThemeData = getSelectedThemeData();

  return (
    <Container>
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Data Visualization
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Name Distribution by Theme
              </Typography>
              {themeDistributionData && (
                <Bar
                  data={themeDistributionData}
                  options={{
                    responsive: true,
                    plugins: {
                      legend: {
                        position: 'top' as const,
                      },
                    },
                  }}
                />
              )}
            </Paper>
          </Grid>

          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Box sx={{ mb: 3 }}>
                <FormControl fullWidth>
                  <InputLabel>Select Theme</InputLabel>
                  <Select
                    value={selectedTheme}
                    onChange={handleThemeChange}
                    label="Select Theme"
                  >
                    {data?.themes.map((theme) => (
                      <MenuItem key={theme.id} value={theme.id}>
                        {theme.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>

              {selectedThemeData && (
                <>
                  <Typography variant="h6" gutterBottom>
                    Name Distribution by Subtheme
                  </Typography>
                  <Box sx={{ height: 400 }}>
                    <Pie
                      data={selectedThemeData}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            position: 'right' as const,
                          },
                        },
                      }}
                    />
                  </Box>
                </>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default DataVisualization; 