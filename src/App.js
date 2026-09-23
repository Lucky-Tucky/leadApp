import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from './component/dashboard/dashboard';
import LeadInfo from './component/LeadInfo/leadinfo';
import { SnackbarProvider } from './component/utils/snackbar/SnackbarContext';

function App() {
  return (
    <SnackbarProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/lead/new" element={<LeadInfo mode="Create" />} />
          <Route path="/lead/:id" element={<LeadInfo />} />
        </Routes>
      </BrowserRouter>
    </SnackbarProvider>
  );
}

export default App;
