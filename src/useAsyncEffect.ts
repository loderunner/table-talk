import { DependencyList, useEffect } from 'react';

type AsyncDestructor = () => Promise<void>;
type AsyncEffectCallback = () => Promise<void> | Promise<AsyncDestructor>;

export function useAsyncEffect(
  callback: AsyncEffectCallback,
  deps?: DependencyList,
): void {
  useEffect(() => {
    const destructorPromise = callback();
    return () => {
      (async () => {
        const destructor = await destructorPromise;
        if (destructor) {
          await destructor();
        }
      })();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
