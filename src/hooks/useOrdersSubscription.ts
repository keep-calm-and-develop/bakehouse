import { startOfDay } from "date-fns";
import { useEffect, useRef, useState } from "react";
import { subscribeToDayOrders } from "@/lib/orders";
import { useSetOrders } from "@/stores/ordersStore";

export function useOrdersSubscription(
  employeeId: string | undefined,
  selectedDay: Date,
) {
  const setOrders = useSetOrders();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const unsubscribeRef = useRef<(() => void) | null>(null);
  const dayKey = startOfDay(selectedDay).getTime();

  useEffect(() => {
    unsubscribeRef.current?.();
    unsubscribeRef.current = null;

    if (!employeeId) {
      setIsLoading(false);
      setError(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    const unsubscribe = subscribeToDayOrders(
      selectedDay,
      employeeId,
      (orders) => {
        setOrders(orders);
        setIsLoading(false);
      },
      (subscriptionError) => {
        console.error(subscriptionError);
        setError("Unable to load orders. Please try again.");
        setIsLoading(false);
      },
    );

    unsubscribeRef.current = unsubscribe;

    return () => {
      unsubscribe();
      unsubscribeRef.current = null;
    };
  }, [employeeId, dayKey, selectedDay, setOrders]);

  return { isLoading, error };
}
