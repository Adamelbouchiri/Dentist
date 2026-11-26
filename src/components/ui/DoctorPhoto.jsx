import { useState } from "react";
import { FaUserDoctor } from "react-icons/fa6";

/**
 * Doctor portrait with a branded "doctor" icon when there is no photo
 * (or the photo fails to load). `className` sizes/positions both variants.
 */
export const DoctorPhoto = ({ doctor, alt = "", className = "", iconClassName = "size-1/3", ...props }) => {
  const [failed, setFailed] = useState(false);

  if (doctor?.image && !failed) {
    return <img src={doctor.image} alt={alt} onError={() => setFailed(true)} className={className} {...props} />;
  }

  return (
    <div
      role={alt ? "img" : undefined}
      aria-label={alt || undefined}
      aria-hidden={alt ? undefined : true}
      className={`grid place-items-center bg-gradient-to-br from-primary-50 to-accent-50 text-primary-500 ${className}`}
    >
      <FaUserDoctor className={iconClassName} />
    </div>
  );
};
