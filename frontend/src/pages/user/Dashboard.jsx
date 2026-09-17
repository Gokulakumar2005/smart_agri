import { useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { useApp } from '../../context/AppContext';

const Dashboard = () => {
  const { user } = useAuth();
  const { t, content } = useLanguage();
  const { plans, plansLoading, fetchPlans } = useApp();

  useEffect(() => {
    fetchPlans();
  }, [fetchPlans]);

  if (plansLoading) return <div className="p-8 text-center">{t('loadingDashboard')}</div>;

  return (
    <div className="space-y-6">
      <section className="card p-6">
        <p className="text-sm uppercase tracking-[0.2em] text-stone-500">{t('farmerOverview')}</p>
        <h1 className="mt-2 text-3xl font-bold text-forest">{t('welcome')}, {user?.name}</h1>
        <p className="mt-2 text-stone-600">{t('farmerDescription')}</p>
      </section>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="card p-5">
          <p className="text-sm text-stone-500">{t('activeCropCycles')}</p>
          <p className="mt-3 text-3xl font-bold text-forest">{plans.length}</p>
        </div>
        <div className="card p-5">
          <p className="text-sm text-stone-500">{t('upcomingAlerts')}</p>
          <p className="mt-3 text-3xl font-bold text-accent">3</p>
        </div>
        <div className="card p-5">
          <p className="text-sm text-stone-500">{t('plansGenerated')}</p>
          <p className="mt-3 text-3xl font-bold text-leaf">{plans.length}</p>
        </div>
      </div>

      <section className="card p-6">
        <h2 className="mb-4 text-xl font-bold text-forest">{t('recentCropActivity')}</h2>
        {plans.length === 0 ? (
          <p className="text-stone-600">{t('noPlans')}</p>
        ) : (
          <div className="space-y-3">
            {plans.map((plan) => (
              <div key={plan._id} className="rounded-xl border border-stone-200 bg-stone-50 p-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-forest">{content(plan.cropName) || t('cropPlan')}</h3>
                  <span className="badge bg-emerald-100 text-emerald-700">{plan.status}</span>
                </div>
                <p className="mt-1 text-sm text-stone-600">{t('plantingDate')}: {new Date(plan.plantingDate).toLocaleDateString()}</p>
                <p className="mt-1 text-sm text-stone-600">{t('expectedHarvest')}: {new Date(plan.expectedHarvestDate).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Dashboard;
