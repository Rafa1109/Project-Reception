export const environment = {
    production: false,
    api: (window as any).env?.API_URL || 'https://recepcao-adosasco.com.br/api'
};