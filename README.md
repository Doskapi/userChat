# ASAPP Chat Backend Challenge v1
### Overview
This is a Nodejs based boilerplate which runs an HTTP Server configured to answer the endpoints defined in 
[the challenge you received](https://backend-challenge.asapp.engineering/).
All endpoints are configured in `index.js` and if you go deeper to the controllers
for each route, you will find a *TODO* comments where you are free to implement your solution.

### Prerequisites

Installed Nodejs >= v8.x

### How to run it

```
npm start
```

### Notes

#### Docker

I will create a single container with the nodejs server and the sqlite base. This can be extended to a docker-comopose spliting the nodejs from the base.

To run the container:
1. `cd asappUserChat`
2. `docker build -t asappchat .`
3. `docker run -d -it -p 8080:8080 asappchat`


---

#### TODO

- [x] Dockerize
- [x] Create the sql db (basic tables) // mongodb will probably be a better db, but i will follow the sqlite3 advise
- [x] Create the CRUD for the user table
- [x] Create users endpoint
- [x] Use md5 to save the pass as a hash in the db
- [ ] Create login endpoint
- [ ] Use JWT to securize the endpoints
- [ ] Create the 2 messages endopoints
