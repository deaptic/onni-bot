FROM denoland/deno:latest as base

EXPOSE 80

WORKDIR /app

COPY . ./

RUN deno cache main.ts

CMD ["deno", "run", "--allow-net", "--allow-read", "--allow-env", "main.ts"]