export const environment = {
    production: false,
    api: (window as any).env?.API_URL || 'http://localhost:8080/api'
};