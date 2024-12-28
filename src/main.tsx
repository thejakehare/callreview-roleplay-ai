import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '@/components/auth/AuthProvider';
import { App } from './App';
import './index.css';

const root = createRoot(document.getElementById("root")!);

root.render(
  <BrowserRouter>
    <AuthProvider>
      <App />
    </AuthProvider>
  </BrowserRouter>
);