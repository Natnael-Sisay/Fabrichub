"use client";

import { useEffect } from "react";
import { Provider, useStore } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor, type RootState } from "@/store/store";
import { selectTheme } from "@/store/selectors";

function ThemeInitializer({ children }: { children: React.ReactNode }) {
  const storeInstance = useStore();

  useEffect(() => {
    const root = document.documentElement;
    let previousTheme = selectTheme(storeInstance.getState() as RootState);

    const updateTheme = () => {
      const state = storeInstance.getState() as RootState;
      const theme = selectTheme(state);

      if (theme !== previousTheme) {
        if (theme === "dark") {
          root.classList.add("dark");
        } else {
          root.classList.remove("dark");
        }
        previousTheme = theme;
      }
    };

    updateTheme();

    const unsubscribe = storeInstance.subscribe(updateTheme);

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
      <PersistGate
        loading={null}
        persistor={persistor}
        onBeforeLift={() => {
          const state = store.getState() as RootState;
          const theme = selectTheme(state);
          const root = document.documentElement;

          if (theme === "dark") {
            root.classList.add("dark");
          } else {
            root.classList.remove("dark");
          }
        }}
      >
        <ThemeInitializer>{children}</ThemeInitializer>
      </PersistGate>
    </Provider>
  );
}
