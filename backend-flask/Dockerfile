FROM python:3.10-slim-buster

# Inside the container make and change current working directory to /backend-flask
WORKDIR /backend-flask

# Outside container -> inside container
# copy requirements.txt from my project present outside the container to the PWD inside the container
# requirements.txt contains the libraries we need to install to run the app
COPY requirements.txt requirements.txt

# Inside Container
# Install the python packages used for the app
RUN pip3 install -r requirements.txt

# Outside container -> inside container
# . means everythig in the PWD
# first period . - /backend-flask (outside container)
# second period . - /backend-flask (inside container)
COPY . .

# Set environment variables for the project inside the container
ENV FLASK_ENV=development

EXPOSE ${PORT}

# run the command "python3 -m flask run --host=0.0.0.0 --port=4567"
CMD [ "python3", "-m" , "flask", "run", "--host=0.0.0.0", "--port=4567"]