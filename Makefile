DC = docker-compose
DOC = docker
BACK = trans_back
FRONT = trans_front

all :
	sh ./tools/ssl/ssl_create.sh
	$(DC) up --build -d

back_re:
		$(DOC) restart $(BACK)

front_re:
		$(DC) exec -ti $(FRONT) nginx -s reload

stop :
	$(DC) down

vol :
	rm -rf ./tools/ssl/certificates
	$(DC) down -v
	find ./backend/django/users/avatars/ -type f ! -name 'default.jpg' -print0 | xargs -0 rm -rf

re : stop all

fclean : vol
	$(DOC) container prune -f
	$(DOC) image prune -f
	$(DOC) image prune -a -f
	$(DOC) network prune -f
	$(DOC) volume prune -f
	$(DOC) system prune -a -f --volumes