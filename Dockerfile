# Stage 1: Build frontend 
FROM node:latest AS frontend-build

#RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app

#WORKDIR /home/node/app
WORKDIR /app

COPY package*.json ./

#USER node

# Install dependencies
RUN npm install

# Copy the rest of the application code
#COPY --chown=node:node . .
COPY . .
RUN npm run build

# Copy README.md to the build output
COPY README.md /app/dist/README.md

# Stage 2:Serve frontend
FROM nginx:alpine AS frontend-serve

RUN apk add nodejs npm

COPY --from=frontend-build /app/dist /usr/share/nginx/html

# Copy the custom nginx configuration file
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose the port your app runs on
#EXPOSE 80

# Command to run the application
# CMD ["nginx", "-g", "daemon off;"]


# Use a Node.js base image

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json to work directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port your app runs on
EXPOSE 80
EXPOSE 4000

# Command to run the application
#CMD ["npm", "run", "dev:backend"]
CMD ["sh", "-c", "npm run dev:backend & nginx -g 'daemon off;'"]

