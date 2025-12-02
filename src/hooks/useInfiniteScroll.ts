import { useEffect, useRef, useCallback, useState } from "react";

interface UseInfiniteScrollOptions {
  hasMore: boolean;
  isLoading: boolean;
  onLoadMore: () => void;
  itemCount: number;
  containerRef?: React.RefObject<HTMLElement | null>;
}

function getCardsPerRow(): number {
  if (typeof window === "undefined") return 1;
  const width = window.innerWidth;
  if (width >= 1280) return 5; // xl
  if (width >= 1024) return 3; // lg
  if (width >= 640) return 2;  // sm
  return 1; // mobile
}

export function useInfiniteScroll({
  hasMore,
  isLoading,
  onLoadMore,
  itemCount,
  containerRef,
}: UseInfiniteScrollOptions) {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const [cardsPerRow, setCardsPerRow] = useState(getCardsPerRow);

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const visible = entries.some((entry) => entry.isIntersecting);
      if (visible && hasMore && !isLoading) {
        onLoadMore();
      }
    },
    [hasMore, isLoading, onLoadMore]
  );

  useEffect(() => {
    const updateCardsPerRow = () => setCardsPerRow(getCardsPerRow());
    window.addEventListener("resize", updateCardsPerRow);
    return () => window.removeEventListener("resize", updateCardsPerRow);
  }, []);

  useEffect(() => {
    if (!hasMore || isLoading || itemCount === 0) return;

    const container = containerRef?.current || document;
    const cards = container.querySelectorAll('[data-product-card]');
    
    if (cards.length === 0) return;

    const totalRows = Math.ceil(itemCount / cardsPerRow);
    if (totalRows < 2) return; // Need at least 2 rows

    const secondToLastRowStart = (totalRows - 2) * cardsPerRow;
    const secondToLastRowEnd = Math.min(secondToLastRowStart + cardsPerRow, itemCount);
    
    const cardsToObserve: Element[] = [];
    for (let i = secondToLastRowStart; i < secondToLastRowEnd; i++) {
      if (cards[i]) cardsToObserve.push(cards[i]);
    }

    if (cardsToObserve.length === 0) return;

    observerRef.current = new IntersectionObserver(handleObserver, {
      root: null,
      rootMargin: "0px",
      threshold: 0.1,
    });

    cardsToObserve.forEach((card) => observerRef.current?.observe(card));

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [hasMore, isLoading, itemCount, cardsPerRow, handleObserver, containerRef]);

  return null;
}

