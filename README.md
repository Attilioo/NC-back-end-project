# Northcoders News API
# Reddit Clone

This Project is the Backend part of my Northcoders Software Developer Bootcamp.

In this process I mimic a real-world like Backend (such as Reddit):




## Appendix

- The Database is PSQL
- We interact with it through [node-postgres](https://node-postgres.com/)

## Deployment

To run this project please fork it and clone it.

You're gonna need to install a few packages to make it work

1) Install Node_modules (Min version: v21.1.0)
```bash
    npm install
```
2) Install express(^4.18.2) & postgres(^3.4.3)

```bash
    npm install express
    npm install pg
```

3) Make sure that you seed the database and run the commands below. If needed theres more script commands in the packages.json files you can refer to.

```bash
    npm run setup-dbs 
    npm run seed
```
# ENV files 
In order to access the databases you're gonna need to create 2 '.env' files and install [dotenv](https://www.npmjs.com/package/dotenv)


- '.env.test' with this text inside

```bash
PGDATABASE=nc_news_test
```


- '.env.development' with this text inside: 
```bash
PGDATABASE=nc_news
```

## Testing

For tests we use:   
    1) [Jest](https://jestjs.io/docs/getting-started)   
    2) [Supertest](https://www.npmjs.com/package/supertest)



 