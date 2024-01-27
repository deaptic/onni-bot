FROM denoland/deno:1.40.2

EXPOSE 8000

WORKDIR /app

COPY . .

RUN deno cache main.ts

CMD [ "run", "--allow-net", "--allow-read", "--allow-env", "main.ts"]