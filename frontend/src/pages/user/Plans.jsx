import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { useApp } from '../../context/AppContext';
import { toast } from 'react-toastify';
import { showToastConfirm } from '../../components/ToastConfirm';

const Plans = () => {
  const navigate = useNavigate();
  const { t, content } = useLanguage();
  const { plans, plansLoading, fetchPlans, deletePlan } = useApp();

  useEffect(() => {
    fetchPlans();
  }, [fetchPlans]);

  const handleDelete = (planId) => {
    showToastConfirm({
      message: t('confirmDeletePlan'),
      onConfirm: async () => {
        try {
          await deletePlan(planId);
          toast.success('Cultivation plan deleted.');
        } catch (error) {
          toast.error(error.response?.data?.message || 'Unable to delete the plan.');
        }
      },
    });
  };

  if (plansLoading && !plans.length) {
    return <div className="card p-8 text-center text-stone-600">{t('loadingPlan')}</div>;
  }

  return (
    <div className="space-y-6">
      <section className="card flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-stone-500">{t('plans')}</p>
          <h1 className="mt-2 text-3xl font-bold text-forest">{t('plansGenerated')}</h1>
          <p className="mt-2 text-stone-600">Manage your saved cultivation plans from one place.</p>
        </div>
        <button type="button" onClick={() => navigate('/crop-form')} className="rounded-lg bg-forest px-4 py-3 font-semibold text-white">{t('createPlan')}</button>
      </section>

      {!plans.length ? (
        <div className="card p-8 text-center text-stone-600">{t('noSavedPlans')}</div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {plans.map((plan) => (
            <article key={plan._id} className="card p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-forest">{content(plan.cropName || t('cropPlan'))}</h2>
                  <p className="mt-1 text-sm text-stone-500">{plan.status || 'active'}</p>
                </div>
                <span className="badge bg-emerald-100 text-emerald-700">{plan.irrigationMethod || 'Drip'}</span>
              </div>
              <div className="mt-4 grid gap-2 text-sm text-stone-700 sm:grid-cols-2">
                <p>{t('plantingDate')}: {new Date(plan.plantingDate).toLocaleDateString()}</p>
                <p>{t('expectedHarvest')}: {new Date(plan.expectedHarvestDate).toLocaleDateString()}</p>
                <p>{t('soilType')}: {content(plan.soilType)}</p>
                <p>{t('farmingPractice')}: {content(plan.farmingPractice)}</p>
              </div>
              <div className="mt-5 flex flex-wrap gap-2">
                <button type="button" onClick={() => navigate(`/plans/${plan._id}`, { state: { plan } })} className="rounded-lg bg-forest px-3 py-2 text-sm font-semibold text-white">{t('viewPlan')}</button>
                <button type="button" onClick={() => navigate('/crop-form', { state: { editPlan: plan } })} className="rounded-lg border border-forest px-3 py-2 text-sm font-semibold text-forest">{t('editPlan')}</button>
                <button type="button" onClick={() => handleDelete(plan._id)} className="rounded-lg bg-red-600 px-3 py-2 text-sm font-semibold text-white">{t('deletePlan')}</button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};

export default Plans;
