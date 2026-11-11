import { useCallback, useState } from "react";

/**
 * Shared demo checkout flow: payment modal → success → confirm callback.
 */
export function useBookingCheckout({ onConfirm, onComplete }) {
  const [showPayment, setShowPayment] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const openCheckout = useCallback(() => setShowPayment(true), []);

  const handlePayNow = useCallback(async () => {
    setIsProcessing(true);
    await new Promise((resolve) => setTimeout(resolve, 1200));
    setIsProcessing(false);
    setShowPayment(false);
    setShowSuccess(true);
  }, []);

  const handleSuccessDone = useCallback(async () => {
    try {
      if (onConfirm) await onConfirm();
      setShowSuccess(false);
      if (onComplete) onComplete();
    } catch (error) {
      throw error;
    }
  }, [onConfirm, onComplete]);

  return {
    showPayment,
    setShowPayment,
    showSuccess,
    setShowSuccess,
    isProcessing,
    openCheckout,
    handlePayNow,
    handleSuccessDone,
  };
}
