// components/FlashMessage.jsx
import { useEffect, useState } from "react";
import { flash } from "../utils/flash";
import { AnimatePresence, motion } from "framer-motion";

const typeStyles = {
  success: "bg-green-500",
  error: "bg-red-500",
  info: "bg-blue-500",
  warning: "bg-yellow-400 text-black",
};

const FlashMessage = () => {
  const [message, setMessage] = useState(null);

  useEffect(() => {
    flash.onShow((msg) => {
      setMessage(msg);
      setTimeout(() => setMessage(null), msg.duration || 3000);
    });

    return () => flash.off();
  }, []);

  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -40 }}
          transition={{ duration: 0.4 }}
          className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-[90%] max-w-md px-4 py-3 rounded-md shadow-md text-white flex justify-between items-center ${typeStyles[message.type]}`}
        >
          <span className="text-sm sm:text-base">{message.text}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FlashMessage;
