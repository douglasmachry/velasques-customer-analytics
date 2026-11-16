import { useMemo, useState } from 'react';
import { Search, Users } from 'lucide-react';
import { demoCustomers, demoPurchases } from '@/data/demo-data';
import { getCustomerAnalytics } from '@/domain/analytics';
import { euro, shortDate } from '@/shared/format';

export function CustomersPage() {
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<'spend' | 'name' | 'orders'>('spend');
  const rows = useMemo(() => {
    const query = search.trim().toLocaleLowerCase('pt-PT');
    return getCustomerAnalytics(demoCustomers, demoPurchases)
      .filter(({ customer }) => !query || customer.name.toLocaleLowerCase('pt-PT').includes(query) || customer.city?.toLocaleLowerCase('pt-PT').includes(query))
      .sort((a, b) => sort === 'name'
        ? a.customer.name.localeCompare(b.customer.name)
        : sort === 'orders' ? b.purchaseCount - a.purchaseCount : b.totalSpent - a.totalSpent);
  }, [search, sort]);

  return (
    <>
      <div className="page-heading"><div><div className="eyebrow">RELACIONAMENTO</div><h1>Clientes</h1><p>Consulte hábitos de compra e valor gerado por cliente.</p></div><div className="period-pill"><Users size={15} /> {rows.length} clientes</div></div>
      <section className="panel directory-panel">
        <div className="toolbar">
          <label className="search-box"><Search size={17} /><input aria-label="Pesquisar clientes" placeholder="Pesquisar por nome ou cidade..." value={search} onChange={(event) => setSearch(event.target.value)} /></label>
          <label className="sort-control">Ordenar por <select aria-label="Ordenar clientes" value={sort} onChange={(event) => setSort(event.target.value as typeof sort)}><option value="spend">Maior valor</option><option value="orders">Mais compras</option><option value="name">Nome</option></select></label>
        </div>
        <div className="table-scroll"><table><thead><tr><th>CLIENTE</th><th>LOCALIDADE</th><th>COMPRAS</th><th>VALOR TOTAL</th><th>ÚLTIMA COMPRA</th></tr></thead><tbody>
          {rows.map(({ customer, purchaseCount, totalSpent, lastPurchaseDate }) => <tr key={customer.id}><td><div className="customer-cell"><span className="avatar">{customer.name.split(' ').map((part) => part[0]).slice(0, 2).join('')}</span><span><strong>{customer.name}</strong><small>{customer.email}</small></span></div></td><td>{customer.city}</td><td>{purchaseCount}</td><td className="amount-cell">{euro(totalSpent)}</td><td>{shortDate(lastPurchaseDate)}</td></tr>)}
          {rows.length === 0 && <tr><td colSpan={5} className="empty-state">Não foram encontrados clientes.</td></tr>}
        </tbody></table></div>
      </section>
    </>
  );
}