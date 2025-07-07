// src/components/stripe/StripeWrapper.jsx
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe("pk_test_51RhEtHFzo2bzTDFzv7f0mlhP8wlDBrCmmzmZnQW8w6qaqKaELQx24uIB7qUvqXP3ozPd4FRQi423b4LlcR296jMZ00Av6nhFqh");

const StripeWrapper = ({ children }) => {
  return <Elements stripe={stripePromise}>{children}</Elements>;
};

export default StripeWrapper;
