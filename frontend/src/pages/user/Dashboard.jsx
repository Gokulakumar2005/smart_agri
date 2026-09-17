import { useEffect, useState } from 'react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const { data } = await api.get('/api/plan');
        setPlans(data.plans || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchPlans();
  }, []);

  if (loading) return <div className="p-8 text-center">Loading dashboard...</div>;

  return (
    <div className="space-y-6">
      <section className="card p-6">
        <p className="text-sm uppercase tracking-[0.2em] text-stone-500">Farmer overview</p>
        <h1 className="mt-2 text-3xl font-bold text-forest">Welcome, {user?.name}</h1>
        <p className="mt-2 text-stone-600">Your farm dashboard keeps track of crop cycles, upcoming tasks, and weather-aware irrigation actions.</p>
      </section>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="card p-5">
          <p className="text-sm text-stone-500">Active crop cycles</p>
          <p className="mt-3 text-3xl font-bold text-forest">{plans.length}</p>
        </div>
        <div className="card p-5">
          <p className="text-sm text-stone-500">Upcoming alerts</p>
          <p className="mt-3 text-3xl font-bold text-accent">3</p>
        </div>
        <div className="card p-5">
          <p className="text-sm text-stone-500">Plans generated</p>
          <p className="mt-3 text-3xl font-bold text-leaf">{plans.length}</p>
        </div>
      </div>

      <section className="card p-6">
        <h2 className="mb-4 text-xl font-bold text-forest">Recent crop activity</h2>
        {plans.length === 0 ? (
          <p className="text-stone-600">No crop plans yet. Create a new plan from the crop form.</p>
        ) : (
          <div className="space-y-3">
            {plans.map((plan) => (
              <div key={plan._id} className="rounded-xl border border-stone-200 bg-stone-50 p-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-forest">{plan.cropName || 'Crop plan'}</h3>
                  <span className="badge bg-emerald-100 text-emerald-700">{plan.status}</span>
                </div>
                <p className="mt-1 text-sm text-stone-600">Planting date: {new Date(plan.plantingDate).toLocaleDateString()}</p>
                <p className="mt-1 text-sm text-stone-600">Expected harvest: {new Date(plan.expectedHarvestDate).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Dashboard;
