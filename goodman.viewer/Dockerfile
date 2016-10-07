FROM ubuntu:14.04

MAINTAINER piaras.hoban@itma.ie

RUN apt-get update && apt-get install -y nginx

RUN mkdir -p /var/www/html;


RUN echo "daemon off;" >> /etc/nginx/nginx.conf
RUN rm /etc/nginx/sites-enabled/default

RUN ln -sf /dev/stdout /var/log/nginx/access.log && \
    ln -sf /dev/stderr /var/log/nginx/error.log

WORKDIR /var/www/
COPY src/ html/
COPY uv-1.8.27 html/uv-1.8.27

COPY nginx.conf /etc/nginx/conf.d

EXPOSE 80

CMD nginx