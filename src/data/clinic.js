export const clinic = {
  name: "Doctor Bennani",
  tagline: "Dentistry and Orthodontics",
  phone: "(123) 456-7890",
  phoneHref: "tel:+212767759400",
  email: "contact@yourclinic.com",
  address: "123 Smile Street, Suite 100, Casablanca",
  hours: "Mon – Sat · 9:00 – 18:00",
  mapsUrl:
    "https://www.google.com/maps/place/Mosqu%C3%A9e+Hassan-II/@33.608165,-7.6346101,16.25z/data=!4m6!3m5!1s0xda7d2607994d58f:0x67a1d618e7b0d072!8m2!3d33.6082229!4d-7.632668!16zL20vMDQzNjds",
  mapsEmbed:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d5588.412155722465!2d-7.634610083761219!3d33.608164985823414!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xda7d2607994d58f%3A0x67a1d618e7b0d072!2sMosqu%C3%A9e%20Hassan-II!5e0!3m2!1sfr!2sma!4v1749063889355!5m2!1sfr!2sma",
};

// `name` values are sent to the API as the appointment `service` — keep them stable.
export const services = [
  {
    id: "general",
    name: "General Checkups",
    desc: "Routine checkups, cleanings and preventive care to keep your teeth and gums healthy all year round.",
    icon: "/images/services-icon-1.png",
    price: 150,
    duration: "45 min",
  },
  {
    id: "whitening",
    name: "Teeth Whitening",
    desc: "Professional, safe and fast whitening treatments that brighten your smile by several shades in one visit.",
    icon: "/images/services-icon-2.png",
    price: 300,
    duration: "60 min",
  },
  {
    id: "braces",
    name: "Braces/Invisalign",
    desc: "Straighten your teeth with traditional braces or clear Invisalign aligners — discreet, effective, custom-fitted.",
    icon: "/images/services-icon-3.png",
    price: 2500,
    duration: "Consultation",
  },
  {
    id: "emergency",
    name: "Emergency Dentistry",
    desc: "Same-day appointments for toothaches, broken teeth or dental injuries — fast relief when you need it most.",
    icon: "/images/services-icon-4.png",
    price: 200,
    duration: "Same day",
  },
  {
    id: "cosmetic",
    name: "Cosmetic Dentistry",
    desc: "Smile makeovers with veneers, bonding and contouring to enhance your teeth and boost your confidence.",
    icon: "/images/services-icon-5.png",
    price: 800,
    duration: "90 min",
  },
];

export const doctors = [
  {
    id: 2,
    name: "Dr. Tayler Smith",
    speciality: "Orthodontist",
    rating: 4.8,
    image: "/images/doctor-2.jpg",
  },
  {
    id: 1,
    name: "Dr. Cris Waxon",
    speciality: "General Dentist",
    rating: 4.9,
    image: "/images/doctor-1.jpg",
  },
  {
    id: 3,
    name: "Dr. John Doe",
    speciality: "General Dentist",
    rating: 4.8,
    image: "/images/doctor-3.jpg",
  },
];

// Placeholder copy — replace with real patient reviews before going live.
export const testimonials = [
  {
    quote:
      "Absolutely the best dental experience I've ever had. The team made me feel so comfortable, and my cleaning was quick and painless.",
    name: "Sarah M.",
    title: "Product designer",
    image: "/images/testimonials-1.png",
  },
  {
    quote:
      "From the welcome at the front desk to the follow-up call, everything felt considered. My whitening results exceeded every expectation.",
    name: "Yasmine B.",
    title: "Architect",
  },
  {
    quote:
      "I came in with a cracked tooth on a Saturday and left without pain an hour later. Calm, precise and genuinely caring people.",
    name: "Karim E.",
    title: "Entrepreneur",
  },
];
