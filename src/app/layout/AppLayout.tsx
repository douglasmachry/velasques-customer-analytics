import { NavLink, Outlet } from 'react-router-dom';
import { BarChart3, LayoutDashboard, Users, Sparkles } from 'lucide-react';

const navigation = [
  { to: '/', label: 'Visão geral', icon: LayoutDashboard, end: true },
  { to: '/customers', label: 'Clientes', icon: Users, end: false },
  { to: '/loyalty', label: 'Fidelização', icon: Sparkles, end: false },
];

export function AppLayout() {
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <a className="brand" href="/" aria-label="Velasques início">
          <span className="brand-mark"><BarChart3 size={21} /></span>
          <span><strong>velasques</strong><small>INSIGHTS</small></span>
        </a>
        <div className="nav-section-label">WORKSPACE</div>
        <nav className="main-nav" aria-label="Navegação principal">
          {navigation.map(({ to, label, icon: Icon, end }) => (
            <NavLink key={to} to={to} end={end} className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
              <Icon size={18} strokeWidth={1.8} /><span>{label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="demo-status"><span className="status-dot" /> Dados de demonstração</div>
          <div className="profile"><div className="avatar avatar-dark">VA</div><div><strong>Velasques Analytics</strong><small>Workspace demo</small></div></div>
        </div>
      </aside>
      <main className="main-content">
        <header className="topbar">
          <div className="breadcrumb">Workspace <span>/</span> <strong>Analytics</strong></div>
          <div className="topbar-right"><span className="live-indicator" /> Ambiente de demonstração</div>
        </header>
        <div className="page-content"><Outlet /></div>
      </main>
    </div>
  );
}