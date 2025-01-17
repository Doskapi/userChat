#TODO: Create a Dockerfile to run the application 
FROM node:12.10.0
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 8080
CMD ["npm", "start"]