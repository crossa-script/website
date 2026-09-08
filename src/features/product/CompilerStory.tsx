import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { pipeline } from "../../content/product/story";
import { motionTokens } from "../../app/motion";

export function CompilerStory(): React.JSX.Element {
  const [active, setActive] = useState(0);
  const root = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => { for (const entry of entries) if (entry.isIntersecting) setActive(Number((entry.target as HTMLElement).dataset.step)); }, { rootMargin: "-25% 0px -45% 0px" });
    root.current?.querySelectorAll("[data-step]").forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);
  return <div className="compiler-story" ref={root}><div className="compiler-sticky" aria-hidden="true"><div className="compiler-progress">{pipeline.map((step, index) => <span key={step.title} className={index <= active ? "is-active" : ""}>{String(index + 1).padStart(2, "0")}</span>)}</div><motion.div key={active} initial={reduced ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: motionTokens.duration.normal }}><p>{pipeline[active]!.title}</p><pre>{pipeline[active]!.code}</pre></motion.div><div className="compiler-boundary">.cra → C++ compiler → platform surfaces</div></div><div className="compiler-steps">{pipeline.map((step, index) => <section key={step.title} data-step={index} className={index === active ? "is-active" : ""}><span className="step-number">0{index + 1}</span><h3>{step.title}</h3><p>{step.detail}</p><pre className="compiler-mobile-code">{step.code}</pre></section>)}</div></div>;
}
