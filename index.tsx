import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Добавляем обработчик ошибок на уровне приложения
window.addEventListener('error', (event) => {
  console.error('Global error:', event.error);
  const rootElement = document.getElementById('root');
  if (rootElement) {
    rootElement.innerHTML = `
      <div style="padding: 20px; color: white; text-align: center; background: #1f2937; min-height: 100vh;">
        <h1 style="color: #ef4444;">Ошибка приложения</h1>
        <p>${event.error?.message || 'Неизвестная ошибка'}</p>
        <p style="margin-top: 20px; color: #9ca3af;">Проверьте консоль браузера (F12) для подробностей.</p>
        <pre style="background: #111827; padding: 10px; margin-top: 20px; text-align: left; overflow: auto;">
${event.error?.stack || 'Нет информации об ошибке'}
        </pre>
      </div>
    `;
  }
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
});

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

try {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} catch (error) {
  console.error('Error rendering app:', error);
  rootElement.innerHTML = `
    <div style="padding: 20px; color: white; text-align: center;">
      <h1>Ошибка загрузки приложения</h1>
      <p>${error instanceof Error ? error.message : 'Неизвестная ошибка'}</p>
      <p>Проверьте консоль браузера для подробностей.</p>
    </div>
  `;
}
