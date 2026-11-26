import { useState } from "react";
import { FiStar } from "react-icons/fi";

export const StarRating = ({ value, onChange, size = "size-7", readOnly = false }) => {
  const [hover, setHover] = useState(0);
  const shown = hover || value;
  return (
    <div className="flex gap-1" onMouseLeave={() => setHover(0)} dir="ltr">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          disabled={readOnly}
          onMouseEnter={() => !readOnly && setHover(n)}
          onClick={() => onChange?.(n)}
          aria-label={`${n} / 5`}
          className={`transition-transform ${readOnly ? "cursor-default" : "hover:scale-110"}`}
        >
          <FiStar className={`${size} ${n <= shown ? "fill-amber-400 text-amber-400" : "text-ink-200"}`} />
        </button>
      ))}
    </div>
  );
};
