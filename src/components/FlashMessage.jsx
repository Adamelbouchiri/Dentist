import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FiAlertCircle, FiAlertTriangle, FiCheck, FiInfo, FiX } from "react-icons/fi";
import { flash } from "../utils/flash";

const tones = {
  success: { icon: FiCheck, chip: "bg-emerald-500 text-white", bar: "bg-emerald-500" },
  error: { icon: FiAlertCircle, chip: "bg-red-500 text-white", bar: "bg-red-500" },
  info: { icon: FiInfo, chip: "gradient-primary text-white", bar: "gradient-primary" },
  warning: { icon: FiAlertTriangle, chip: "bg-amber-400 text-ink-900", bar: "bg-amber-400" },
};

const FlashMessage = () => {
  const [message, setMessage] = useState(null);
  const timer = useRef();

  useEffect(() => {
    flash.onShow((msg) => {
      clearTimeout(timer.current);
      setMessage({ ...msg, id: Date.now() });
      timer.current = setTimeout(() => setMessage(null), msg.duration || 3000);
    });
    return () => {
      clearTimeout(timer.current);
      flash.off();
    };
  }, []);

  const tone = tones[message?.type] || tones.info;
  const Icon = tone.icon;

  return (
    <div className="pointer-events-none fixed inset-x-0 top-5 z-[200] flex justify-center px-4">
      <AnimatePresence mode="wait">
        {message && (
          <motion.div
            key={message.id}
            role="status"
            initial={{ opacity: 0, y: -24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16, scale: 0.98 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="pointer-events-auto relative flex w-full max-w-md items-center gap-3 overflow-hidden rounded-2xl bg-white/95 py-3 pe-10 ps-3 shadow-[0_20px_50px_-15px_rgb(11_10_26/0.3)] ring-1 ring-ink-200/70 backdrop-blur"
          >
            <span className={`grid size-8 shrink-0 place-items-center rounded-xl ${tone.chip}`}>
              <Icon className="size-4" />
            </span>
            <span className="text-sm font-medium text-ink-800">{message.text}</span>
            <button
              onClick={() => setMessage(null)}
              aria-label="×"
              className="absolute end-3 rounded-full p-1 text-ink-400 hover:bg-ink-100 hover:text-ink-700"
            >
              <FiX className="size-3.5" />
            </button>
            <motion.span
              className={`absolute bottom-0 start-0 h-0.5 ${tone.bar}`}
              initial={{ width: "100%" }}
              animate={{ width: 0 }}
              transition={{ duration: (message.duration || 3000) / 1000, ease: "linear" }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FlashMessage;
