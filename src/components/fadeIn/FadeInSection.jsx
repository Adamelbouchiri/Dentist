import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

export const FadeInSection = ({ children, delay = 0.1 }) => {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.08 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 48 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 1, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
};
