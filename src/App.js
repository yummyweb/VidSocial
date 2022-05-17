import './App.css';
import { HashRouter, Route, Routes } from "react-router-dom"
import Landing from "./routes/Landing"
import Account from './routes/Account';

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route exact path="/" element={<Landing />} />
        <Route exact path="/feed" element={<Account />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
