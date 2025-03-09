// This file contains type declarations for React components and hooks

import React from 'react';

// Re-export React types to make them available throughout the app
export type FormEventType = React.FormEvent<HTMLFormElement>;
export type ReactNodeType = React.ReactNode;

// Declare module augmentations for React
declare module 'react' {
  // Ensure useState is properly typed
  export function useState<T>(initialState: T | (() => T)): [T, React.Dispatch<React.SetStateAction<T>>];
  
  // Ensure createContext is properly typed
  export function createContext<T>(defaultValue: T): React.Context<T>;
}

// Extend window interface for custom properties
declare global {
  interface Window {
    appLoadTimeout?: number;
  }
} 