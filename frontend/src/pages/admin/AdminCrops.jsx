import { useEffect, useState } from 'react';
import api from '../../services/api';

const initialForm = { name: '', suitableSoilTypes: 'Loam', growthDurationDays: 120 };

const AdminCrops = () => {
  const [crops, setCrops] = useState([]);
  const [form, setForm] = useState(initialForm);

  const fetchCrops = async () => {
    const { data } = await api.get('/api/admin/crops');
    setCrops(data.crops || []);
  };

  useEffect(() => {
    fetchCrops();
  }, []);

  const handleChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleCreate = async (e) => {
    e.preventDefault();
    const payload = { ...form, suitableSoilTypes: [form.suitableSoilTypes] };
    await api.post('/api/admin/crops', payload);
    setForm(initialForm);
    fetchCrops();
  };

  const handleDelete = async (id) => {
    await api.delete(`/api/admin/crops/${id}`);
    fetchCrops();
  };

  return (
    <div className="space-y-6">
      <div className="card p-6">
        <h1 className="text-2xl font-bold text-forest">Crop knowledge base</h1>
        <form onSubmit={handleCreate} className="mt-5 grid gap-4 md:grid-cols-3">
          <input className="rounded-lg border border-stone-300 p-3" name="name" value={form.name} onChange={handleChange} placeholder="Crop name" required />
          <input className="rounded-lg border border-stone-300 p-3" name="suitableSoilTypes" value={form.suitableSoilTypes} onChange={handleChange} placeholder="Soil type" required />
          <input className="rounded-lg border border-stone-300 p-3" type="number" name="growthDurationDays" value={form.growthDurationDays} onChange={handleChange} placeholder="Duration days" required />
          <button type="submit" className="md:col-span-3 rounded-lg bg-forest px-4 py-3 font-semibold text-white">Add crop</button>
        </form>
      </div>

      <div className="card p-6">
        <h2 className="text-xl font-bold text-forest">Existing crops</h2>
        <div className="mt-4 space-y-3">
          {crops.map((crop) => (
            <div key={crop._id} className="flex items-center justify-between rounded-xl border border-stone-200 bg-stone-50 p-4">
              <div>
                <p className="font-semibold text-forest">{crop.name}</p>
                <p className="text-sm text-stone-600">{crop.suitableSoilTypes?.join(', ')}</p>
              </div>
              <button onClick={() => handleDelete(crop._id)} className="rounded-lg bg-red-600 px-3 py-2 text-sm font-medium text-white">Delete</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminCrops;
