DC = docker-compose
DOC = docker

all :
	sh ./tools/ssl/ssl_create.sh
	$(DC) up --build -d

stop :
	$(DC) down

vol :
	rm -rf ./tools/ssl/certificates
	$(DC) down -v

re : stop all

fclean : vol
	$(DOC) container prune -f
	$(DOC) image prune -f
	$(DOC) image prune -a -f
	$(DOC) network prune -f
	$(DOC) volume prune -f
	$(DOC) system prune -a -f --volumes