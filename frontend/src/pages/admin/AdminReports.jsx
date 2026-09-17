import { useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useApp } from '../../context/AppContext';
import { toast } from 'react-toastify';

const AdminReports = () => {
  const { t, content } = useLanguage();
  const { reports, fetchReports, reviewReport: saveReview } = useApp();

  useEffect(() => {
    fetchReports();
  }, []);

  const reviewReport = async (reportId) => {
    const note = window.prompt('Add admin review notes');
    const corrected = window.prompt('Corrected diagnosis?', 'Healthy');
    if (!note && !corrected) return;

    try {
      await saveReview(reportId, {
        adminNotes: note || '',
        correctedCondition: corrected || '',
      });
      toast.success('Report reviewed successfully.');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to review report.');
    }
  };

  return (
    <div className="card p-6">
      <h1 className="text-2xl font-bold text-forest">{t('plantHealthReports')}</h1>
      <div className="mt-5 space-y-3">
        {reports.map((report) => (
          <div key={report._id} className="rounded-xl border border-stone-200 bg-stone-50 p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="font-semibold text-forest">{content(report.diagnosis?.condition)}</p>
                <p className="text-sm text-stone-600">{t('confidenceLabel')}: {(report.confidenceScore * 100).toFixed(0)}%</p>
              </div>
              <button onClick={() => reviewReport(report._id)} className="rounded-lg bg-forest px-3 py-2 text-sm font-medium text-white">{t('review')}</button>
            </div>
            <p className="mt-2 text-sm text-stone-700">{content(report.adminNotes) || t('pendingReview')}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminReports;
