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

python manage.py makemigrations
python manage.py migrate
python manage.py runserver