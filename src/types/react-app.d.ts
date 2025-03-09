// This file contains type declarations for React components and hooks

import React from 'react';

// Extend window interface for custom properties
declare global {
  interface Window {
    appLoadTimeout?: number;
  }
}

// Common React type exports
export type FormEventType = React.FormEvent<HTMLFormElement>;
export type ChangeEventType<T = HTMLInputElement> = React.ChangeEvent<T>;
export type ReactNodeType = React.ReactNode;
export type FC<P = {}> = React.FC<P>;
export type FormEvent = React.FormEvent<HTMLFormElement>;

// Ensure this is treated as a module
export {}; 