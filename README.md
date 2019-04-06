# Online Games Service Client

![alt text]()

# Description
Portal that allows to play online games with tictactoe implemented as an example game. User, after logging into his accounts will be
allowed to browse available games and play them. After selecting chosen game, user will be able join active room or create his own room.
When it will be appropriate number of players in room, owner will be able to start a game. Application also allows playing vs AI (also
implemented in example tictactoe game). User has insight into history of games played, with ability to check every move made in specific game. Every game room owns a chat and game view, owner additionaly has control panel. App also has two styles (dark and bright) and two languages available (polish and english). Client app is created with HTML/CSS/TypeScript and Angular framework with angular materials, Ng2-stompjs, Rxjs and Xi18n. Server was built with Java and Spring Boot, Spring Data JPA, Spring Security, Lombok, Spring AMQP, JWT, Mapstruct, Swagger and Spring-boot-starter-mail. Entire app is composed using docker.

Link to server repo: 
https://github.com/Marcineku/OnlineGamesServiceServer

Link to mailsender repo:
https://github.com/Marcineku/OnlineGamesServiceMailsender

# App footage
https://youtu.be/B9bxrmvwJ0E

# Important
In order to build and run this app you need to have docker installed.
1. Download all 3 repos into 1 folder
- https://github.com/Marcineku/OnlineGamesServiceClient
- https://github.com/Marcineku/OnlineGamesServiceServer
- https://github.com/Marcineku/OnlineGamesServiceMailsender
2. Compile Server and Mailsender
3. Create new file "docker-compose.yml" and paste this:
```docker
version: '3'

services:
    mysql:
        image: mysql:latest
        restart: always
        environment:
            MYSQL_ROOT_PASSWORD: root123
            MYSQL_DATABASE: gamedb 
            MYSQL_USER: app_user
            MYSQL_PASSWORD: test123
        ports:
            - 3306:3306    
        container_name: mysql
        
    server:
        depends_on:
            - mysql
        build: ./OnlineGamesServiceMailsender
        ports:
            - 8080:8080
                
         
    rabbit:
        image: rabbitmq:3.6-management-alpine
        restart: always
        ports:
            - 15672:15672
            
    mailsender:
        build: ./OnlineGamesServiceMailsender
        ports:
            - 8081:8081

    client:
        build: ./OnlineGamesServiceClient
        ports:
            - 80:80
```
After that step your directory with projects should look like this:
![alt text]()
4. Open cmd or powershell in that folder and type "docker-compose up"
Now wait for docker to do its thing, after that you can access app by typing localhost in any web browser.
