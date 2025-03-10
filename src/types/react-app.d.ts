/// <reference types="react" />
/// <reference types="react-dom" />

declare module 'react' {
  interface HTMLAttributes<T> extends AriaAttributes, DOMAttributes<T> {
    // Add any custom attributes here
  }
}

declare namespace React {
  // Re-export React types
  export type FC<P = {}> = React.FunctionComponent<P>;
  export type ReactNode = React.ReactNode;
  export type FormEvent<T = Element> = React.FormEvent<T>;
  export type ChangeEvent<T = Element> = React.ChangeEvent<T>;
  export type MouseEvent<T = Element> = React.MouseEvent<T>;
}

declare global {
  interface Window {
    appLoadTimeout?: number;
  }

  namespace JSX {
    interface Element extends React.ReactElement<any, any> { }
  }
}

// Common type exports
export type FormEventType = React.FormEvent<HTMLFormElement>;
export type ChangeEventType<T = HTMLInputElement> = React.ChangeEvent<T>;
export type ReactNodeType = React.ReactNode;

// Ensure this is treated as a module
export {}; 