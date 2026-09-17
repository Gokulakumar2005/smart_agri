import { useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useApp } from '../../context/AppContext';
import { toast } from 'react-toastify';
import { showToastConfirm } from '../../components/ToastConfirm';

const AdminUsers = () => {
  const { t } = useLanguage();
  const { users, fetchUsers, toggleBlockUser } = useApp();

  useEffect(() => {
    fetchUsers();
  }, []);

  const toggleBlock = (userId, isBlocked) => {
    showToastConfirm({
      message: isBlocked ? 'Unblock this farmer?' : 'Block this farmer account?',
      onConfirm: async () => {
        try {
          await toggleBlockUser(userId, isBlocked);
          toast.success(isBlocked ? 'Farmer account unblocked.' : 'Farmer account blocked.');
        } catch (error) {
          toast.error(error.response?.data?.message || 'Unable to update the account.');
        }
      },
    });
  };

  return (
    <div className="card p-6">
      <h1 className="text-2xl font-bold text-forest">{t('userManagement')}</h1>
      <div className="mt-5 space-y-3">
        {users.map((user) => (
          <div key={user._id} className="flex items-center justify-between rounded-xl border border-stone-200 bg-stone-50 p-4">
            <div>
              <p className="font-semibold text-forest">{user.name}</p>
              <p className="text-sm text-stone-600">{user.email}</p>
              <p className="text-xs uppercase tracking-[0.2em] text-stone-500">{user.role}</p>
            </div>
            <button
              onClick={() => toggleBlock(user._id, user.isBlocked)}
              className={`rounded-lg px-3 py-2 text-sm font-medium text-white ${user.isBlocked ? 'bg-emerald-600' : 'bg-red-600'}`}
            >
              {user.isBlocked ? t('unblock') : t('block')}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminUsers;
