FROM ghcr.io/puppeteer/puppeteer:24.6.0

WORKDIR /home/pptruser/app

COPY package*.json ./
COPY . .

RUN npm install

EXPOSE 3000
ENV PORT=3000

HEALTHCHECK --interval=10m --timeout=5s \
    CMD curl -f http://localhost/health || exit

CMD ["npm", "start"]
