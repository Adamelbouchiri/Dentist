// utils/flash.jsx
let handler = null;

export const flash = {
  show: (text, type = "success", duration = 3000) => {
    if (handler) handler({ text, type, duration });
  },
  onShow: (fn) => {
    handler = fn;
  },
  off: () => {
    handler = null;
  },
};
