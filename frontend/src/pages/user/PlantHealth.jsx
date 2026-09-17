import { useState } from 'react';
import api from '../../services/api';
import { useLanguage } from '../../context/LanguageContext';
import { toast } from 'react-toastify';

const PlantHealth = () => {
  const { t, content } = useLanguage();
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError(t('chooseImage'));
      toast.error(t('chooseImage'));
      return;
    }

    const formData = new FormData();
    formData.append('image', file);

    try {
      const { data } = await api.post('/api/plant-health', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setResult(data.report);
      setError('');
      toast.success('Plant image analyzed successfully.');
    } catch (err) {
      const message = err.response?.data?.message || 'Image analysis could not be completed';
      setError(message);
      toast.error(message);
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="card p-6">
        <h1 className="text-2xl font-bold text-forest">{t('plantHealthCheck')}</h1>
        <p className="mt-2 text-stone-600">{t('uploadText')}</p>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files[0])} className="w-full rounded-lg border border-stone-300 p-3" />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button type="submit" className="rounded-lg bg-accent px-4 py-3 font-semibold text-white">{t('analyzeImage')}</button>
        </form>
      </div>

      {result && (
        <div className="card p-6">
          <p className="text-sm uppercase tracking-[0.2em] text-stone-500">{t('diagnosis')}</p>
          <h2 className="mt-2 text-2xl font-bold text-forest">{content(result.diagnosis.condition)}</h2>
          <p className="mt-2 text-stone-600">{t('confidence')}: {(result.confidenceScore * 100).toFixed(0)}%</p>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div>
              <h3 className="font-semibold text-forest">{t('symptoms')}</h3>
              <ul className="mt-2 space-y-1 text-stone-700">
                {result.diagnosis.symptoms.map((item, index) => <li key={index}>• {content(item)}</li>)}
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-forest">{t('possibleCauses')}</h3>
              <ul className="mt-2 space-y-1 text-stone-700">
                {result.diagnosis.possibleCauses.map((item, index) => <li key={index}>• {content(item)}</li>)}
              </ul>
            </div>
          </div>
          <div className="mt-5 rounded-xl border border-stone-200 bg-stone-50 p-4">
            <p className="font-semibold text-forest">{t('chemicalRemedy')}</p>
            <p className="mt-1 text-stone-700">{content(result.remedySuggested.chemical)}</p>
          </div>
          <div className="mt-3 rounded-xl border border-stone-200 bg-stone-50 p-4">
            <p className="font-semibold text-forest">{t('organicRemedy')}</p>
            <p className="mt-1 text-stone-700">{content(result.remedySuggested.organic)}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlantHealth;
