export function LoadingState() {
  return <div className="state-panel" role="status">A carregar dados de analytics…</div>;
}

export function ErrorState({ message }: { message: string }) {
  return (
    <div className="state-panel state-error" role="alert">
      <strong>Não foi possível carregar os dados</strong>
      <p>{message}</p>
      <small>Verifique a configuração da fonte de dados e tente novamente.</small>
    </div>
  );
}
