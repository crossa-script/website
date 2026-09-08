import { motion, useReducedMotion } from "motion/react";

import { motionTokens } from "../../app/motion";

interface PageTransitionProps {
  readonly children: React.ReactNode;
  readonly className?: string;
}

export function PageTransition({ children, className }: PageTransitionProps): React.JSX.Element {
  const reducedMotion = useReducedMotion();
  return <motion.div className={className} initial={reducedMotion ? false : { opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: motionTokens.duration.fast, ease: motionTokens.easing.standard }}>{children}</motion.div>;
}
