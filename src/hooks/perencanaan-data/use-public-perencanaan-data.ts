import { useState, useEffect, useCallback } from 'react';
import {
  getPublicPerencanaanData,
  getOrganizationSettings,
  getProvincesAndCities,
  exportPublicPerencanaanData,
} from '../../lib/api/perencanaan-data/public-perencanaan-data';
import type {
  PublicPerencanaanDataItem,
  OrganizationSettings,
  Province,
} from '../../types/perencanaan-data/public-perencanaan-data';

interface UsePublicPerencanaanDataFilters {
  region?: string;
  period?: string;
  city?: string;
  search?: string;
}

export function usePublicPerencanaanData() {
  // Data states
  const [orgSettings, setOrgSettings] = useState<OrganizationSettings | null>(null);
  const [perencanaanData, setPerencanaanData] = useState<PublicPerencanaanDataItem[]>([]);
  const [provinces, setProvinces] = useState<Province[]>([]);
  
  // Loading states
  const [isLoadingSettings, setIsLoadingSettings] = useState(true);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [isLoadingProvinces, setIsLoadingProvinces] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  
  // Error state
  const [error, setError] = useState<string | null>(null);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  
  // Filters
  const [filters, setFilters] = useState<UsePublicPerencanaanDataFilters>({
    period: '2025',
  });

  // Fetch organization settings
  const fetchOrgSettings = useCallback(async () => {
    try {
      setIsLoadingSettings(true);
      const data = await getOrganizationSettings();
      setOrgSettings(data);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch organization settings:', err);
      setError('Failed to load organization settings');
    } finally {
      setIsLoadingSettings(false);
    }
  }, []);

  // Fetch provinces
  const fetchProvinces = useCallback(async () => {
    try {
      setIsLoadingProvinces(true);
      const data = await getProvincesAndCities();
      setProvinces(data);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch provinces:', err);
      setError('Failed to load provinces');
    } finally {
      setIsLoadingProvinces(false);
    }
  }, []);

  // Fetch perencanaan data
  const fetchPerencanaanData = useCallback(async (page = 1) => {
    try {
      setIsLoadingData(true);
      
      const params = {
        ...filters,
        page,
        per_page: 10,
        region: filters.region || orgSettings?.region_code,
      };

      const response = await getPublicPerencanaanData(params);
      
      if (response.status === 'success') {
        setPerencanaanData(response.data.data);
        setCurrentPage(response.data.current_page);
        setTotalPages(response.data.last_page);
        setTotalItems(response.data.total);
        setError(null);
      } else {
        setError(response.message);
      }
    } catch (err) {
      console.error('Failed to fetch perencanaan data:', err);
      setError('Failed to load perencanaan data');
    } finally {
      setIsLoadingData(false);
      setIsRefreshing(false);
    }
  }, [filters, orgSettings?.region_code]);

  // Refresh data
  const refresh = useCallback(() => {
    setIsRefreshing(true);
    fetchPerencanaanData(currentPage);
  }, [fetchPerencanaanData, currentPage]);

  // Export data
  const exportData = useCallback(async () => {
    try {
      setIsExporting(true);
      
      const params = {
        ...filters,
        region: filters.region || orgSettings?.region_code,
        format: 'csv', // Add CSV format parameter
      };

      const blob = await exportPublicPerencanaanData(params);
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `perencanaan-data-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
    } catch (err) {
      console.error('Failed to export data:', err);
      setError('Failed to export data');
    } finally {
      setIsExporting(false);
    }
  }, [filters, orgSettings?.region_code]);

  // Update filters
  const updateFilters = useCallback((newFilters: Partial<UsePublicPerencanaanDataFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    setCurrentPage(1);
  }, []);

  // Load initial data
  useEffect(() => {
    fetchOrgSettings();
    fetchProvinces();
  }, [fetchOrgSettings, fetchProvinces]);

  // Load perencanaan data when settings are available or filters change
  useEffect(() => {
    if (orgSettings) {
      fetchPerencanaanData(1);
    }
  }, [orgSettings, filters, fetchPerencanaanData]);

  return {
    // Data
    orgSettings,
    perencanaanData,
    provinces,
    
    // Loading states
    isLoadingSettings,
    isLoadingData,
    isLoadingProvinces,
    isRefreshing,
    isExporting,
    
    // Error
    error,
    setError,
    
    // Pagination
    currentPage,
    totalPages,
    totalItems,
    setCurrentPage,
    
    // Filters
    filters,
    updateFilters,
    
    // Actions
    refresh,
    exportData,
    fetchPerencanaanData,
  };
}
