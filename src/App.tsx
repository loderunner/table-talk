import { Route, Router } from 'wouter';
import { useHashLocation } from 'wouter/use-hash-location';

import Chat from './Chat';
import Header from './Header';
import { OllamaProvider } from './OllamaContext.tsx';
import Settings from './Settings';
import { SettingsProvider } from './SettingsContext.tsx';

function App() {
  return (
    <>
      <SettingsProvider>
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
      </SettingsProvider>
    </>
  );
}

export default App;
