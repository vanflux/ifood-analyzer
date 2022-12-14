import React from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';
import { App } from './components/app';

export async function immediateEntry() {}

export async function pageLoadedEntry() {
  // Remove UI if exists
  if (window.destroyVFE) window.destroyVFE();

  // Render the new UI
  const container = document.createElement('div');
  container.id = 'vfeRoot';
  document.body.appendChild(container);
  const root = createRoot(container);
  root.render(<App></App>);
  window.destroyVFE = () => root.unmount();
}
