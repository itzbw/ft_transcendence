FROM python:3.13-rc-slim-bullseye

RUN apt-get update && apt-get install -y netcat

COPY ./entrypoint.sh /scripts/entrypoint.sh

ENTRYPOINT [ "sh", "/scripts/entrypoint.sh" ]