// components/FadeInSection.jsx
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

export const FadeInSection = ({ children, delay = 0.2 }) => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.05,
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 90 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay }}
    >
      {children}
    </motion.div>
  );
};
