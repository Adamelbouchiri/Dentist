import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_KEY);

const StripeWrapper = ({ children }) => <Elements stripe={stripePromise}>{children}</Elements>;

export default StripeWrapper;
