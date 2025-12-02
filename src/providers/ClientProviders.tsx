"use client";

import { useEffect } from "react";
import { Provider, useStore } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor, type RootState } from "@/store/store";
import { selectTheme } from "@/store/selectors";

function ThemeInitializer({ children }: { children: React.ReactNode }) {
  const storeInstance = useStore();

  useEffect(() => {
    const updateTheme = () => {
      const state = storeInstance.getState() as RootState;
      const theme = selectTheme(state);
      const root = document.documentElement;

      if (theme === "dark") {
        root.classList.add("dark");
      } else {
        root.classList.remove("dark");
      }
    };

    updateTheme();

    const unsubscribe = storeInstance.subscribe(() => {
      setTimeout(updateTheme, 0);
    });

    return () => unsubscribe();
  }, [storeInstance]);

  return <>{children}</>;
}

export default function ClientProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ThemeInitializer>{children}</ThemeInitializer>
      </PersistGate>
    </Provider>
  );
}
