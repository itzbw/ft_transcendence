FROM nginx:1.27

# COPY NGINX CONF
COPY conf/default.conf /etc/nginx/conf.d/default.conf

# COPY THE WEBSITE INTO THE CONTAINER
COPY website /etc/website

# create ssl dir && ssl key/cert
RUN mkdir -p /etc/nginx/ssl/
RUN openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
	-keyout /etc/nginx/ssl/frontend_selfsigned.key \
	-out /etc/nginx/ssl/frontend_selfsigned.crt \
	-subj "/C=FR/L=Paris/O=42/CN=ft_transcendence/UID=ft_transcendence"

