"use client";

const testimonials = [
  {
    stars: 5,
    text: "Shipped our side project in one afternoon. CloudLight just works. No YAML, no Kubernetes nightmares.",
    highlight: "CloudLight just works.",
    name: "A. Rahman",
    role: "Indie Developer",
    init: "AR",
    gradient: "from-cyan to-blue-500",
  },
  {
    stars: 5,
    text: "The live log streaming is incredible. I can watch my app boot up in real time. Nothing else does this so cleanly.",
    highlight: "watch my app boot up in real time.",
    name: "S. Mehta",
    role: "Backend Engineer",
    init: "SM",
    gradient: "from-blue-400 to-cyan",
  },
  {
    stars: 5,
    text: "We moved 6 internal tools to CloudLight last month. Deployment time went from hours to seconds.",
    highlight: "Deployment time went from hours to seconds.",
    name: "T. Nakamura",
    role: "CTO @ Stackr",
    init: "TN",
    gradient: "from-cyan to-teal-400",
  },
];

export default function Testimonials() {
  return (
    <section id="testimonials" className="max-w-[1200px] mx-auto px-12 py-28">
      {/* Header */}
      <div className="reveal mb-16">
        <p className="font-mono text-[11px] tracking-[0.12em] uppercase text-cyan mb-4">
          // CUSTOMERS
        </p>
        <h2
          className="font-display font-extrabold tracking-[-1.5px] leading-[1.05] text-white"
          style={{ fontSize: "clamp(36px, 4vw, 56px)" }}
        >
          Trusted by builders.
        </h2>
      </div>

      {/* Cards */}
      <div className="reveal grid grid-cols-1 md:grid-cols-3 gap-5">
        {testimonials.map((t) => (
          <TestiCard key={t.name} t={t} />
        ))}
      </div>
    </section>
  );
}

function TestiCard({ t }) {
  // Bold the highlight text
  const parts = t.text.split(t.highlight);

  return (
    <div className="group bg-surface border border-white/[0.07] hover:border-cyan/20 transition-all duration-300 rounded-xl p-7">
      {/* Stars */}
      <div className="flex gap-0.5 mb-4">
        {Array.from({ length: t.stars }).map((_, i) => (
          <span key={i} className="text-gold text-[14px]">
            ★
          </span>
        ))}
      </div>

      {/* Text */}
      <p className="text-[15px] text-muted leading-[1.7] mb-5">
        {parts[0]}
        <em className="not-italic text-white font-medium">{t.highlight}</em>
        {parts[1]}
      </p>

      {/* Author */}
      <div className="flex items-center gap-3">
        <div
          className={`w-9 h-9 rounded-full bg-gradient-to-br ${t.gradient} flex items-center justify-center font-display text-[13px] font-extrabold text-bg flex-shrink-0`}
        >
          {t.init}
        </div>
        <div>
          <div className="font-display font-bold text-[14px] text-white">
            {t.name}
          </div>
          <div className="font-mono text-[11px] tracking-[0.04em] text-muted">
            {t.role}
          </div>
        </div>
      </div>
    </div>
  );
}
