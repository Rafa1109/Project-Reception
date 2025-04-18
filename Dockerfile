# Etapa 1: Build do Angular
FROM --platform=linux/amd64 node:latest AS build
WORKDIR /usr/local/app/
COPY ./ /usr/local/app/
RUN npm install
RUN npm run build

# Etapa 2: Imagem final com Nginx
FROM --platform=linux/amd64 nginx:alpine AS production

# Copia os arquivos buildados do Angular
COPY --from=build /usr/local/app/dist/project-reception /usr/share/nginx/html

# Copia config customizada do Nginx, se houver
COPY --from=build /usr/local/app/nginx.conf /etc/nginx/nginx.conf

# Copia o template do env.js para os assets
COPY env.template.js /usr/share/nginx/html/assets/env.template.js

# Copia o entrypoint para gerar o env.js dinamicamente
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# Expõe a porta 8000 (ajuste isso se usar outra)
EXPOSE 8000

# Roda o entrypoint que substitui env.js e inicia o Nginx
ENTRYPOINT ["/entrypoint.sh"]