import * as React from 'react';

// This file helps fix issues with React imports
declare module 'react' {
  // Make sure there are no type errors with imports
  export = React;
  export as namespace React;
} 