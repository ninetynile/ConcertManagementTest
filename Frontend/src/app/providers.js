"use client";

import { ChakraProvider } from "@chakra-ui/react";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";

const emotionCache = createCache({
  key: "emotion-css",
  prepend: true,
});

export function Providers({ children }) {
  return (
    <CacheProvider value={emotionCache}>
      <ChakraProvider>{children}</ChakraProvider>
    </CacheProvider>
  );
}
