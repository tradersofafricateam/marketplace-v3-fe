import { useState } from "react";

export const useOrderQuantity = (minOrdersAllowed: number, maxQuantity: number) => {
  const [selection, setSelection] = useState({
    minimum: minOrdersAllowed,
    maximum: maxQuantity,
    quantity: minOrdersAllowed,
  });

  const clamp = (value: number) =>
    Math.min(Math.max(value, minOrdersAllowed), Math.max(maxQuantity, minOrdersAllowed));

  const constrainedQuantity = clamp(
    selection.minimum === minOrdersAllowed
      ? selection.quantity
      : minOrdersAllowed,
  );

  if (
    selection.minimum !== minOrdersAllowed ||
    selection.maximum !== maxQuantity
  ) {
    setSelection({
      minimum: minOrdersAllowed,
      maximum: maxQuantity,
      quantity: constrainedQuantity,
    });
  }

  const updateQuantity = (update: (current: number) => number) =>
    setSelection((current) => {
      const currentQuantity =
        current.minimum === minOrdersAllowed
          ? clamp(current.quantity)
          : minOrdersAllowed;

      return {
        minimum: minOrdersAllowed,
        maximum: maxQuantity,
        quantity: clamp(update(currentQuantity)),
      };
    });

  const increment = (step = 1) =>
    updateQuantity((current) => current + step);
  const decrement = (step = 1) =>
    updateQuantity((current) => current - step);
  const setValue = (value: number) => updateQuantity(() => value);

  return {
    quantity: constrainedQuantity,
    increment,
    decrement,
    setValue,
  };
};
