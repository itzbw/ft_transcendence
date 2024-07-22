FROM python:3.12-rc-slim-bullseye

WORKDIR /app

# gcc & libffi-dev needed to install daphne in 3.13 (not in 3.12)
# RUN apt-get update && apt-get install -y netcat gcc libffi-dev
RUN apt-get update && apt-get install -y --no-install-recommends netcat

# DEV MODE ONLY
RUN apt install -y iputils-ping curl


#Install Python dependencies
RUN pip install --upgrade pip
COPY requirements.txt .
RUN pip install  --no-cache-dir -r requirements.txt && rm requirements.txt

#Create working dirs
# COPY django/ft_transcendence /app/

#Copy the entrypoint and launch it
COPY scripts/* /scripts/
ENTRYPOINT [ "sh", "/scripts/entrypoint.sh" ]