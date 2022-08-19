<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

## Steps To Run the project :

- Clone the project ` git clone https://github.com/amanchauhan06/stock_app.git `
- cd into the directory `cd stock_app` 
- ` git fetch origin engine-microservice`
- Change the branch` git checkout engine-microservice `
- Run ` cd .. `
- Clone the project ` git clone https://github.com/amanchauhan06/matching_engine.git `
- cd into the directory `cd matching_engine` 
- ` git fetch origin engine-microservice`
- ` git checkout engine-microservice `
- ` To start the project npm run start:dev `
- Install redis ` brew install redis `
- Run Redis server ` redis-server `
- Install postgres:
    * Download the app from ` https://postgresapp.com/downloads.html `
    * Open the app and start the server
- Install PGadmin a GUI for postgres :
    * Download the app from ` https://www.pgadmin.org/download/pgadmin-4-macos/ `
    * Install and open the PGadmin app
    * Then connect to the local postgres using the creds like `host: 127.0.0.1, port:5432, database: postgres`
- Install Timescale DB:
  #### Note: If postgres is successfully installed and the server is running then follow these steps to install timescale DB
     *     
- To start the project ` npm run start:dev `
- Connect to the socket through request provided in postman collection (stock_app_socket)
- After that hit the post api provided in order folder of collection (stock_app)

## Tech Stack

- Nest.js
- Postgres
- MongoDB
- AWS
- Heroku
- Timescale DB
- Socket.io
- Redis
- CMAKE