import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from './component/dashboard/dashboard';
import LeadInfo from './component/LeadInfo/leadinfo';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/lead/new" element={<LeadInfo mode="Create" />} />
        <Route path="/lead/:id" element={<LeadInfo />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
