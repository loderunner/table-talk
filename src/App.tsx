import { Route, Router } from 'wouter';
import Chat from './Chat';
import Header from './Header';
import Settings from './Settings';
import { useHashLocation } from 'wouter/use-hash-location';
import { SettingsProvider } from './SettingsContext';

function App() {
  return (
    <SettingsProvider>
      <Router hook={useHashLocation}>
        <Route path="/">
          <div className="flex size-full select-none flex-col">
            <Header />
            <Chat />
          </div>
        </Route>
        <Route path="/settings">
          <Settings />
        </Route>
      </Router>
    </SettingsProvider>
  );
}

export default App;
