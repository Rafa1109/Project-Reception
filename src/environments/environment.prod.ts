export const environment = {
  production: true,
  api: (window as any).env?.API_URL || 'http://localhost:8080/api'
};