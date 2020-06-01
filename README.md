## Stock Market Web Application - Django API + Vue Frontend


This is a Stock Market Application I created with some help from my [friend](https://github.com/te427). On the app you can create portfolios, paper trade stocks and track your performance. You can also view historical chart data for stocks, as well as some basic company info and news, similar to a site like Yahoo finanace. You can find a live version of the site at this [here](3.23.61.95:8080). 

### Running the app locally

If you want to run the app locally clone down the repo and enter the following commands:

To make migrations and add stocks to database:  

`docker-compose run app sh -c "python manage.py makemigrations && python manage.py add_stocks"`

To run development server:
docker-compose up 



### Additional Commands

