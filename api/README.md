# Stock Market Web Application - Django API + Vue Frontend

### To build docker containers
```
Docker build .
docker-compose build
```

### To make database migrations
```
docker-compose run app sh -c "python manage.py makemigrations"
```

### To populate database with stocks and data
```
docker-compose run app sh -c "python manage.py add_data -d"
```

### To start development server
```
docker-compose up
```
