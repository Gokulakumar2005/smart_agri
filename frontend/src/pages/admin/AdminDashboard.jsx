import { useEffect, useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useApp } from '../../context/AppContext';

const AdminDashboard = () => {
  const { t, language, content } = useLanguage();
  const { analytics, analyticsLoading, fetchAnalytics, weather, weatherLoading, weatherError, fetchSeasonalWeather, searchLocations } = useApp();
  const [searching, setSearching] = useState(false);
  const [placeName, setPlaceName] = useState('Trichy');
  const [resolvedLocation, setResolvedLocation] = useState('India');
  const [location, setLocation] = useState({
    lat: import.meta.env.VITE_WEATHER_LATITUDE || '20.5937',
    lon: import.meta.env.VITE_WEATHER_LONGITUDE || '78.9629',
  });

  const searchAndFetchWeather = async (event) => {
    event.preventDefault();
    setSearching(true);
    setWeatherError('');
    try {
      const locations = await searchLocations(placeName);
      const match = locations[0];
      if (!match) {
        return;
      }

      const coordinates = { lat: match.latitude, lon: match.longitude };
      setLocation(coordinates);
      setResolvedLocation([match.name, match.admin1, match.country].filter(Boolean).join(', '));
      await fetchSeasonalWeather(coordinates);
    } catch (error) {
      console.error('Location search failed:', error);
    } finally {
      setSearching(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
    fetchSeasonalWeather(location).catch(() => {});
  }, [fetchAnalytics, fetchSeasonalWeather]);

  if (analyticsLoading || !analytics) return <div className="p-8 text-center">{t('loadingDashboard')}</div>;

  return (
    <div className="space-y-6">
      <section className="card p-6">
        <p className="text-sm uppercase tracking-[0.2em] text-stone-500">{t('operationsOverview')}</p>
        <h1 className="mt-2 text-3xl font-bold text-forest">{t('adminDashboard')}</h1>
      </section>

      <div className="grid gap-4 md:grid-cols-4">
        <div className="card p-5"><p className="text-sm text-stone-500">{t('totalUsers')}</p><p className="mt-2 text-3xl font-bold text-forest">{analytics.totalUsers || 0}</p></div>
        <div className="card p-5"><p className="text-sm text-stone-500">{t('plansGenerated')}</p><p className="mt-2 text-3xl font-bold text-leaf">{analytics.totalPlans || 0}</p></div>
        <div className="card p-5"><p className="text-sm text-stone-500">{t('mostGrownCrop')}</p><p className="mt-2 text-xl font-bold text-accent">{content(analytics.mostGrownCrops?.[0]?.crop || 'N/A')}</p></div>
        <div className="card p-5"><p className="text-sm text-stone-500">{t('commonIssue')}</p><p className="mt-2 text-xl font-bold text-soil">{content(analytics.commonPlantHealthIssues?.[0]?.issue || 'N/A')}</p></div>
      </div>

      <section className="card p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-stone-500">{t('seasonalOutlook')}</p>
            <h2 className="mt-2 text-xl font-bold text-forest">{t('weatherSixMonths')}</h2>
            <p className="mt-1 text-sm text-stone-600">{t('monthlyProjections')}</p>
          </div>
          <form className="flex flex-wrap items-end gap-3" onSubmit={searchAndFetchWeather}>
            <label className="text-sm text-stone-600">{t('location')}
              <input className="mt-1 block w-64 rounded-lg border border-stone-300 px-3 py-2" type="search" placeholder="Trichy, Chennai, Basavangudi" value={placeName} onChange={(event) => setPlaceName(event.target.value)} />
            </label>
            <button className="rounded-lg bg-forest px-4 py-2 font-semibold text-white disabled:opacity-60" type="submit" disabled={searching}>{searching ? t('searching') : t('getWeather')}</button>
          </form>
        </div>

        <p className="mt-5 text-sm text-stone-600">{t('showingWeather')} <span className="font-semibold text-forest">{resolvedLocation}</span>.</p>
        {weatherError ? <p className="mt-5 rounded-lg bg-red-50 p-4 text-red-700">{weatherError}</p> : null}
        {weather ? (
          <div className="mt-6 overflow-x-auto">
            <table className="w-full min-w-[650px] text-left text-sm">
              <thead className="border-b border-stone-200 text-stone-500">
                <tr><th className="pb-3 pr-4">{t('month')}</th><th className="pb-3 pr-4">{t('average')}</th><th className="pb-3 pr-4">{t('highLow')}</th><th className="pb-3 pr-4">{t('rainfall')}</th><th className="pb-3">{t('wind')}</th></tr>
              </thead>
              <tbody>
                {weather.forecast.map((month) => (
                  <tr className="border-b border-stone-100 last:border-0" key={month.month}>
                    <td className="py-4 pr-4 font-semibold text-forest">{new Date(`${month.month}-01T00:00:00`).toLocaleDateString(language, { month: 'long', year: 'numeric' })}</td>
                    <td className="py-4 pr-4">{month.meanTemperature}°C</td>
                    <td className="py-4 pr-4">{month.maxTemperature}° / {month.minTemperature}°C</td>
                    <td className="py-4 pr-4">{month.precipitation} mm</td>
                    <td className="py-4">{month.windSpeed} km/h</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : weatherLoading && !weatherError ? <p className="mt-5 text-stone-500">{t('loadingWeather')}</p> : null}
      </section>
    </div>
  );
};

export default AdminDashboard;
