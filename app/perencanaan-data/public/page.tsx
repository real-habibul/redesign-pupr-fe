'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Alert,
  TextField,
  MenuItem,
  Chip,
  Avatar
} from '@mui/material';
import { Refresh, Download, FilterList } from '@mui/icons-material';
import axios from 'axios';

interface OrganizationSettings {
  name: string;
  type: string;
  region_code: string;
  logo_url: string;
}

interface Province {
  id_province: string;
  province_name: string;
  cities: {
    cities_id: string;
    cities_name: string;
  }[];
}

interface PerencanaanDataItem {
  id: number;
  region_code: string;
  period_year: number;
  city_code: string;
  status: string;
  created_at: string;
  informasi_umum?: {
    nama_paket: string;
    nama_ppk: string;
    nama_balai: string;
  };
}

interface ApiResponse {
  status: string;
  message: string;
  data: {
    data: PerencanaanDataItem[];
    current_page: number;
    last_page: number;
    total: number;
  };
  filters: {
    region: string;
    period: string;
    city: string;
  };
}

export default function PublicPerencanaanDataPage() {
  const [orgSettings, setOrgSettings] = useState<OrganizationSettings | null>(null);
  const [perencanaanData, setPerencanaanData] = useState<PerencanaanDataItem[]>([]);
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  
  // Filters
  const [periodFilter, setPeriodFilter] = useState<string>('2025');
  const [cityFilter, setCityFilter] = useState<string>('');
  const [provinceFilter, setProvinceFilter] = useState<string>('');
  
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

  // Fetch organization settings
  const fetchOrgSettings = useCallback(async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/settings/public`);
      if (response.data.status === 'success') {
        setOrgSettings(response.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch organization settings:', err);
    }
  }, [API_BASE_URL]);

  // Fetch provinces and cities
  const fetchProvinces = useCallback(async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/provinces-and-cities`);
      if (response.data.status === 'success') {
        setProvinces(response.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch provinces:', err);
    }
  }, [API_BASE_URL]);

  // Fetch perencanaan data
  const fetchPerencanaanData = useCallback(async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (periodFilter) params.append('period', periodFilter);
      if (cityFilter) params.append('city', cityFilter);
      
      // Use provinceFilter if selected, otherwise use orgSettings region_code
      const regionCode = provinceFilter || orgSettings?.region_code;
      if (regionCode) params.append('region', regionCode);

      const response = await axios.get<ApiResponse>(`${API_BASE_URL}/api/perencanaan-data/?${params}`);
      
      if (response.data.status === 'success') {
        setPerencanaanData(response.data.data.data);
      } else {
        setError(response.data.message);
      }
    } catch (err: unknown) {
      const errorMessage = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to fetch data';
      setError(errorMessage);
      console.error('Failed to fetch perencanaan data:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [periodFilter, cityFilter, provinceFilter, orgSettings?.region_code, API_BASE_URL]);

  // Refresh data
  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    fetchPerencanaanData(false);
  }, [fetchPerencanaanData]);

  // Initial load
  useEffect(() => {
    const loadData = async () => {
      await fetchOrgSettings();
      await fetchProvinces();
    };
    loadData();
  }, [fetchOrgSettings, fetchProvinces]);

  // Load perencanaan data when org settings are available
  useEffect(() => {
    if (orgSettings) {
      fetchPerencanaanData();
    }
  }, [orgSettings, fetchPerencanaanData]);

  const getStatusChip = (status: string) => {
    const statusConfig = {
      'draft': { color: 'default' as const, label: 'Draft' },
      'review': { color: 'warning' as const, label: 'Review' },
      'approved': { color: 'success' as const, label: 'Approved' },
      'completed': { color: 'primary' as const, label: 'Completed' }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.draft;
    return <Chip size="small" color={config.color} label={config.label} />;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading && !orgSettings) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Header with Branding */}
      <Card sx={{ mb: 4, background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)', color: 'white' }}>
        <CardContent>
          <Box display="flex" alignItems="center" gap={2}>
            <Avatar
              src={orgSettings?.logo_url}
              sx={{ width: 64, height: 64, bgcolor: 'white' }}
            >
              {orgSettings?.name?.charAt(0)}
            </Avatar>
            <Box>
              <Typography variant="h4" component="h1" fontWeight="bold">
                {orgSettings?.name || 'E-Katalog SIPASTI'}
              </Typography>
              <Typography variant="h6" sx={{ opacity: 0.9 }}>
                Data Perencanaan {orgSettings?.type ? orgSettings.type.charAt(0).toUpperCase() + orgSettings.type.slice(1) : 'Daerah'}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                Region: {provinceFilter ? 
                  provinces.find(p => p.id_province === provinceFilter)?.province_name || provinceFilter.toUpperCase() :
                  orgSettings?.region_code?.toUpperCase() || 'Default'}
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box display="flex" alignItems="center" gap={2} mb={2}>
            <FilterList />
            <Typography variant="h6">Filter Data</Typography>
          </Box>
          <Box display="flex" flexWrap="wrap" gap={2} alignItems="center">
            <Box flex="1" minWidth="200px">
              <TextField
                fullWidth
                select
                label="Provinsi"
                value={provinceFilter}
                onChange={(e) => setProvinceFilter(e.target.value)}
                size="small"
              >
                <MenuItem value="">
                  {orgSettings?.region_code ? `Default (${orgSettings.region_code.toUpperCase()})` : 'Pilih Provinsi'}
                </MenuItem>
                {provinces.map((province) => (
                  <MenuItem key={province.id_province} value={province.id_province}>
                    {province.province_name}
                  </MenuItem>
                ))}
              </TextField>
            </Box>
            <Box flex="1" minWidth="200px">
              <TextField
                fullWidth
                select
                label="Periode"
                value={periodFilter}
                onChange={(e) => setPeriodFilter(e.target.value)}
                size="small"
              >
                <MenuItem value="">Semua Periode</MenuItem>
                <MenuItem value="2024">2024</MenuItem>
                <MenuItem value="2025">2025</MenuItem>
                <MenuItem value="2026">2026</MenuItem>
              </TextField>
            </Box>
            <Box flex="1" minWidth="200px">
              <TextField
                fullWidth
                label="Kode Kota"
                value={cityFilter}
                onChange={(e) => setCityFilter(e.target.value)}
                size="small"
                placeholder="e.g., 3301"
              />
            </Box>
            <Box>
              <Button
                variant="outlined"
                startIcon={<Refresh />}
                onClick={handleRefresh}
                disabled={refreshing}
                fullWidth
              >
                {refreshing ? 'Refreshing...' : 'Refresh'}
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Data Table */}
      <Card>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6">Data Perencanaan</Typography>
            <Box display="flex" gap={1}>
              <Button
                variant="outlined"
                startIcon={<Download />}
                size="small"
              >
                Export
              </Button>
              <Button
                variant="contained"
                startIcon={<Refresh />}
                onClick={handleRefresh}
                disabled={refreshing}
                size="small"
              >
                Refresh
              </Button>
            </Box>
          </Box>

          {loading ? (
            <Box display="flex" justifyContent="center" p={4}>
              <CircularProgress />
            </Box>
          ) : (
            <TableContainer component={Paper} elevation={0}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell><strong>No</strong></TableCell>
                    <TableCell><strong>Nama Paket</strong></TableCell>
                    <TableCell><strong>PPK</strong></TableCell>
                    <TableCell><strong>Balai</strong></TableCell>
                    <TableCell><strong>Periode</strong></TableCell>
                    <TableCell><strong>Kota</strong></TableCell>
                    <TableCell><strong>Status</strong></TableCell>
                    <TableCell><strong>Tanggal</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {perencanaanData.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                        <Typography color="text.secondary">
                          Tidak ada data perencanaan ditemukan
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    perencanaanData.map((item, index) => (
                      <TableRow key={item.id} hover>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>
                          <Typography variant="body2" fontWeight="medium">
                            {item.informasi_umum?.nama_paket || '-'}
                          </Typography>
                        </TableCell>
                        <TableCell>{item.informasi_umum?.nama_ppk || '-'}</TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {item.informasi_umum?.nama_balai || '-'}
                          </Typography>
                        </TableCell>
                        <TableCell>{item.period_year}</TableCell>
                        <TableCell>{item.city_code || '-'}</TableCell>
                        <TableCell>{getStatusChip(item.status)}</TableCell>
                        <TableCell>
                          <Typography variant="body2" color="text.secondary">
                            {formatDate(item.created_at)}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>

      {/* Footer */}
      <Box mt={4} textAlign="center">
        <Typography variant="body2" color="text.secondary">
          © 2025 {orgSettings?.name || 'E-Katalog SIPASTI'} - Template Replikasi Perencanaan Data
        </Typography>
      </Box>
    </Container>
  );
}
