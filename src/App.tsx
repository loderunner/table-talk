import Chat from './Chat';
import { Header } from './Header';

function App() {
  return (
    <div className="flex size-full select-none flex-col">
      <Header />
      <Chat />
    </div>
  );
}

export default App;
