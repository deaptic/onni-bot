FROM denoland/deno:latest as base

WORKDIR /app

COPY . ./

RUN deno cache main.ts

CMD ["deno", "run", "--allow-net", "--allow-read", "--allow-env", "main.ts"]