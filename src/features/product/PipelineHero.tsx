import { motion, useReducedMotion } from "motion/react";
import { motionTokens } from "../../app/motion";
import { Visual } from "./Visual";

export function PipelineHero(): React.JSX.Element {
  const reduced = useReducedMotion();
  return <div className="pipeline-hero"><Visual name="pipeline" eager /><svg className="pipeline-trace" viewBox="0 0 640 630" aria-hidden="true"><motion.path d="M320 180V225M320 291V327M320 430V464H154V501M320 464H486V501" fill="none" stroke="var(--accent-strong)" strokeWidth="3" initial={reduced ? false : { pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }} transition={{ duration: motionTokens.duration.narrative * 2, ease: motionTokens.easing.standard }} /></svg></div>;
}
