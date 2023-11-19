# Getting Started

## Installation
First you can clone this repo

`
  git clone https://github.com/denny-wongso/tic4304-miniproject.git
`

## Start the server
Go to to the server folder and add .env file with the details below. The database should be PostgreSQL

.env
> 
>  DB_HOST=
>  
>  DB_PORT=
>  
>  DB_NAME=
>  
>  DB_USER=
>  
>  DB_PASSWORD=
>  
>  JWT_KEY=
  


Once you have added, you can install the required library by running

`
  npm install
`

After the installation you can start the server by running

`
  npm start
`

The server should be available in localhost:8020

## Start the client
Go to the client folder. The .env file is already inside you can modify the port if you have done any changes in the server port

Next, you can install the required library by running

`
  npm install
`

After the installation you can start the client by running

`
  npm start
`

the client should be in localhost:3000
