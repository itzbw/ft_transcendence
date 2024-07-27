FROM nginx:1.27

# DEV MODE ONLY
RUN apt update -y && apt install -y iputils-ping curl

# WOULD BE NICE NOT BACKEND's URL FROM ENV AND NOT RAW
COPY conf/default.conf /etc/nginx/conf.d/default.conf

# THE NEXT LINE MUST BE DELETED (and the file too) WHEN PROJECT WILL BE READY
COPY conf/nginx.conf /etc/nginx/nginx.conf

# THE NEXT LINE MUST BE UNCOMMENTED WHEN PROJECT WILL BE READY
# COPY website /etc/website

RUN mkdir -p /var/log/nginx && env > /var/log/nginx/access.log
