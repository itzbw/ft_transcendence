FROM nginx:1.27

RUN mkdir -p /etc/nginx/ssl && \
	openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout /etc/nginx/ssl/ft_transcendence.key -out /etc/nginx/ssl/ft_transcendence.crt -subj "/C=FR/L=Paris/O=42/CN=ft_transcendence/UID=ft_transcendence"

COPY conf/default.conf /etc/nginx/conf.d/default.conf
COPY website /etc/website

CMD ["nginx", "-g", "daemon off;"]