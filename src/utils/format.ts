export function formatPrice(price: number): string {
  return `$${price.toFixed(2)}`;
}

export function formatRating(rating: number | undefined | null): string {
  if (rating === undefined || rating === null) {
    return "-";
  }
  return rating.toFixed(1);
}

