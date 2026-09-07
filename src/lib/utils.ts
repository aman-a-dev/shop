export { cn } from "cn";

export function formattedPrice(price: string | number | null | undefined) {
  if (price == null) return "—";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "ETB",
  }).format(Number(price));
}
