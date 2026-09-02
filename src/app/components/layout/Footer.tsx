export default function Footer() {
  return (
    <footer className="site-footer">
      <div>
        <strong>COLLESIUM ATHLETICS</strong>
        <p>Built for athletes who refuse to settle.</p>
      </div>
      <span>© {new Date().getFullYear()} Collesium Athletics</span>
    </footer>
  );
}
