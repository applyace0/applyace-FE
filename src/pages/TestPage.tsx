import React from 'react';

const TestPage = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <div className="text-center space-y-4">
        <div className="text-green-600 text-6xl">✅</div>
        <h1 className="text-3xl font-bold text-gray-900">Test Page Loaded Successfully!</h1>
        <p className="text-gray-600">Lazy loading and routing are working correctly.</p>
        <div className="text-sm text-gray-500">
          <p>✅ Vite alias @/ working</p>
          <p>✅ React.lazy() working</p>
          <p>✅ React Router working</p>
          <p>✅ Suspense fallback working</p>
        </div>
      </div>
    </div>
  );
};

export default TestPage; 