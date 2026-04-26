const Card = ({ children, className = "" }) => (
  <section
    className={`rounded-lg border border-white/10 bg-white/[0.055] shadow-panel backdrop-blur-xl ${className}`}
  >
    {children}
  </section>
);

export default Card;
