import { useLocation } from 'react-router-dom';

const PlanView = () => {
  const { state } = useLocation();
  const plan = state?.plan;

  if (!plan) {
    return <div className="card p-8 text-center text-stone-600">No plan data available. Generate a plan first.</div>;
  }

  return (
    <div className="space-y-6">
      <section className="card p-6">
        <p className="text-sm uppercase tracking-[0.2em] text-stone-500">Cultivation plan</p>
        <h1 className="mt-2 text-3xl font-bold text-forest">{plan.cropName}</h1>
        <p className="mt-3 text-stone-600">{plan.suitabilitySummary}</p>
      </section>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="card p-6">
          <h2 className="text-xl font-bold text-forest">Land preparation</h2>
          <ul className="mt-4 space-y-2 text-stone-700">
            {plan.landPreparation?.map((step, idx) => <li key={idx}>• {step}</li>)}
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
          {plan.fertilizerSchedule?.map((item, idx) => (
            <div key={idx} className="rounded-xl border border-stone-200 bg-stone-50 p-4">
              <p className="font-semibold text-forest">{item.stage}</p>
              <p className="mt-2 text-sm text-stone-700">{item.nutrient}: {item.conventionalInput}</p>
              <p className="text-sm text-stone-700">Organic alternative: {item.organicAlternative}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="card p-6">
        <h2 className="text-xl font-bold text-forest">Irrigation & maintenance</h2>
        <div className="mt-4 space-y-3">
          {plan.irrigationSchedule?.map((item, idx) => (
            <div key={idx} className="rounded-xl border border-stone-200 bg-stone-50 p-4">
              <p className="font-semibold text-forest">{item.stage}</p>
              <p className="text-sm text-stone-700">{item.frequency}</p>
              <p className="text-sm text-stone-700">{item.notes}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PlanView;
