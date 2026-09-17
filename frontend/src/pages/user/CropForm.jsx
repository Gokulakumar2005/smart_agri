import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { useApp } from '../../context/AppContext';
import { toast } from 'react-toastify';

const cropOptions = ['Paddy', 'Banana', 'Tomato'];

const CropForm = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { t } = useLanguage();
  const { createPlan, updatePlan } = useApp();
  const editingPlan = state?.editPlan;
  const [form, setForm] = useState(() => editingPlan ? {
    cropName: editingPlan.cropName || 'Paddy',
    soilType: editingPlan.soilType || 'Loam',
    irrigationMethod: editingPlan.irrigationMethod || 'Drip',
    farmingPractice: editingPlan.farmingPractice || 'conventional',
    plantingDate: new Date(editingPlan.plantingDate).toISOString().slice(0, 10),
  } : {
    cropName: 'Paddy', soilType: 'Loam', irrigationMethod: 'Drip', farmingPractice: 'conventional', plantingDate: new Date().toISOString().slice(0, 10),
  });
  const [error, setError] = useState('');

  const handleChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const plan = editingPlan ? await updatePlan(editingPlan._id, form) : await createPlan(form);
      toast.success(editingPlan ? 'Cultivation plan updated.' : 'Cultivation plan created.');
      navigate(`/plans/${plan._id}`, { state: { plan } });
    } catch (err) {
      const message = err.response?.data?.message || t('unablePlan');
      setError(message);
      toast.error(message);
    }
  };

  return (
    <div className="mx-auto max-w-3xl card p-6">
      <h1 className="text-2xl font-bold text-forest">{editingPlan ? t('editPlan') : t('createPlan')}</h1>
      <form onSubmit={handleSubmit} className="mt-6 grid gap-5 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium">{t('crop')}</label>
          <select name="cropName" value={form.cropName} onChange={handleChange} className="w-full rounded-lg border border-stone-300 p-3">
            {cropOptions.map((crop) => <option key={crop} value={crop}>{crop}</option>)}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">{t('soilType')}</label>
          <select name="soilType" value={form.soilType} onChange={handleChange} className="w-full rounded-lg border border-stone-300 p-3">
            <option>Loam</option>
            <option>Clay loam</option>
            <option>Sandy loam</option>
            <option>Silt loam</option>
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">{t('plantingDate')}</label>
          <input type="date" name="plantingDate" value={form.plantingDate} onChange={handleChange} className="w-full rounded-lg border border-stone-300 p-3" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">{t('irrigationMethod')}</label>
          <select name="irrigationMethod" value={form.irrigationMethod} onChange={handleChange} className="w-full rounded-lg border border-stone-300 p-3">
            <option>Drip</option>
            <option>Sprinkler</option>
            <option>Flood</option>
          </select>
        </div>
        <div className="md:col-span-2">
          <label className="mb-1 block text-sm font-medium">{t('farmingPractice')}</label>
          <select name="farmingPractice" value={form.farmingPractice} onChange={handleChange} className="w-full rounded-lg border border-stone-300 p-3">
            <option value="conventional">{t('conventional')}</option>
            <option value="organic">{t('organic')}</option>
            <option value="natural">{t('natural')}</option>
          </select>
        </div>
        {error && <p className="md:col-span-2 text-sm text-red-600">{error}</p>}
        <button type="submit" className="md:col-span-2 rounded-lg bg-forest px-4 py-3 font-semibold text-white">{editingPlan ? t('editPlan') : t('generatePlan')}</button>
      </form>
    </div>
  );
};

export default CropForm;
