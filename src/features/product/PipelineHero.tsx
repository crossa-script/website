import { motion, useReducedMotion } from "motion/react";
import { motionTokens } from "../../app/motion";
import { Visual } from "./Visual";

export function PipelineHero(): React.JSX.Element {
  const reduced = useReducedMotion();
  return <motion.div className="pipeline-hero" initial={reduced ? false : { clipPath: "inset(0 0 100% 0)" }} animate={{ clipPath: "inset(0 0 0% 0)" }} transition={{ duration: motionTokens.duration.narrative * 3, ease: motionTokens.easing.standard }}><Visual name="pipeline" eager /><svg className="pipeline-trace" viewBox="0 0 640 630" aria-hidden="true"><motion.path d="M320 192V225M320 291V327M320 430V464H154V501M320 464H486V501" fill="none" stroke="var(--accent-strong)" strokeWidth="3" initial={reduced ? false : { pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }} transition={{ duration: motionTokens.duration.narrative * 3, ease: motionTokens.easing.standard }} /></svg></motion.div>;
}
