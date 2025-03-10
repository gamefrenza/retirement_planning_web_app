// Global TypeScript declarations

// Extend Window interface for app-specific properties
interface Window {
  appLoadTimeout?: number;
}

// Useful type aliases for common React types
type ReactFC<P = {}> = React.FunctionComponent<P>;
type ReactCC<P = {}, S = {}> = React.ComponentClass<P, S>; 