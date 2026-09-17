import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

const navLinkClass = ({ isActive }) =>
  `block rounded-md px-3 py-2 text-sm font-medium ${isActive ? 'bg-green-700 text-white' : 'text-stone-700 hover:bg-stone-100'}`;

const Navbar = () => {
  const { user, logout } = useAuth();
  const { language, languages, changeLanguage, t } = useLanguage();

  return (
    <nav className="border-b border-stone-200 bg-[#f7f3ea] md:min-h-screen md:w-64 md:shrink-0 md:border-b-0 md:border-r">
      <div className="flex h-full flex-col gap-6 px-4 py-4 md:sticky md:top-0 md:h-screen md:px-5 md:py-6">
        <div className="flex items-center justify-between md:block">
          <Link to={user?.role === 'admin' ? '/admin' : '/dashboard'} className="text-xl font-bold text-forest">SmartAgri</Link>
          <label className="flex items-center gap-2 text-xs font-semibold text-stone-600 md:mt-8 md:block">
            <span className="md:mb-2 md:block">{t('language')}</span>
            <select aria-label={t('language')} value={language} onChange={(event) => changeLanguage(event.target.value)} className="rounded-lg border border-stone-300 bg-white px-2 py-1.5 text-sm">
              {languages.map((option) => <option key={option.code} value={option.code}>{option.label}</option>)}
            </select>
          </label>
        </div>

        <div className="flex flex-wrap gap-2 md:block md:space-y-1">
        {!user ? (
          <>
            <NavLink className={navLinkClass} to="/login">{t('login')}</NavLink>
            <NavLink className={navLinkClass} to="/register">{t('register')}</NavLink>
          </>
        ) : (
          <>
            {user.role === 'admin' ? (
              <>
                <NavLink className={navLinkClass} to="/admin">{t('overview')}</NavLink>
                <NavLink className={navLinkClass} to="/admin/crops">{t('crops')}</NavLink>
                <NavLink className={navLinkClass} to="/admin/users">{t('users')}</NavLink>
                <NavLink className={navLinkClass} to="/admin/reports">{t('reports')}</NavLink>
              </>
            ) : (
              <>
                <NavLink className={navLinkClass} to="/dashboard">{t('dashboard')}</NavLink>
                <NavLink className={navLinkClass} to="/crop-form">{t('cropForm')}</NavLink>
                <NavLink className={navLinkClass} to="/plans">{t('plans')}</NavLink>
                <NavLink className={navLinkClass} to="/tasks">{t('tasks')}</NavLink>
                <NavLink className={navLinkClass} to="/plant-health">{t('plantHealth')}</NavLink>
              </>
            )}
            <button onClick={logout} className="mt-2 rounded-md bg-soil px-3 py-2 text-sm font-semibold text-white">{t('logout')}</button>
          </>
        )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
