	SSL_DIR="./tools/ssl/certificates"

	BACK_DIR="$SSL_DIR/backend"
	BACK_FILE_NAME="backend_selfsigned"
	BACK_CERT="$BACK_DIR/$BACK_FILE_NAME.crt"
	BACK_KEY="$BACK_DIR/$BACK_FILE_NAME.key"

	FRONT_DIR="$SSL_DIR/frontend"
	FRONT_FILE_NAME="frontend_selfsigned"
	FRONT_CERT="$FRONT_DIR/$FRONT_FILE_NAME.crt"
	FRONT_KEY="$FRONT_DIR/$FRONT_FILE_NAME.key"
	
	CMD_ARGS="req -x509 -nodes -days 365 -newkey rsa:2048"
	SUBJ="/C=FR/L=Paris/O=42/CN=ft_transcendence/UID=ft_transcendence"
	
if [ ! -d "$SSL_DIR" ]; then
	mkdir -p $FRONT_DIR $BACK_DIR
	openssl $CMD_ARGS -keyout $BACK_KEY -out $BACK_CERT -subj $SUBJ
	openssl $CMD_ARGS -keyout $FRONT_KEY -out $FRONT_CERT -subj $SUBJ
	echo "\e[32mssl certificates created\e[0m"
else
	echo "\e[32mssl certificates already exist\e[0m"
fi