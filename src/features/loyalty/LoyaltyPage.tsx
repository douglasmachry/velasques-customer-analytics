import { Award, Medal, Sparkles, Trophy } from 'lucide-react';
import { demoCustomers, demoPurchases } from '@/data/demo-data';
import { getLoyaltyRanking } from '@/domain/analytics';
import { euro } from '@/shared/format';

const ranking = getLoyaltyRanking(demoCustomers, demoPurchases);

export function LoyaltyPage() {
  return (
    <>
      <div className="page-heading"><div><div className="eyebrow">RETENÇÃO & RECORRÊNCIA</div><h1>Fidelização</h1><p>Identifique quem mais regressa e quais os produtos preferidos.</p></div><div className="period-pill"><Sparkles size={15} /> Ranking demonstrativo</div></div>
      <section className="loyalty-summary"><div className="loyalty-summary-icon"><Trophy size={22} /></div><div><strong>Frequência antes do volume</strong><p>O ranking considera o número de compras. Em caso de empate, o valor total comprado é usado como critério secundário.</p></div></section>
      <section className="panel ranking-panel">
        <div className="panel-heading"><div><h2>Ranking de clientes</h2><p>Frequência de compras e produto mais recorrente</p></div></div>
        <div className="ranking-list">
          {ranking.map((item, index) => <article className="ranking-row" key={item.customer.id}>
            <div className={index === 0 ? 'rank-number rank-1' : index === 1 ? 'rank-number rank-2' : index === 2 ? 'rank-number rank-3' : 'rank-number'}>{index === 0 ? <Trophy size={17} /> : index === 1 ? <Medal size={17} /> : index === 2 ? <Award size={17} /> : String(index + 1).padStart(2, '0')}</div>
            <div className="customer-cell"><span className="avatar">{item.customer.name.split(' ').map((part) => part[0]).slice(0, 2).join('')}</span><span><strong>{item.customer.name}</strong><small>{item.customer.city}</small></span></div>
            <div className="ranking-stat"><strong>{item.purchaseCount}</strong><small>compras</small></div>
            <div className="ranking-stat"><strong>{euro(item.totalSpent)}</strong><small>valor total</small></div>
            <div className="product-pref"><small>PRODUTO PREFERIDO</small><strong>{item.mostPurchasedProduct ?? '—'}</strong></div>
          </article>)}
        </div>
      </section>
    </>
  );
}