import { useState } from "react";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { FiLock } from "react-icons/fi";
import { api } from "../../lib/api";
import { flash } from "../../utils/flash";
import { Button } from "../ui/Button";

const cardStyle = {
  style: {
    base: {
      fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif',
      fontSize: "15px",
      color: "#0b0a1a",
      "::placeholder": { color: "#b4b4c8" },
    },
    invalid: { color: "#ef4444" },
  },
};

const CheckoutForm = ({ amount, email, onSuccess, disabled }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setLoading(true);

    try {
      const { data } = await api.post("/create-payment-intent", {
        amount: amount * 100, // cents
        email,
      });

      const result = await stripe.confirmCardPayment(data.clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: { email },
        },
      });

      if (result.error) {
        flash.show(result.error.message, "error", 3000);
      } else if (result.paymentIntent.status === "succeeded") {
        flash.show("Payment successful", "success", 2000);
        onSuccess(result.paymentIntent);
      }
    } catch (error) {
      console.error("Payment error:", error);
      flash.show("An error occurred while processing the payment.", "error", 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <p className="mb-2 text-[13px] font-semibold text-ink-700">Card details</p>
        <div className="rounded-2xl bg-white px-4 py-4 ring-1 ring-inset ring-ink-200 transition focus-within:ring-2 focus-within:ring-primary-500">
          <CardElement options={cardStyle} />
        </div>
      </div>
      <Button type="submit" size="lg" className="w-full" loading={loading} disabled={!stripe || disabled}>
        {!loading && <FiLock className="size-4" />} Pay ${amount.toLocaleString()}
      </Button>
    </form>
  );
};

export default CheckoutForm;
