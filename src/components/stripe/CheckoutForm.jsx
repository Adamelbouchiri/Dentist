// src/components/stripe/CheckoutForm.jsx
import React from "react";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import axios from "axios";

const CheckoutForm = ({ amount, email, onSuccess, serviceName }) => {
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    try {
      // Call your Laravel backend to create a payment intent
      const response = await axios.post(
        "http://localhost:8000/api/create-payment-intent",
        {
          amount: amount * 100, // amount in cents
          email,
        }
      );

      const clientSecret = response.data.clientSecret;

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: { email },
        },
      });

      if (result.error) {
        alert(result.error.message);
      } else {
        if (result.paymentIntent.status === "succeeded") {
          alert("Payment successful");
          onSuccess(result.paymentIntent); // pass to parent
        }
      }
    } catch (error) {
      console.error("Payment error:", error);
      alert("An error occurred while processing the payment.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Card Details
        </label>
        <div className="p-3 border border-gray-300 rounded-lg">
          <CardElement />
        </div>
      </div>

      <div className="border-t border-gray-200 pt-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-600">Service: {serviceName}</span>
          <span className="text-sm text-gray-900">${amount}</span>
        </div>
        <div className="flex justify-between items-center mb-4">
          <span className="text-lg font-semibold text-gray-900">Total</span>
          <span className="text-lg font-semibold text-gray-900">${amount}</span>
        </div>
        <button
          type="submit"
          className="w-full bg-primary-500 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-600 cursor-pointer transition duration-300 ease-in-out"
        >
          Pay ${amount}
        </button>
      </div>
    </form>
  );
};

export default CheckoutForm;
