FROM node:lts-alpine
ENV NODE_ENV=production
WORKDIR /app
COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]
RUN npm install --production --silent && \
    npm cache clean --force && \ npm uninstall bcrypt \ && npm install bcrypt && \
    mv node_modules ../
COPY . .
EXPOSE 4000
CMD ["npm", "start"]
