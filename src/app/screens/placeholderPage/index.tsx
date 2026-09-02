interface PlaceholderPageProps {
  title: string;
}

export default function PlaceholderPage({ title }: PlaceholderPageProps) {
  return (
    <main className="placeholder-page">
      <span>COLLESIUM ATHLETICS</span>
      <h1>{title}</h1>
      <p>This section will be connected to the Collesium backend next.</p>
    </main>
  );
}
