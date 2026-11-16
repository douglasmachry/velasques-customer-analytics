import { useState } from 'react';
import { ArrowRight, ReceiptText, ShoppingBag, Sparkles, Users, Wallet } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { getCustomerAnalytics, getDashboardMetrics, getLargestPurchase } from '@/domain/analytics';
import { useAnalyticsData } from '@/infrastructure/use-analytics-data';
import { analyticsDataMode } from '@/infrastructure/data-source';
import { PeriodFilter } from '@/shared/PeriodFilter';
import { ErrorState, LoadingState } from '@/shared/LoadingState';
import { euro, shortDate } from '@/shared/format';

function StatCard({ title, value, note, icon: Icon }: {
  title: string; value: string; note: string; icon: LucideIcon;
}) {
  return <article className="stat-card">
    <div className="stat-top"><span>{title}</span><span className="stat-icon"><Icon size={18} /></span></div>
    <div className="stat-value">{value}</div><div className="stat-note">{note}</div>
  </article>;
}

export function DashboardPage() {
  const { data, isPending, error } = useAnalyticsData();
  const [year, setYear] = useState('all');
  const [fromMonth, setFromMonth] = useState('');
  const [toMonth, setToMonth] = useState('');

  if (isPending) return <LoadingState />;
  if (error || !data) return <ErrorState message={error instanceof Error ? error.message : 'Fonte de dados indisponível.'} />;

  const years = [...new Set(data.purchases.map((purchase) => new Date(purchase.date).getFullYear()))]
    .filter(Number.isFinite).sort((a, b) => b - a);
  const filteredPurchases = data.purchases.filter((purchase) => {
    const date = new Date(purchase.date);
    if (Number.isNaN(date.getTime())) return false;
    if (year !== 'all' && date.getFullYear() !== Number(year)) return false;
    const month = purchase.date.slice(0, 7);
    if (fromMonth && month < fromMonth) return false;
    if (toMonth && month > toMonth) return false;
    return true;
  });

  const metrics = getDashboardMetrics(data.customers, filteredPurchases);
  const analytics = getCustomerAnalytics(data.customers, filteredPurchases);
  const largest = getLargestPurchase(filteredPurchases);
  const topCustomers = [...analytics].sort((a, b) => b.totalSpent - a.totalSpent).slice(0, 5);
  const latestPurchases = [...filteredPurchases].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 5);
  const totalsByMonth = new Map<string, number>();
  filteredPurchases.forEach((purchase) => {
    const month = purchase.date.slice(0, 7);
    totalsByMonth.set(month, (totalsByMonth.get(month) ?? 0) + purchase.totalAmount);
  });
  const monthlyData = [...totalsByMonth.entries()].sort(([a], [b]) => a.localeCompare(b)).map(([month, revenue]) => ({
    month: new Intl.DateTimeFormat('pt-PT', { month: 'short', year: '2-digit' }).format(new Date(`${month}-01T12:00:00`)),
    revenue,
  }));

  return (
    <>
      <div className="page-heading">
        <div><div className="eyebrow">MONITOR DE NEGÓCIO</div><h1>Visão geral</h1><p>Acompanhe o desempenho da sua base de clientes.</p></div>
        <span className="period-pill"><span className="period-dot" /> {analyticsDataMode}</span>
      </div>
      <div className="filter-panel">
        <div><strong>Período de análise</strong><small>Os indicadores e tabelas são recalculados para o intervalo escolhido.</small></div>
        <PeriodFilter year={year} years={years} fromMonth={fromMonth} toMonth={toMonth}
          onYearChange={setYear} onFromMonthChange={setFromMonth} onToMonthChange={setToMonth} />
      </div>
      <section className="stats-grid" aria-label="Indicadores principais">
        <StatCard title="Receita total" value={euro(metrics.totalRevenue)} note="No período selecionado" icon={Wallet} />
        <StatCard title="Clientes" value={String(metrics.totalCustomers)} note="Na base de clientes" icon={Users} />
        <StatCard title="Compras" value={String(metrics.totalPurchases)} note="Transações no período" icon={ShoppingBag} />
        <StatCard title="Ticket médio" value={euro(metrics.averageOrderValue)} note="Por compra no período" icon={ReceiptText} />
      </section>
      <section className="dashboard-grid">
        <article className="panel revenue-panel">
          <div className="panel-heading"><div><h2>Evolução da receita</h2><p>Receita mensal para o período selecionado</p></div></div>
          <div className="chart-wrap">{monthlyData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData} margin={{ top: 10, right: 8, left: -18, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#edf0ed" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#89918b', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#89918b', fontSize: 11 }} tickFormatter={(value) => '€' + (value / 1000) + 'k'} />
                <Tooltip formatter={(value) => euro(Number(value))} cursor={{ fill: '#f4f6f3' }} />
                <Bar dataKey="revenue" fill="#28664e" radius={[5, 5, 0, 0]} maxBarSize={38} />
              </BarChart>
            </ResponsiveContainer>
          ) : <div className="empty-chart">Sem compras no período selecionado.</div>}</div>
        </article>
        <article className="panel highlight-panel">
          <div className="panel-heading"><div><h2>Compra de maior valor</h2><p>Maior transação do período</p></div><span className="highlight-icon"><Sparkles size={17} /></span></div>
          {largest ? <div className="largest-value">{euro(largest.totalAmount)}</div> : <div className="largest-empty">Sem compras neste período</div>}
          <div className="highlight-divider" />
          <div className="highlight-detail"><span>Referência</span><strong>{largest?.id ?? '—'}</strong></div>
          <div className="highlight-detail"><span>Data</span><strong>{shortDate(largest?.date)}</strong></div>
          <div className="highlight-detail"><span>Cliente</span><strong>{data.customers.find((customer) => customer.id === largest?.customerId)?.name ?? '—'}</strong></div>
        </article>
      </section>
      <section className="bottom-grid">
        <article className="panel table-panel">
          <div className="panel-heading"><div><h2>Clientes em destaque</h2><p>Ordenados pelo valor comprado no período</p></div><Link to="/customers" className="text-link">Ver todos <ArrowRight size={14} /></Link></div>
          <div className="table-scroll"><table><thead><tr><th>CLIENTE</th><th>COMPRAS</th><th>VALOR TOTAL</th></tr></thead><tbody>
            {topCustomers.map((item) => <tr key={item.customer.id}><td><div className="customer-cell"><span className="avatar">{item.customer.name.split(' ').map((part) => part[0]).slice(0, 2).join('')}</span><span><strong>{item.customer.name}</strong><small>{item.customer.city ?? '—'}</small></span></div></td><td>{item.purchaseCount}</td><td className="amount-cell">{euro(item.totalSpent)}</td></tr>)}
            {topCustomers.length === 0 && <tr><td colSpan={3} className="empty-state">Sem dados para o período.</td></tr>}
          </tbody></table></div>
        </article>
        <article className="panel latest-panel">
          <div className="panel-heading"><div><h2>Compras recentes</h2><p>Últimas transações no período</p></div></div>
          <div className="activity-list">{latestPurchases.map((purchase) => <div className="activity-item" key={purchase.id}><span className="activity-icon"><ShoppingBag size={16} /></span><span className="activity-copy"><strong>{data.customers.find((customer) => customer.id === purchase.customerId)?.name ?? 'Cliente'}</strong><small>{purchase.id} · {shortDate(purchase.date)}</small></span><strong className="activity-amount">{euro(purchase.totalAmount)}</strong></div>)}
            {latestPurchases.length === 0 && <div className="empty-state">Sem compras no período.</div>}
          </div>
        </article>
      </section>
    </>
  );
}