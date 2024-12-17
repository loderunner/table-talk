import { ReactNode, Suspense, lazy } from 'react';
import { Route, Router } from 'wouter';
import { useHashLocation } from 'wouter/use-hash-location';

import Chat from './Chat';
import Header from './Header';
import { OllamaProvider } from './OllamaContext.tsx';
import Settings from './Settings';
import { loadSettings } from './SettingsProvider.tsx';

const LazySettingsProvider = lazy(async () => {
  const initialSettings = await loadSettings();
  const { default: SettingsProvider } = await import('./SettingsProvider.tsx');
  return {
    default: ({ children }: { children?: ReactNode }) => (
      <SettingsProvider initialSettings={initialSettings}>
        {children}
      </SettingsProvider>
    ),
  };
});

function App() {
  return (
    <>
      <Suspense>
        <LazySettingsProvider>
          <OllamaProvider>
            <Router hook={useHashLocation}>
              <Route path="/">
                <div className="flex size-full flex-col">
                  <Header />
                  <Chat />
                </div>
              </Route>
              <Route path="/settings">
                <Settings />
              </Route>{' '}
            </Router>
          </OllamaProvider>
        </LazySettingsProvider>
      </Suspense>
    </>
  );
}

export default App;
