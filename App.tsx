
import React from 'react';
import ImageGenerator from './components/ImageGenerator';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-4">
      <ImageGenerator />
    </div>
  );
};

export default App;
