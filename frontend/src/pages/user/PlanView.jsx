import { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import jsPDF from 'jspdf';
import api from '../../services/api';
import { useLanguage } from '../../context/LanguageContext';
import { useApp } from '../../context/AppContext';
import { toast } from 'react-toastify';

const normalizePlan = (incomingPlan = {}) => {
  const generatedPlan = incomingPlan.generatedPlan || incomingPlan;
  const cropName = incomingPlan.cropName || 'Crop plan';
  const plantingDate = incomingPlan.plantingDate || new Date().toISOString();
  const fallbackFertilizers = [
    { stage: 'Before planting', daysFromPlanting: 0, nutrient: 'Organic matter + balanced fertilizer', conventionalInput: 'Well-decomposed manure plus NPK according to a soil test', organicAlternative: 'Compost or farmyard manure plus approved organic nutrients', notes: 'Incorporate into prepared soil before planting.' },
    { stage: 'Early growth', daysFromPlanting: 30, nutrient: 'Nitrogen', conventionalInput: 'Split nitrogen application according to crop and soil test', organicAlternative: 'Vermicompost or mature compost side dressing', notes: 'Apply around the root zone and irrigate afterward.' },
    { stage: 'Flowering or grain formation', daysFromPlanting: 60, nutrient: 'Potassium + phosphorus', conventionalInput: 'Potassium and phosphorus according to a soil test', organicAlternative: 'Approved organic potassium source with compost', notes: 'Avoid excess nitrogen and maintain even irrigation.' },
  ].map((item) => {
    const applicationDate = new Date(plantingDate);
    applicationDate.setDate(applicationDate.getDate() + item.daysFromPlanting);
    return { ...item, applicationDate: applicationDate.toISOString() };
  });
  const fallbackIrrigation = [
    { stage: 'Establishment', daysFromPlanting: 7, frequency: 'Check soil moisture before watering.', notes: 'Keep the root zone evenly moist after planting.' },
    { stage: 'Active growth', daysFromPlanting: 30, frequency: 'Adjust irrigation to crop demand and rainfall.', notes: 'Do not let the root zone dry completely.' },
    { stage: 'Pre-harvest', daysFromPlanting: 75, frequency: 'Reduce irrigation as the crop approaches harvest.', notes: 'Avoid excess water close to harvest.' },
  ].map((item) => {
    const irrigationDate = new Date(plantingDate);
    irrigationDate.setDate(irrigationDate.getDate() + item.daysFromPlanting);
    return { ...item, irrigationDate: irrigationDate.toISOString() };
  });

  return {
    ...incomingPlan,
    cropName,
    suitabilitySummary: incomingPlan.suitabilitySummary || generatedPlan.suitabilitySummary || '',
    landPreparation: incomingPlan.landPreparation?.length ? incomingPlan.landPreparation : generatedPlan.landPreparation?.length ? generatedPlan.landPreparation : [
      '2-3 weeks before planting, test soil pH, organic carbon, nitrogen, phosphorus, potassium, and salinity.',
      'Remove weeds and loosen compacted soil, then incorporate 2-4 tonnes per acre of mature compost or farmyard manure.',
      'Apply lime or gypsum only when a soil test recommends it, using the recommended rate.',
      'Improve biological activity with mature compost and mulch, and ensure good drainage before planting.',
    ],
    fertilizerSchedule: incomingPlan.fertilizerSchedule?.length ? incomingPlan.fertilizerSchedule : generatedPlan.fertilizerSchedule?.length ? generatedPlan.fertilizerSchedule : fallbackFertilizers,
    irrigationSchedule: incomingPlan.irrigationSchedule?.length ? incomingPlan.irrigationSchedule : generatedPlan.irrigationSchedule?.length ? generatedPlan.irrigationSchedule : fallbackIrrigation,
    maintenanceSchedule: incomingPlan.maintenanceSchedule || generatedPlan.maintenanceSchedule || [],
    expectedHarvestDate: incomingPlan.expectedHarvestDate || generatedPlan.expectedHarvestDate || new Date().toISOString(),
    growthDurationDays: incomingPlan.growthDurationDays || 120,
  };
};

const formatPlanDate = (date) => (date ? new Date(date).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' }) : 'Before planting');

const PlanView = () => {
  const { state } = useLocation();
  const { id } = useParams();
  const { t, content } = useLanguage();
  const { plans, plansLoading, fetchPlans, fetchPlanById } = useApp();
  const [plan, setPlan] = useState(state?.plan ? normalizePlan(state.plan) : null);

  useEffect(() => {
    if (state?.plan) return;
    if (id) fetchPlanById(id).then((loadedPlan) => setPlan(normalizePlan(loadedPlan))).catch(() => setPlan(null));
    else fetchPlans();
  }, [id, state, fetchPlans, fetchPlanById]);

  useEffect(() => {
    if (!state?.plan && !id && plans.length) setPlan(normalizePlan(plans[0]));
  }, [id, plans, state]);

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
      doc.text(t('landPreparation'), 14, y);
      y += 8;
      plan.landPreparation?.forEach((step, index) => {
        const lines = doc.splitTextToSize(`${index + 1}. ${step}`, 180);
        doc.text(lines, 14, y);
        y += lines.length * 6 + 2;
      });

      y += 8;
      doc.text(t('fertilizerRecommendations'), 14, y);
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
      toast.error('Unable to generate PDF right now. Please try again.');
    }
  };

  if (plansLoading && !plan) {
    return <div className="card p-8 text-center text-stone-600">{t('loadingPlan')}</div>;
  }

  if (!plan) {
    return <div className="card p-8 text-center text-stone-600">{t('noPlanData')}</div>;
  }

  return (
    <div className="space-y-6">
      <section className="card p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-stone-500">{t('cultivationPlan')}</p>
            <h1 className="mt-2 text-3xl font-bold text-forest">{content(plan.cropName)}</h1>
            <p className="mt-3 text-stone-600">{content(plan.suitabilitySummary)}</p>
          </div>
          <button onClick={handleDownload} className="rounded-lg bg-forest px-4 py-2 font-semibold text-white">{t('downloadPlan')}</button>
        </div>
      </section>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="card p-6">
          <h2 className="text-xl font-bold text-forest">{t('landPreparation')}</h2>
          <ul className="mt-4 space-y-2 text-stone-700">
            {plan.landPreparation?.length ? plan.landPreparation.map((step, idx) => <li key={idx}>• {content(step)}</li>) : <li>{content('Prepare the soil with mature organic matter, ensure drainage, and follow a soil-test-based fertilizer plan before planting.')}</li>}
          </ul>
        </div>
        <div className="card p-6">
          <h2 className="text-xl font-bold text-forest">{t('schedule')}</h2>
          <p className="mt-3 text-stone-700">{t('expectedHarvestDate')}: {new Date(plan.expectedHarvestDate).toLocaleDateString()}</p>
          <p className="mt-2 text-stone-700">{t('cropDuration')}: {plan.growthDurationDays || 120} days</p>
        </div>
      </div>

      <div className="card p-6">
        <h2 className="text-xl font-bold text-forest">{t('fertilizerRecommendations')}</h2>
        <div className="mt-4 space-y-3">
          {plan.fertilizerSchedule?.length ? plan.fertilizerSchedule.map((item, idx) => (
            <div key={idx} className="rounded-xl border border-stone-200 bg-stone-50 p-4">
              <p className="font-semibold text-forest">{content(item.stage)}</p>
              <p className="mt-1 text-sm font-medium text-leaf">{t('apply')}: {formatPlanDate(item.applicationDate)}</p>
              <p className="mt-2 text-sm text-stone-700">{content(item.nutrient)}: {content(item.conventionalInput)}</p>
              <p className="text-sm text-stone-700">{t('organicAlternative')}: {content(item.organicAlternative)}</p>
              {item.notes ? <p className="mt-2 text-sm text-stone-600">{content(item.notes)}</p> : null}
            </div>
          )) : <p className="text-stone-600">No fertilizer recommendations available.</p>}
        </div>
      </div>

      <div className="card p-6">
          <h2 className="text-xl font-bold text-forest">{t('irrigationMaintenance')}</h2>
        <div className="mt-4 space-y-3">
          {plan.irrigationSchedule?.length ? plan.irrigationSchedule.map((item, idx) => (
            <div key={idx} className="rounded-xl border border-stone-200 bg-stone-50 p-4">
              <p className="font-semibold text-forest">{content(item.stage)}</p>
              <p className="mt-1 text-sm font-medium text-leaf">{t('waterOn')}: {formatPlanDate(item.irrigationDate)}</p>
              <p className="text-sm text-stone-700">{content(item.frequency)}</p>
              <p className="text-sm text-stone-700">{content(item.notes)}</p>
            </div>
          )) : <p className="text-stone-600">{t('noIrrigation')}</p>}
        </div>
      </div>
    </div>
  );
};

export default PlanView;
