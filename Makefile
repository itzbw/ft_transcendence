all :
	docker-compose up --build -d

stop :
	docker-compose down

vol :
	docker-compose down -v

re : stop all

fclean : vol
	docker image prune -f
	docker image prune -a -f
	docker network prune -f
	docker volume prune -f
	docker system prune -a -f --volumes