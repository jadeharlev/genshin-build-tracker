# Project Ayaka: Genshin Build Tracker

This project is a React application with an ASP.NET/MySQL/Redis backend for Genshin Impact players.

## Getting Started

### Prerequisites

* [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)
* [Docker Desktop](https://www.docker.com/products/docker-desktop/)

### First-Time Setup and Running the Application

1. Clone and `cd` into the repository.

2. Start the MySQL and Redis containers:

    ```sh
    docker-compose up --build -d
    ```

    Note that you may need to stop MySQL server or change the active port if running locally.

3. Initialize database schema (first time only):

   ```sh
   docker exec -i ayaka-mysql mysql -uayaka_user -p4C57y3p9oi68sHypttu ayaka_db < schema-dump.sql
   ```

   (usernames and passwords can be configured in the `docker-compose.yml` file)

4. Your app should now be running at [localhost:8080](http://localhost:8080/swagger/index.html).


### Starting Development 

To start development, open the backend solution:

Open the `Backend/Ayaka.sln` file in JetBrains Rider or Visual Studio.