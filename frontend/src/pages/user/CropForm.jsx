import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

const cropOptions = ['Paddy', 'Banana', 'Tomato'];

const CropForm = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ cropName: 'Paddy', soilType: 'Loam', irrigationMethod: 'Drip', farmingPractice: 'conventional', plantingDate: new Date().toISOString().slice(0, 10) });
  const [error, setError] = useState('');

  const handleChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post('/api/plan', form);
      navigate('/plans', { state: { plan: data.plan } });
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to generate plan');
    }
  };

  return (
    <div className="mx-auto max-w-3xl card p-6">
      <h1 className="text-2xl font-bold text-forest">Create cultivation plan</h1>
      <form onSubmit={handleSubmit} className="mt-6 grid gap-5 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium">Crop</label>
          <select name="cropName" value={form.cropName} onChange={handleChange} className="w-full rounded-lg border border-stone-300 p-3">
            {cropOptions.map((crop) => <option key={crop} value={crop}>{crop}</option>)}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Soil type</label>
          <select name="soilType" value={form.soilType} onChange={handleChange} className="w-full rounded-lg border border-stone-300 p-3">
            <option>Loam</option>
            <option>Clay loam</option>
            <option>Sandy loam</option>
            <option>Silt loam</option>
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Planting date</label>
          <input type="date" name="plantingDate" value={form.plantingDate} onChange={handleChange} className="w-full rounded-lg border border-stone-300 p-3" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Irrigation method</label>
          <select name="irrigationMethod" value={form.irrigationMethod} onChange={handleChange} className="w-full rounded-lg border border-stone-300 p-3">
            <option>Drip</option>
            <option>Sprinkler</option>
            <option>Flood</option>
          </select>
        </div>
        <div className="md:col-span-2">
          <label className="mb-1 block text-sm font-medium">Farming practice</label>
          <select name="farmingPractice" value={form.farmingPractice} onChange={handleChange} className="w-full rounded-lg border border-stone-300 p-3">
            <option value="conventional">Conventional</option>
            <option value="organic">Organic</option>
            <option value="natural">Natural</option>
          </select>
        </div>
        {error && <p className="md:col-span-2 text-sm text-red-600">{error}</p>}
        <button type="submit" className="md:col-span-2 rounded-lg bg-forest px-4 py-3 font-semibold text-white">Generate plan</button>
      </form>
    </div>
  );
};

export default CropForm;
