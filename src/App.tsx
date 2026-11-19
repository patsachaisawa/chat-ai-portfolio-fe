import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Chat from './pages/Chat';
import GameShell from './components/GameShell';

export default function App() {
  return (
    <Router>
      <GameShell>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/chat" element={<Chat />} />
        </Routes>
      </GameShell>
    </Router>
  );
}
