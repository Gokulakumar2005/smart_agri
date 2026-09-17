import { useEffect, useState } from 'react';
import api from '../../services/api';

const AdminReports = () => {
  const [reports, setReports] = useState([]);

  const fetchReports = async () => {
    const { data } = await api.get('/api/admin/reports');
    setReports(data.reports || []);
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const reviewReport = async (reportId) => {
    const note = window.prompt('Add admin review notes');
    const corrected = window.prompt('Corrected diagnosis?', 'Healthy');
    if (!note && !corrected) return;

    await api.patch(`/api/admin/reports/${reportId}/review`, {
      adminNotes: note || '',
      correctedCondition: corrected || '',
    });
    fetchReports();
  };

  return (
    <div className="card p-6">
      <h1 className="text-2xl font-bold text-forest">Plant health reports</h1>
      <div className="mt-5 space-y-3">
        {reports.map((report) => (
          <div key={report._id} className="rounded-xl border border-stone-200 bg-stone-50 p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="font-semibold text-forest">{report.diagnosis?.condition}</p>
                <p className="text-sm text-stone-600">Confidence: {(report.confidenceScore * 100).toFixed(0)}%</p>
              </div>
              <button onClick={() => reviewReport(report._id)} className="rounded-lg bg-forest px-3 py-2 text-sm font-medium text-white">Review</button>
            </div>
            <p className="mt-2 text-sm text-stone-700">{report.adminNotes || 'Pending review'}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminReports;
