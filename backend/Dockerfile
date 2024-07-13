FROM python:3.13-rc-slim-bullseye

# gcc & libffi-dev needed to install daphne in 3.13 (not in 3.12)
# RUN apt-get update && apt-get install -y netcat gcc libffi-dev
RUN apt-get update && apt-get install -y netcat

COPY ./scripts /

# Install dependencies
# RUN pip install --upgrade pip
# COPY requirements.txt .
# RUN pip install -r requirements.txt && rm requirements.txt

ENTRYPOINT [ "sh", "/scripts/entrypoint.sh" ]