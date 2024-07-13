while true; do
    if nc -z -w 2 $POSTGRES_HOST $POSTGRES_PORT; then
        echo "Postgres is up!"
        break
    else
        echo "Postgres isn't up...waiting..."
        sleep 2
    fi
done

while true; do
	sleep 1
done