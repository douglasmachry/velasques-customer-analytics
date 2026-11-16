import { ArrowRight, ArrowUpRight, ReceiptText, ShoppingBag, Sparkles, Users, Wallet } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { demoCustomers, demoPurchases } from '@/data/demo-data';
import { getCustomerAnalytics, getDashboardMetrics, getLargestPurchase } from '@/domain/analytics';
import { euro, shortDate } from '@/shared/format';

const metrics = getDashboardMetrics(demoCustomers, demoPurchases);
const analytics = getCustomerAnalytics(demoCustomers, demoPurchases);
const largest = getLargestPurchase(demoPurchases);
const monthlyData = [
  { month: 'jan', revenue: 1160 }, { month: 'fev', revenue: 640 },
  { month: 'mar', revenue: 1580 }, { month: 'abr', revenue: 1920 },
  { month: 'mai', revenue: 860 }, { month: 'jun', revenue: 1250 },
  { month: 'jul', revenue: 970 }, { month: 'ago', revenue: 2250 },
  { month: 'set', revenue: 1380 },
];
const topCustomers = [...analytics].sort((a, b) => b.totalSpent - a.totalSpent).slice(0, 5);
const latestPurchases = [...demoPurchases].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 5);

function StatCard({ title, value, note, icon: Icon, trend }: {
  title: string; value: string; note: string; icon: LucideIcon; trend: string;
}) {
  return (
    <article className="stat-card">
      <div className="stat-top"><span>{title}</span><span className="stat-icon"><Icon size={18} /></span></div>
      <div className="stat-value">{value}</div>
      <div className="stat-note"><span className="trend"><ArrowUpRight size={14} /> {trend}</span>{note}</div>
    </article>
  );
}

export function DashboardPage() {
  return (
    <>
      <div className="page-heading">
        <div><div className="eyebrow">MONITOR DE NEGÓCIO</div><h1>Visão geral</h1><p>Acompanhe o desempenho da sua base de clientes.</p></div>
        <div className="period-pill"><span className="period-dot" /> Dados atualizados · Demo</div>
      </div>
      <section className="stats-grid" aria-label="Indicadores principais">
        <StatCard title="Receita total" value={euro(metrics.totalRevenue)} note="Em todas as compras" icon={Wallet} trend="+12,8%" />
        <StatCard title="Clientes" value={String(metrics.totalCustomers)} note="Na base de demonstração" icon={Users} trend="+8,2%" />
        <StatCard title="Compras" value={String(metrics.totalPurchases)} note="Transações registadas" icon={ShoppingBag} trend="+6,4%" />
        <StatCard title="Ticket médio" value={euro(metrics.averageOrderValue)} note="Por compra" icon={ReceiptText} trend="+3,1%" />
      </section>
      <section className="dashboard-grid">
        <article className="panel revenue-panel">
          <div className="panel-heading"><div><h2>Evolução da receita</h2><p>Volume de vendas ao longo de 2026</p></div><span className="panel-tag">2026</span></div>
          <div className="chart-wrap">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData} margin={{ top: 10, right: 8, left: -18, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#edf0ed" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#89918b', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#89918b', fontSize: 11 }} tickFormatter={(value) => '€' + (value / 1000) + 'k'} />
                <Tooltip formatter={(value) => euro(Number(value))} cursor={{ fill: '#f4f6f3' }} />
                <Bar dataKey="revenue" fill="#28664e" radius={[5, 5, 0, 0]} maxBarSize={38} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </article>
        <article className="panel highlight-panel">
          <div className="panel-heading"><div><h2>Compra de maior valor</h2><p>Transação individual mais elevada</p></div><span className="highlight-icon"><Sparkles size={17} /></span></div>
          {largest && <div className="largest-value">{euro(largest.totalAmount)}</div>}
          <div className="highlight-divider" />
          <div className="highlight-detail"><span>Referência</span><strong>{largest?.id}</strong></div>
          <div className="highlight-detail"><span>Data</span><strong>{shortDate(largest?.date)}</strong></div>
          <div className="highlight-detail"><span>Cliente</span><strong>{demoCustomers.find((customer) => customer.id === largest?.customerId)?.name}</strong></div>
        </article>
      </section>
      <section className="bottom-grid">
        <article className="panel table-panel">
          <div className="panel-heading"><div><h2>Clientes em destaque</h2><p>Ordenados pelo valor total comprado</p></div><Link to="/customers" className="text-link">Ver todos <ArrowRight size={14} /></Link></div>
          <div className="table-scroll"><table><thead><tr><th>CLIENTE</th><th>COMPRAS</th><th>VALOR TOTAL</th></tr></thead><tbody>
            {topCustomers.map((item) => <tr key={item.customer.id}><td><div className="customer-cell"><span className="avatar">{item.customer.name.split(' ').map((part) => part[0]).slice(0, 2).join('')}</span><span><strong>{item.customer.name}</strong><small>{item.customer.city}</small></span></div></td><td>{item.purchaseCount}</td><td className="amount-cell">{euro(item.totalSpent)}</td></tr>)}
          </tbody></table></div>
        </article>
        <article className="panel latest-panel">
          <div className="panel-heading"><div><h2>Compras recentes</h2><p>Últimas transações</p></div></div>
          <div className="activity-list">{latestPurchases.map((purchase) => <div className="activity-item" key={purchase.id}><span className="activity-icon"><ShoppingBag size={16} /></span><span className="activity-copy"><strong>{demoCustomers.find((customer) => customer.id === purchase.customerId)?.name}</strong><small>{purchase.id} · {shortDate(purchase.date)}</small></span><strong className="activity-amount">{euro(purchase.totalAmount)}</strong></div>)}</div>
        </article>
      </section>
    </>
  );
}