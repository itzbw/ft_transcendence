# Wait for the databse to be ready
while true; do
    if nc -z -w 2 $DB_HOST $DB_PORT; then
        echo "\e[32mPostgres is up!\e[0m"
        break
    else
        echo "\e[33mPostgres isn't up...waiting...\e[0m"
        sleep 2
    fi
done

# Adds a seperator in logfile to see when the container is re-created
if [ -f /logs/gunicorn.log ]; then
	echo "\n----------- SERVER LAUNCH ------------\n" >> /logs/gunicorn.log
fi

echo "\e[33mCreating migration files\e[0m"
python manage.py makemigrations users

echo "\e[33mApplying database migrations\e[0m"
python manage.py migrate

# gunicorn is a WSGI server for Django
echo "\e[32mLaunching server...\e[0m"
gunicorn --bind 0.0.0.0:$BACK_PORT \
			--certfile=$BACK_SSL_CERT \
			--keyfile=$BACK_SSL_KEY \
			ft_transcendence.wsgi:application \
			--log-file /logs/gunicorn.log \
			--log-level debug

