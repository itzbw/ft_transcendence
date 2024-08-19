FROM python:3.12-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app
RUN mkdir -p /logs

# Install netcat to use it in the entrypoint, build-essential/libpq-dev to can pip install psycopg[c]
RUN apt-get update && \
	apt-get install -y --no-install-recommends netcat-openbsd \
	build-essential \
	libpq-dev \
	openssl \
	&& apt-get clean && rm -rf /var/lib/apt/lists/*


# ssl key
RUN mkdir -p /ssl
RUN openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
	-keyout /ssl/backend_selfsigned.key \
	-out /ssl/backend_selfsigned.crt \
	-subj "/C=FR/L=Paris/O=42/CN=ft_transcendence/UID=ft_transcendence"

#Install Python dependencies
RUN pip install --upgrade pip
COPY requirements.txt .
RUN pip install  --no-cache-dir -r requirements.txt && rm requirements.txt

#Copy the entrypoint and launch it
COPY scripts/* /scripts/
ENTRYPOINT [ "sh", "/scripts/entrypoint.sh" ]