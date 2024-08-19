all :
	docker-compose up --build -d

stop :
	docker-compose down

vol :
	docker-compose down -v

re : stop all

fclean : vol
	$(DOC) image prune -f
	$(DOC) image prune -a -f
	$(DOC) network prune -f
	$(DOC) volume prune -f
	$(DOC) system prune -a -f --volumes