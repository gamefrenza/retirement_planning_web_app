declare module 'react' {
  import * as React from 'react';
  export = React;
  export as namespace React;
}

declare module 'react/jsx-runtime' {
  export default any;
  export const jsx: any;
  export const jsxs: any;
}

declare module 'recharts';
declare module 'web-vitals'; 