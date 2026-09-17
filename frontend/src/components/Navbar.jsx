import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const navLinkClass = ({ isActive }) =>
  `px-3 py-2 rounded-md text-sm font-medium ${isActive ? 'bg-green-700 text-white' : 'text-stone-700 hover:bg-stone-100'}`;

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="border-b border-stone-200 bg-[#f7f3ea]">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <Link to={user?.role === 'admin' ? '/admin' : '/dashboard'} className="text-xl font-bold text-forest">
          SmartAgri
        </Link>

        <div className="flex items-center gap-2">
          {!user ? (
            <>
              <NavLink className={navLinkClass} to="/login">Login</NavLink>
              <NavLink className={navLinkClass} to="/register">Register</NavLink>
            </>
          ) : (
            <>
              {user.role === 'admin' ? (
                <>
                  <NavLink className={navLinkClass} to="/admin">Overview</NavLink>
                  <NavLink className={navLinkClass} to="/admin/crops">Crops</NavLink>
                  <NavLink className={navLinkClass} to="/admin/users">Users</NavLink>
                  <NavLink className={navLinkClass} to="/admin/reports">Reports</NavLink>
                </>
              ) : (
                <>
                  <NavLink className={navLinkClass} to="/dashboard">Dashboard</NavLink>
                  <NavLink className={navLinkClass} to="/crop-form">Crop Form</NavLink>
                  <NavLink className={navLinkClass} to="/plans">Plans</NavLink>
                  <NavLink className={navLinkClass} to="/plant-health">Plant Health</NavLink>
                </>
              )}
              <button
                onClick={logout}
                className="rounded-md bg-soil px-3 py-2 text-sm font-semibold text-white"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
