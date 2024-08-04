#Colors
R			=	"\e[31m"
G			=	"\e[32m"
X			=	"\e[0m"
BOLD		=	"\e[1m"

DC = docker-compose
DOC = docker
BACK = trans_back
FRONT = trans_front

all :
	@echo $(G)Handling SSL certificates...$(X)
	# @sh ./tools/ssl/ssl_create.sh
	@$(DC) up --build -d

back_re:
		@echo $(G)Restarting backup container$(X)
		@$(DOC) restart $(BACK)

front_re:
		@echo $(G)Reloading NGINX$(X)
		@$(DC) exec -ti $(FRONT) nginx -s reload

stop :
	@$(DC) down

vol :
	@$(DC) down -v
	@echo $(R)Cleaning ssl certificates$(X)
	# @rm -rf ./tools/ssl/certificates

re : stop all

fclean : vol
	$(DOC) container prune -f
	$(DOC) image prune -f
	$(DOC) image prune -a -f
	$(DOC) network prune -f
	$(DOC) volume prune -f
	$(DOC) system prune -a -f --volumes