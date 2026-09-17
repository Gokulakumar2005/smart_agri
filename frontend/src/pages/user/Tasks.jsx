import { useEffect, useMemo, useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useApp } from '../../context/AppContext';
import { toast } from 'react-toastify';

const categoryKey = { land: 'landTask', fertilizer: 'fertilizerTask', irrigation: 'irrigationTask', maintenance: 'maintenanceTask' };

const Tasks = () => {
  const { t, content } = useLanguage();
  const { plans, plansLoading, fetchPlans, toggleTask } = useApp();
  const [selectedPlanId, setSelectedPlanId] = useState('');

  useEffect(() => { fetchPlans(); }, [fetchPlans]);
  useEffect(() => { if (!selectedPlanId && plans[0]) setSelectedPlanId(plans[0]._id); }, [plans, selectedPlanId]);

  const selectedPlan = plans.find((plan) => plan._id === selectedPlanId);
  const groups = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tasks = [...(selectedPlan?.tasks || [])].sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
    return {
      overdue: tasks.filter((task) => new Date(task.dueDate) < today),
      today: tasks.filter((task) => { const date = new Date(task.dueDate); return date.toDateString() === today.toDateString(); }),
      upcoming: tasks.filter((task) => new Date(task.dueDate) > today),
    };
  }, [selectedPlan]);

  const handleToggle = async (task) => {
    try {
      await toggleTask(selectedPlanId, task._id);
      toast.success(task.completed ? 'Task marked incomplete.' : 'Task completed.');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to update task.');
    }
  };

  const renderGroup = (title, tasks) => (
    <section className="card p-5">
      <h2 className="text-lg font-bold text-forest">{title}</h2>
      <div className="mt-4 space-y-3">
        {!tasks.length ? <p className="text-sm text-stone-500">{t('noTasks')}</p> : tasks.map((task) => (
          <label key={task._id} className={`flex cursor-pointer gap-3 rounded-lg border p-4 ${task.completed ? 'border-emerald-200 bg-emerald-50' : 'border-stone-200 bg-stone-50'}`}>
            <input type="checkbox" checked={task.completed} onChange={() => handleToggle(task)} className="mt-1 h-5 w-5 accent-emerald-700" />
            <span className="min-w-0 flex-1">
              <span className="flex flex-wrap items-center justify-between gap-2">
                <span className={`font-semibold ${task.completed ? 'text-emerald-800 line-through' : 'text-forest'}`}>{content(task.title)}</span>
                <span className="text-xs text-stone-500">{new Date(task.dueDate).toLocaleDateString()}</span>
              </span>
              <span className="mt-1 block text-xs font-semibold uppercase tracking-wide text-leaf">{t(categoryKey[task.category] || 'tasks')}</span>
              <span className="mt-1 block text-sm text-stone-600">{content(task.details)}</span>
            </span>
          </label>
        ))}
      </div>
    </section>
  );

  if (plansLoading && !plans.length) return <div className="card p-8 text-center">{t('loadingPlan')}</div>;
  return (
    <div className="space-y-6">
      <section className="card p-6">
        <p className="text-sm uppercase tracking-[0.2em] text-stone-500">{t('tasks')}</p>
        <h1 className="mt-2 text-3xl font-bold text-forest">{t('taskProgress')}</h1>
        {plans.length ? <select value={selectedPlanId} onChange={(event) => setSelectedPlanId(event.target.value)} className="mt-5 w-full max-w-md rounded-lg border border-stone-300 bg-white p-3">
          {plans.map((plan) => <option key={plan._id} value={plan._id}>{content(plan.cropName)} - {new Date(plan.plantingDate).toLocaleDateString()}</option>)}
        </select> : null}
      </section>
      {!selectedPlan ? <div className="card p-8 text-center text-stone-600">{t('noSavedPlans')}</div> : <>
        {renderGroup(t('overdue'), groups.overdue)}
        {renderGroup(t('today'), groups.today)}
        {renderGroup(t('upcoming'), groups.upcoming)}
      </>}
    </div>
  );
};

export default Tasks;