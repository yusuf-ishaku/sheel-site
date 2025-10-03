import React from 'react';
import './App.css'
import { Toaster } from "react-hot-toast";
import "@rainbow-me/rainbowkit/styles.css";
import Presale from './components/Presale'
import RootLayout from './layout';

function App() {
  return (
    <RootLayout>
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <Presale />
        <Toaster position="top-center" reverseOrder={false} />
      </div>
    </RootLayout>
  );
}

export default App
