import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import jsPDF from 'jspdf';
import api from '../../services/api';

const normalizePlan = (incomingPlan = {}) => {
  const generatedPlan = incomingPlan.generatedPlan || incomingPlan;

  return {
    ...incomingPlan,
    cropName: incomingPlan.cropName || 'Crop plan',
    suitabilitySummary: incomingPlan.suitabilitySummary || generatedPlan.suitabilitySummary || '',
    landPreparation: incomingPlan.landPreparation || generatedPlan.landPreparation || [],
    fertilizerSchedule: incomingPlan.fertilizerSchedule || generatedPlan.fertilizerSchedule || [],
    irrigationSchedule: incomingPlan.irrigationSchedule || generatedPlan.irrigationSchedule || [],
    maintenanceSchedule: incomingPlan.maintenanceSchedule || generatedPlan.maintenanceSchedule || [],
    expectedHarvestDate: incomingPlan.expectedHarvestDate || generatedPlan.expectedHarvestDate || new Date().toISOString(),
    growthDurationDays: incomingPlan.growthDurationDays || 120,
  };
};

const PlanView = () => {
  const { state } = useLocation();
  const [plan, setPlan] = useState(state?.plan ? normalizePlan(state.plan) : null);
  const [loading, setLoading] = useState(!state?.plan);

  useEffect(() => {
    const loadPlan = async () => {
      if (state?.plan) return;

      try {
        const { data } = await api.get('/api/plan');
        const latestPlan = data.plans?.[0];
        setPlan(latestPlan ? normalizePlan(latestPlan) : null);
      } catch (error) {
        console.error('Failed to load plans:', error);
        setPlan(null);
      } finally {
        setLoading(false);
      }
    };

    loadPlan();
  }, [state]);

  const handleDownload = async () => {
    if (!plan) return;

    try {
      const { data } = await api.get('/api/weather', {
        params: { lat: 12.9716, lon: 77.5946 },
      });

      const doc = new jsPDF();
      doc.setFontSize(18);
      doc.text('Smart Agri Cultivation Plan', 14, 20);
      doc.setFontSize(12);
      doc.text(`Crop: ${plan.cropName}`, 14, 35);
      doc.text(`Planting Date: ${new Date(plan.plantingDate || Date.now()).toLocaleDateString()}`, 14, 45);
      doc.text(`Expected Harvest: ${new Date(plan.expectedHarvestDate).toLocaleDateString()}`, 14, 55);
      doc.text(`Soil Type: ${plan.soilType || 'Loam'}`, 14, 65);
      doc.text(`Weather Provider: ${data.provider || 'open-meteo'}`, 14, 75);
      doc.text(`Current Temp: ${data.current?.temperature ?? 'N/A'}°C`, 14, 85);
      doc.text(`Rain Forecast: ${data.current?.precipitation ?? 0} mm`, 14, 95);
      doc.text('Summary:', 14, 110);
      doc.text(doc.splitTextToSize(plan.suitabilitySummary || 'No summary available.', 180), 14, 120);

      let y = 140;
      doc.text('Land Preparation', 14, y);
      y += 8;
      plan.landPreparation?.forEach((step, index) => {
        const lines = doc.splitTextToSize(`${index + 1}. ${step}`, 180);
        doc.text(lines, 14, y);
        y += lines.length * 6 + 2;
      });

      y += 8;
      doc.text('Fertilizer Recommendations', 14, y);
      y += 8;
      plan.fertilizerSchedule?.forEach((item, index) => {
        const lines = doc.splitTextToSize(`${index + 1}. ${item.stage}: ${item.nutrient} - ${item.conventionalInput}`, 180);
        doc.text(lines, 14, y);
        y += lines.length * 6 + 2;
      });

      const fileName = `${(plan.cropName || 'cultivation-plan').replace(/\s+/g, '-').toLowerCase()}.pdf`;
      doc.save(fileName);
    } catch (error) {
      console.error('PDF export failed:', error);
      alert('Unable to generate PDF right now. Please try again.');
    }
  };

  if (loading) {
    return <div className="card p-8 text-center text-stone-600">Loading cultivation plan...</div>;
  }

  if (!plan) {
    return <div className="card p-8 text-center text-stone-600">No plan data available. Generate a plan first.</div>;
  }

  return (
    <div className="space-y-6">
      <section className="card p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-stone-500">Cultivation plan</p>
            <h1 className="mt-2 text-3xl font-bold text-forest">{plan.cropName}</h1>
            <p className="mt-3 text-stone-600">{plan.suitabilitySummary}</p>
          </div>
          <button onClick={handleDownload} className="rounded-lg bg-forest px-4 py-2 font-semibold text-white">Download plan</button>
        </div>
      </section>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="card p-6">
          <h2 className="text-xl font-bold text-forest">Land preparation</h2>
          <ul className="mt-4 space-y-2 text-stone-700">
            {plan.landPreparation?.length ? plan.landPreparation.map((step, idx) => <li key={idx}>• {step}</li>) : <li>No land-preparation steps available.</li>}
          </ul>
        </div>
        <div className="card p-6">
          <h2 className="text-xl font-bold text-forest">Schedule</h2>
          <p className="mt-3 text-stone-700">Expected harvest date: {new Date(plan.expectedHarvestDate).toLocaleDateString()}</p>
          <p className="mt-2 text-stone-700">Crop duration: {plan.growthDurationDays || 120} days</p>
        </div>
      </div>

      <div className="card p-6">
        <h2 className="text-xl font-bold text-forest">Fertilizer recommendations</h2>
        <div className="mt-4 space-y-3">
          {plan.fertilizerSchedule?.length ? plan.fertilizerSchedule.map((item, idx) => (
            <div key={idx} className="rounded-xl border border-stone-200 bg-stone-50 p-4">
              <p className="font-semibold text-forest">{item.stage}</p>
              <p className="mt-2 text-sm text-stone-700">{item.nutrient}: {item.conventionalInput}</p>
              <p className="text-sm text-stone-700">Organic alternative: {item.organicAlternative}</p>
            </div>
          )) : <p className="text-stone-600">No fertilizer recommendations available.</p>}
        </div>
      </div>

      <div className="card p-6">
        <h2 className="text-xl font-bold text-forest">Irrigation & maintenance</h2>
        <div className="mt-4 space-y-3">
          {plan.irrigationSchedule?.length ? plan.irrigationSchedule.map((item, idx) => (
            <div key={idx} className="rounded-xl border border-stone-200 bg-stone-50 p-4">
              <p className="font-semibold text-forest">{item.stage}</p>
              <p className="text-sm text-stone-700">{item.frequency}</p>
              <p className="text-sm text-stone-700">{item.notes}</p>
            </div>
          )) : <p className="text-stone-600">No irrigation schedule available.</p>}
        </div>
      </div>
    </div>
  );
};

export default PlanView;
