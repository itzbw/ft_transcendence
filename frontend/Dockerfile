FROM nginx:1.27

RUN mkdir -p /etc/nginx/ssl && \
	openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout /etc/nginx/ssl/ft_transcendence.key -out /etc/nginx/ssl/ft_transcendence.crt -subj "/C=FR/L=Paris/O=42/CN=ft_transcendence/UID=ft_transcendence"


COPY conf/default.conf /etc/nginx/conf.d/default.conf

# THE NEXT LINE MUST BE UNCOMMENTED WHEN PROJECT WILL BE READY
# COPY website /etc/website

# THE NEXT LINE MUST BE DELETED (and the file too) WHEN PROJECT WILL BE READY
COPY conf/nginx.conf /etc/nginx/nginx.conf

RUN mkdir -p /var/log/nginx && env > /var/log/nginx/access.log

CMD ["nginx", "-g", "daemon off;"]