
declare module "*.css";

declare interface Window {
  destroyVFE?(): void;
}

declare module "safe-eval" {
  export default function safeEval(code: string): any;
}
