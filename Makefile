DC = docker-compose

all :
	$(DC) up --build -d

stop :
	$(DC) down

vol :
	$(DC) down -v

re : stop all