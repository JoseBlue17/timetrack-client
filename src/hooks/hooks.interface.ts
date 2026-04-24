export interface IToastOptions {
  title: string;
  description?: string;
  type?: 'success' | 'error' | 'info' | 'warning';
}

export interface IShowSuccessOptions {
  title: string;
  description?: string;
}
