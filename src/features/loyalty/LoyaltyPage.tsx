import { useState } from 'react';
import { Award, Medal, Sparkles, Trophy } from 'lucide-react';
import { getLoyaltyRanking } from '@/domain/analytics';
import { useAnalyticsData } from '@/infrastructure/use-analytics-data';
import { ErrorState, LoadingState } from '@/shared/LoadingState';
import { PeriodFilter } from '@/shared/PeriodFilter';
import { euro } from '@/shared/format';

export function LoyaltyPage() {
  const { data, isPending, error } = useAnalyticsData();
  const [year, setYear] = useState('all');
  const [fromMonth, setFromMonth] = useState('');
  const [toMonth, setToMonth] = useState('');

  if (isPending) return <LoadingState />;
  if (error || !data) return <ErrorState message={error instanceof Error ? error.message : 'Fonte de dados indisponível.'} />;

  const years = [...new Set(data.purchases.map((purchase) => new Date(purchase.date).getFullYear()))]
    .filter(Number.isFinite).sort((a, b) => b - a);
  const purchases = data.purchases.filter((purchase) => {
    const date = new Date(purchase.date);
    if (Number.isNaN(date.getTime())) return false;
    if (year !== 'all' && date.getFullYear() !== Number(year)) return false;
    const month = purchase.date.slice(0, 7);
    if (fromMonth && month < fromMonth) return false;
    if (toMonth && month > toMonth) return false;
    return true;
  });
  const ranking = getLoyaltyRanking(data.customers, purchases);

  return (
    <>
      <div className="page-heading"><div><div className="eyebrow">RETENÇÃO & RECORRÊNCIA</div><h1>Fidelização</h1><p>Identifique quem mais regressa e quais os produtos preferidos.</p></div><div className="period-pill"><Sparkles size={15} /> Ranking por frequência</div></div>
      <div className="filter-panel">
        <div><strong>Período de análise</strong><small>O ranking considera apenas as compras dentro do intervalo.</small></div>
        <PeriodFilter year={year} years={years} fromMonth={fromMonth} toMonth={toMonth}
          onYearChange={setYear} onFromMonthChange={setFromMonth} onToMonthChange={setToMonth} />
      </div>
      <section className="loyalty-summary"><div className="loyalty-summary-icon"><Trophy size={22} /></div><div><strong>Frequência antes do volume</strong><p>O ranking considera o número de compras. Em caso de empate, o valor total comprado é usado como critério secundário.</p></div></section>
      <section className="panel ranking-panel">
        <div className="panel-heading"><div><h2>Ranking de clientes</h2><p>Frequência de compras e produto mais recorrente · {purchases.length} compras analisadas</p></div></div>
        <div className="ranking-list">
          {ranking.map((item, index) => <article className="ranking-row" key={item.customer.id}>
            <div className={index === 0 ? 'rank-number rank-1' : index === 1 ? 'rank-number rank-2' : index === 2 ? 'rank-number rank-3' : 'rank-number'}>{index === 0 ? <Trophy size={17} /> : index === 1 ? <Medal size={17} /> : index === 2 ? <Award size={17} /> : String(index + 1).padStart(2, '0')}</div>
            <div className="customer-cell"><span className="avatar">{item.customer.name.split(' ').map((part) => part[0]).slice(0, 2).join('')}</span><span><strong>{item.customer.name}</strong><small>{item.customer.city ?? '—'}</small></span></div>
            <div className="ranking-stat"><strong>{item.purchaseCount}</strong><small>compras</small></div>
            <div className="ranking-stat"><strong>{euro(item.totalSpent)}</strong><small>valor total</small></div>
            <div className="product-pref"><small>PRODUTO PREFERIDO</small><strong>{item.mostPurchasedProduct ?? '—'}</strong></div>
          </article>)}
          {ranking.length === 0 && <div className="empty-state">Não existem clientes para o período selecionado.</div>}
        </div>
      </section>
    </>
  );
}