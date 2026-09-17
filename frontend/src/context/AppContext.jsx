import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import api from '../services/api';

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  const [plans, setPlans] = useState([]);
  const [plansLoading, setPlansLoading] = useState(false);
  const [crops, setCrops] = useState([]);
  const [users, setUsers] = useState([]);
  const [reports, setReports] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);
  const [weather, setWeather] = useState(null);
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [weatherError, setWeatherError] = useState('');

  const fetchPlans = useCallback(async () => {
    setPlansLoading(true);
    try {
      const { data } = await api.get('/api/plan');
      setPlans(data.plans || []);
      return data.plans || [];
    } finally {
      setPlansLoading(false);
    }
  }, []);

  const createPlan = useCallback(async (payload) => {
    const { data } = await api.post('/api/plan', payload);
    setPlans((currentPlans) => [data.plan, ...currentPlans]);
    return data.plan;
  }, []);

  const fetchPlanById = useCallback(async (planId) => {
    const { data } = await api.get(`/api/plan/${planId}`);
    return data.plan;
  }, []);

  const updatePlan = useCallback(async (planId, payload) => {
    const { data } = await api.put(`/api/plan/${planId}`, payload);
    setPlans((currentPlans) => currentPlans.map((plan) => plan._id === planId ? data.plan : plan));
    return data.plan;
  }, []);

  const deletePlan = useCallback(async (planId) => {
    await api.delete(`/api/plan/${planId}`);
    setPlans((currentPlans) => currentPlans.filter((plan) => plan._id !== planId));
  }, []);

  const toggleTask = useCallback(async (planId, taskId) => {
    const { data } = await api.patch(`/api/plan/${planId}/tasks/${taskId}`);
    setPlans((currentPlans) => currentPlans.map((plan) => plan._id === planId ? {
      ...plan,
      tasks: (plan.tasks || []).map((task) => task._id === taskId ? data.task : task),
    } : plan));
    return data.task;
  }, []);

  const fetchCrops = useCallback(async () => {
    const { data } = await api.get('/api/admin/crops');
    setCrops(data.crops || []);
  }, []);

  const createCrop = useCallback(async (payload) => {
    const { data } = await api.post('/api/admin/crops', payload);
    setCrops((currentCrops) => [...currentCrops, data.crop]);
    return data.crop;
  }, []);

  const deleteCrop = useCallback(async (cropId) => {
    await api.delete(`/api/admin/crops/${cropId}`);
    setCrops((currentCrops) => currentCrops.filter((crop) => crop._id !== cropId));
  }, []);

  const fetchUsers = useCallback(async () => {
    const { data } = await api.get('/api/admin/users');
    setUsers(data.users || []);
  }, []);

  const toggleBlockUser = useCallback(async (userId, isBlocked) => {
    const { data } = await api.patch(`/api/admin/users/${userId}/block`, { isBlocked: !isBlocked });
    setUsers((currentUsers) => currentUsers.map((user) => user._id === userId ? data.user : user));
  }, []);

  const fetchReports = useCallback(async () => {
    const { data } = await api.get('/api/admin/reports');
    setReports(data.reports || []);
  }, []);

  const reviewReport = useCallback(async (reportId, payload) => {
    const { data } = await api.patch(`/api/admin/reports/${reportId}/review`, payload);
    setReports((currentReports) => currentReports.map((report) => report._id === reportId ? data.report : report));
  }, []);

  const fetchAnalytics = useCallback(async () => {
    setAnalyticsLoading(true);
    try {
      const { data } = await api.get('/api/admin/analytics');
      setAnalytics(data);
      return data;
    } finally {
      setAnalyticsLoading(false);
    }
  }, []);

  const fetchSeasonalWeather = useCallback(async (coordinates) => {
    setWeatherLoading(true);
    setWeatherError('');
    try {
      const { data } = await api.get('/api/weather/seasonal', { params: coordinates });
      setWeather(data);
      return data;
    } catch (error) {
      setWeatherError(error.response?.data?.message || 'Weather data is temporarily unavailable.');
      throw error;
    } finally {
      setWeatherLoading(false);
    }
  }, []);

  const searchLocations = useCallback(async (name) => {
    setWeatherError('');
    const { data } = await api.get('/api/weather/geocode', { params: { name } });
    const locations = data.locations || [];
    if (!locations.length) {
      setWeatherError(`No location found for "${name}".`);
    }
    return locations;
  }, []);

  const value = useMemo(() => ({
    plans, plansLoading, fetchPlans, createPlan, fetchPlanById, updatePlan, deletePlan, toggleTask,
    crops, fetchCrops, createCrop, deleteCrop,
    users, fetchUsers, toggleBlockUser,
    reports, fetchReports, reviewReport,
    analytics,
    analyticsLoading,
    fetchAnalytics,
    weather,
    weatherLoading,
    weatherError,
    fetchSeasonalWeather,
    searchLocations,
  }), [plans, plansLoading, fetchPlans, createPlan, fetchPlanById, updatePlan, deletePlan, toggleTask, crops, fetchCrops, createCrop, deleteCrop, users, fetchUsers, toggleBlockUser, reports, fetchReports, reviewReport, analytics, analyticsLoading, fetchAnalytics, weather, weatherLoading, weatherError, fetchSeasonalWeather, searchLocations]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => useContext(AppContext);
