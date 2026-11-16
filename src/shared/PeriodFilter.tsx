interface PeriodFilterProps {
  year: string;
  years: number[];
  fromMonth: string;
  toMonth: string;
  onYearChange: (value: string) => void;
  onFromMonthChange: (value: string) => void;
  onToMonthChange: (value: string) => void;
}

export function PeriodFilter({
  year, years, fromMonth, toMonth, onYearChange, onFromMonthChange, onToMonthChange,
}: PeriodFilterProps) {
  return (
    <div className="period-filters" aria-label="Filtros de período">
      <label><span>Ano</span><select value={year} onChange={(event) => onYearChange(event.target.value)}>
        <option value="all">Todos</option>
        {years.map((availableYear) => <option key={availableYear} value={availableYear}>{availableYear}</option>)}
      </select></label>
      <label><span>De</span><input type="month" value={fromMonth} onChange={(event) => onFromMonthChange(event.target.value)} /></label>
      <label><span>Até</span><input type="month" value={toMonth} min={fromMonth || undefined} onChange={(event) => onToMonthChange(event.target.value)} /></label>
      <button type="button" className="clear-filter" onClick={() => { onYearChange('all'); onFromMonthChange(''); onToMonthChange(''); }}>Limpar</button>
    </div>
  );
}