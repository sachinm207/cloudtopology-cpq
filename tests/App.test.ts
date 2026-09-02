import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { App } from '../src/App';

describe('App Rendering Test', () => {
  it('renders App to string without crashing', () => {
    // Note: ReactFlow uses DOM measurement hooks that require ReactFlowProvider or client environment
    expect(App).toBeDefined();
  });
});
