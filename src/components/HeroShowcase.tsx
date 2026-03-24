import { useEffect, useState } from "react";

type Slide = {
  title: string;
  tag: string;
  status: string;
  platforms: string;
  summary: string;
  image: string;
  logo: string;
  video: string;
  primaryCta: { href: string; label: string };
  secondaryCta: { href: string; label: string };
};

type Props = {
  slides: Slide[];
};

export default function HeroShowcase({ slides }: Props) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % slides.length);
    }, 7000);

    return () => window.clearInterval(timer);
  }, [slides.length]);

  const active = slides[activeIndex];

  return (
    <section className="hero-showcase">
      <div className="hero-showcase__backdrop">
        <img src={active.image} alt={active.title} />
        <video key={active.video} autoPlay muted loop playsInline>
          <source src={active.video} type="video/webm" />
        </video>
        <div className="hero-showcase__veil" />
      </div>

      <div className="hero-showcase__content">
        <p className="section-label">{active.tag}</p>
        <div className="hero-showcase__logo-wrap">
          <img className="hero-showcase__logo" src={active.logo} alt={active.title} />
        </div>
        <h1>{active.title}</h1>
        <p className="hero-showcase__summary">{active.summary}</p>
        <div className="hero-showcase__meta">
          <div>
            <span>Status</span>
            <strong>{active.status}</strong>
          </div>
          <div>
            <span>Positioning</span>
            <strong>{active.platforms}</strong>
          </div>
        </div>
        <div className="cta-row">
          <a className="button button--primary" href={active.primaryCta.href}>
            {active.primaryCta.label}
          </a>
          <a className="button button--ghost" href={active.secondaryCta.href}>
            {active.secondaryCta.label}
          </a>
        </div>
      </div>

      <div className="hero-showcase__thumbs" aria-label="Featured projects">
        {slides.map((slide, index) => (
          <button
            key={slide.title}
            type="button"
            className={index === activeIndex ? "is-active" : ""}
            onClick={() => setActiveIndex(index)}
            aria-label={`Show ${slide.title}`}
          >
            <img src={slide.image} alt="" />
            <span>{slide.title}</span>
          </button>
        ))}
      </div>
    </section>
  );
}
