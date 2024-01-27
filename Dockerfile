FROM denoland/deno:1.40.2

WORKDIR /app

COPY . .

RUN deno cache /app/main.ts

CMD [ "run", "--allow-net", "--allow-read", "--allow-env", "/app/main.ts"]