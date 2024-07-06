DC = docker-compose

all :
	$(DC) up --build -d

stop :
	$(DC) down
