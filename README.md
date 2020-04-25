Stock Market Web Application - Django API + Vue Frontend

Hey kieran, 

Everything is in a container now, so you should the following commands should be enough to get you up and running...

docker-compose run app sh -c "python manage.py makemigrations && python manage.py add_stocks"

docker-compose build

docker-compose up  

CHEERS...It looks a litte ugly with all that webpack output in the console but I could not figure out how to silence it.
