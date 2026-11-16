import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ShoppingBag, Sparkles } from 'lucide-react';
import { useAnalyticsData } from '@/infrastructure/use-analytics-data';
import { getCustomerAnalytics } from '@/domain/analytics';
import { ErrorState, LoadingState } from '@/shared/LoadingState';
import { euro, shortDate } from '@/shared/format';

export function CustomerDetailPage() {
  const { customerId } = useParams();
  const { data, isPending, error } = useAnalyticsData();

  if (isPending) return <LoadingState />;
  if (error || !data) return <ErrorState message={error instanceof Error ? error.message : 'Fonte de dados indisponível.'} />;

  const customer = data.customers.find((item) => item.id === customerId);
  if (!customer) return <div className="state-panel"><strong>Cliente não encontrado.</strong><p>Este registo pode ter sido removido da fonte de dados.</p><Link to="/customers" className="text-link"><ArrowLeft size={14} /> Voltar aos clientes</Link></div>;

  const purchases = data.purchases.filter((purchase) => purchase.customerId === customer.id)
    .sort((a, b) => b.date.localeCompare(a.date));
  const analytics = getCustomerAnalytics([customer], purchases)[0];
  const initials = customer.name.split(' ').map((part) => part[0]).slice(0, 2).join('');

  return (
    <>
      <Link to="/customers" className="back-link"><ArrowLeft size={15} /> Voltar aos clientes</Link>
      <div className="customer-profile-heading">
        <div className="profile-avatar">{initials}</div>
        <div><div className="eyebrow">PERFIL DO CLIENTE</div><h1>{customer.name}</h1><p>{[customer.city, customer.email].filter(Boolean).join(' · ') || 'Dados de contacto não disponíveis'}</p></div>
      </div>
      <section className="stats-grid customer-stats">
        <article className="stat-card"><div className="stat-top"><span>Valor total comprado</span></div><div className="stat-value">{euro(analytics.totalSpent)}</div><div className="stat-note">Soma de todas as compras</div></article>
        <article className="stat-card"><div className="stat-top"><span>Compras</span></div><div className="stat-value">{analytics.purchaseCount}</div><div className="stat-note">Transações registadas</div></article>
        <article className="stat-card"><div className="stat-top"><span>Ticket médio</span></div><div className="stat-value">{euro(analytics.averageOrderValue)}</div><div className="stat-note">Valor médio por compra</div></article>
        <article className="stat-card"><div className="stat-top"><span>Última compra</span></div><div className="stat-value date-stat">{shortDate(analytics.lastPurchaseDate)}</div><div className="stat-note">Data mais recente</div></article>
      </section>
      <section className="panel customer-recommendation">
        <span className="recommendation-icon"><Sparkles size={18} /></span>
        <div><small>RECOMENDAÇÃO BASEADA NO HISTÓRICO</small><strong>{analytics.mostPurchasedProduct ?? 'Ainda sem produto recorrente'}</strong><p>Produto que aparece com maior frequência nas linhas de compra deste cliente.</p></div>
      </section>
      <section className="panel history-panel">
        <div className="panel-heading"><div><h2>Histórico de compras</h2><p>{purchases.length} transações associadas a este cliente</p></div></div>
        {purchases.length > 0 ? <div className="purchase-history">{purchases.map((purchase) => <article className="purchase-history-row" key={purchase.id}>
          <span className="history-icon"><ShoppingBag size={17} /></span>
          <div className="history-main"><strong>{purchase.id}</strong><small>{shortDate(purchase.date)} · {purchase.items.length} {purchase.items.length === 1 ? 'produto' : 'produtos'}</small>
            {purchase.items.length > 0 && <div className="purchase-products">{purchase.items.map((item, index) => <span key={`${purchase.id}-${index}`}>{item.product}{item.variety ? ` · ${item.variety}` : ''}</span>)}</div>}
          </div>
          <strong className="history-amount">{euro(purchase.totalAmount)}</strong>
        </article>)}</div> : <div className="empty-state">Este cliente ainda não tem compras registadas.</div>}
      </section>
    </>
  );
}