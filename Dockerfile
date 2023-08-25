FROM node:18.9-bullseye-slim as development

WORKDIR /app
COPY ./package*.json ./yarn.lock ./

RUN apt-get update && apt-get install -y --no-install-recommends \
    python3.5 \
    python3-pip \
    build-essential \
    procps \
    && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

RUN yarn install

COPY ./ .
RUN yarn build

ENV DEBUGGER=true

EXPOSE 9229
EXPOSE 80
