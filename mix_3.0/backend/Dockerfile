# using 3.12 instead of 3.13 to avoid "gcc" and "libffi-dev" as requirements to install daphnee
FROM python:3.12-rc-slim-bullseye

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app
RUN mkdir -p /logs

# Install netcat to use it in the entrypoint
RUN apt-get update && apt-get install -y --no-install-recommends netcat

# DEV MODE ONLY
RUN apt install -y iputils-ping curl

#Install Python dependencies
RUN pip install --upgrade pip
COPY requirements.txt .
RUN pip install  --no-cache-dir -r requirements.txt && rm requirements.txt

#Copy the entrypoint and launch it
COPY scripts/* /scripts/
ENTRYPOINT [ "sh", "/scripts/entrypoint.sh" ]