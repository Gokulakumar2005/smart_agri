import { useEffect, useState } from 'react';
import api from '../../services/api';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    const { data } = await api.get('/api/admin/users');
    setUsers(data.users || []);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const toggleBlock = async (userId, isBlocked) => {
    const shouldBlock = window.confirm(isBlocked ? 'Unblock this farmer?' : 'Block this farmer account?');
    if (!shouldBlock) return;
    await api.patch(`/api/admin/users/${userId}/block`, { isBlocked: !isBlocked });
    fetchUsers();
  };

  return (
    <div className="card p-6">
      <h1 className="text-2xl font-bold text-forest">User management</h1>
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
              {user.isBlocked ? 'Unblock' : 'Block'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminUsers;
