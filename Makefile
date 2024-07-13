DC = docker-compose
DOC = docker

all :
	$(DC) up --build -d

stop :
	$(DC) down

vol :
	$(DC) down -v

re : stop all

fclean : vol
	$(DOC) container prune -f
	$(DOC) image prune -f
	$(DOC) image prune -a -f
	$(DOC) network prune -f
	$(DOC) volume prune -f
	$(DOC) system prune -a -f --volumes