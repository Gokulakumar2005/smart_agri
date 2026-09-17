import { useEffect, useState } from 'react';
import api from '../../services/api';

const AdminDashboard = () => {
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const { data } = await api.get('/api/admin/analytics');
        setAnalytics(data);
      } catch (error) {
        console.error('Analytics fetch failed:', error);
      }
    };

    fetchAnalytics();
  }, []);

  if (!analytics) return <div className="p-8 text-center">Loading admin dashboard...</div>;

  return (
    <div className="space-y-6">
      <section className="card p-6">
        <p className="text-sm uppercase tracking-[0.2em] text-stone-500">Operations overview</p>
        <h1 className="mt-2 text-3xl font-bold text-forest">Admin dashboard</h1>
      </section>

      <div className="grid gap-4 md:grid-cols-4">
        <div className="card p-5"><p className="text-sm text-stone-500">Total users</p><p className="mt-2 text-3xl font-bold text-forest">{analytics.totalUsers || 0}</p></div>
        <div className="card p-5"><p className="text-sm text-stone-500">Plans generated</p><p className="mt-2 text-3xl font-bold text-leaf">{analytics.totalPlans || 0}</p></div>
        <div className="card p-5"><p className="text-sm text-stone-500">Most grown crop</p><p className="mt-2 text-xl font-bold text-accent">{analytics.mostGrownCrops?.[0]?.crop || 'N/A'}</p></div>
        <div className="card p-5"><p className="text-sm text-stone-500">Common issue</p><p className="mt-2 text-xl font-bold text-soil">{analytics.commonPlantHealthIssues?.[0]?.issue || 'N/A'}</p></div>
      </div>
    </div>
  );
};

export default AdminDashboard;
