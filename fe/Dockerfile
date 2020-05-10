FROM node:13-alpine as build-stage
WORKDIR /fe
COPY ./package*.json /fe/
RUN npm install
COPY . /fe
RUN npm run build

FROM nginx:stable-alpine as production-stage
COPY --from=build-stage /fe/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]