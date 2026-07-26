import React, { createContext, useContext, useMemo, useState } from 'react';

const ReadyContext = createContext({ ready: false, setReady: () => {} });

/**
 * Gate for the entrance sequence. Section timelines subscribe to this so
 * nothing animates underneath the preloader — otherwise the hero would
 * play its reveal to an empty room and be finished by the time the
 * curtain lifts.
 */
export const ReadyProvider = ({ children }) => {
  const [ready, setReady] = useState(false);
  const value = useMemo(() => ({ ready, setReady }), [ready]);
  return <ReadyContext.Provider value={value}>{children}</ReadyContext.Provider>;
};

export const useAppReady = () => useContext(ReadyContext);

export default ReadyProvider;
