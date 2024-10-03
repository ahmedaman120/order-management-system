FROM node:20.0-alpine AS base

WORKDIR /usr/src/app


COPY ./resturant-app/package*.json .


COPY ./resturant-app .

RUN npm install 
RUN npm install cors


FROM base AS auth-app

WORKDIR /usr/src/app


# Start the application
CMD ["npm", "start", "auth"]


FROM base AS order-app


WORKDIR /usr/src/app
RUN npm install express


# # Start the application
CMD ["npm", "start", "order"]


FROM base AS payment-service


WORKDIR /usr/src/app
RUN npm install express


# # Start the application
CMD ["npm", "start", "payment-service"]


FROM base AS resturant-app


WORKDIR /usr/src/app
RUN npm install express


# # Start the application
CMD ["npm", "start", "resturant-app"]