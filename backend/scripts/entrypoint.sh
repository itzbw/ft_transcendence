# Install dependencies
while true; do
    if nc -z -w 2 $DB_HOST $DB_PORT; then
        echo "Postgres is up!"
        break
    else
        echo "Postgres isn't up...waiting..."
        sleep 2
    fi
done

# Adds a seperator in logfile to see when the container is re-created
if [ -f /logs/gunicorn.log ]; then
	echo "\n----------- SERVER LAUNCH ------------\n" >> /logs/gunicorn.log
fi

# Adds a seperator in error logfile to see when the container is re-created
if [ -f /logs/gunicorn_error.log ]; then
	echo "\n----------- SERVER LAUNCH ------------\n" >> /logs/gunicorn_error.log
fi

python manage.py makemigrations
python manage.py migrate
# python manage.py runserver 0.0.0.0:$BACK_PORT

# Need to delete that later :
python manage.py create_superuser

# gunicorn is a WSGI server for Django
gunicorn --bind 0.0.0.0:$BACK_PORT \
			--certfile=$BACK_SSL_CERT \
			--keyfile=$BACK_SSL_KEY \
			ft_transcendence.wsgi:application \
			--log-file /logs/gunicorn.log \
			--log-level debug
			# > /logs/gunicorn_stdout.log 2>&1