#!/bin/sh

# Substitui variáveis de ambiente no template
echo "Gerando arquivo env.js com valores dinâmicos..."
envsubst < /usr/share/nginx/html/assets/env.template.js > /usr/share/nginx/html/assets/env.js

# Inicia o Nginx
echo "Iniciando Nginx..."
nginx -g 'daemon off;'