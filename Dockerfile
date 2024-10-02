FROM node:20.0-alpine AS base

WORKDIR /usr/src/app


COPY package*.json .
COPY pnpm-lock.yaml .

RUN npm i -g pnpm 

COPY . .

RUN pnpm install 
RUN pnpm install cors


FROM base AS auth-app


WORKDIR /usr/src/app
RUN pnpm install express
EXPOSE 3001
EXPOSE 50011

# # Start the application
CMD ["pnpm", "start", "auth"]
# CMD ["/bin/sh", "-c", "while :; do sleep 10; done"]