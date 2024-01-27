FROM denoland/deno:1.40.2

WORKDIR /

COPY . .

RUN deno cache main.ts

CMD [ "run", "--allow-net", "--allow-read", "--allow-env", "main.ts"]