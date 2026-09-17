import { useEffect, useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useApp } from '../../context/AppContext';
import { toast } from 'react-toastify';

const initialForm = { name: '', suitableSoilTypes: 'Loam', growthDurationDays: 120 };

const AdminCrops = () => {
  const { t, content } = useLanguage();
  const { crops, fetchCrops, createCrop, deleteCrop } = useApp();
  const [form, setForm] = useState(initialForm);

  useEffect(() => {
    fetchCrops();
  }, [fetchCrops]);

  const handleChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleCreate = async (e) => {
    e.preventDefault();
    const payload = { ...form, suitableSoilTypes: [form.suitableSoilTypes] };
    try {
      await createCrop(payload);
      setForm(initialForm);
      toast.success('Crop added successfully.');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to add crop.');
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteCrop(id);
      toast.success('Crop deleted successfully.');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to delete crop.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="card p-6">
        <h1 className="text-2xl font-bold text-forest">{t('cropKnowledge')}</h1>
        <form onSubmit={handleCreate} className="mt-5 grid gap-4 md:grid-cols-3">
          <input className="rounded-lg border border-stone-300 p-3" name="name" value={form.name} onChange={handleChange} placeholder={t('cropName')} required />
          <input className="rounded-lg border border-stone-300 p-3" name="suitableSoilTypes" value={form.suitableSoilTypes} onChange={handleChange} placeholder={t('soilType')} required />
          <input className="rounded-lg border border-stone-300 p-3" type="number" name="growthDurationDays" value={form.growthDurationDays} onChange={handleChange} placeholder={t('durationDays')} required />
          <button type="submit" className="md:col-span-3 rounded-lg bg-forest px-4 py-3 font-semibold text-white">{t('addCrop')}</button>
        </form>
      </div>

      <div className="card p-6">
        <h2 className="text-xl font-bold text-forest">{t('existingCrops')}</h2>
        <div className="mt-4 space-y-3">
          {crops.map((crop) => (
            <div key={crop._id} className="flex items-center justify-between rounded-xl border border-stone-200 bg-stone-50 p-4">
              <div>
                <p className="font-semibold text-forest">{content(crop.name)}</p>
                <p className="text-sm text-stone-600">{crop.suitableSoilTypes?.map((soil) => content(soil)).join(', ')}</p>
              </div>
              <button onClick={() => handleDelete(crop._id)} className="rounded-lg bg-red-600 px-3 py-2 text-sm font-medium text-white">{t('delete')}</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminCrops;
