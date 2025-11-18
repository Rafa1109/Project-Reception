export const environment = {
  production: true,
  api: (window as any).env?.API_URL || 'https://recepcao-adosasco.com.br/api'
};