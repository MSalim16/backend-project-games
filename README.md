# Mohamed Salim's Games API

## Link for Hosted Version of my API:

https://mohamed-salims-games-api.onrender.com/api

---

## Summary of project

With the use of express-defined request pathways, this project builds the back end for a database of video game reviews.

For instance, you might issue a GET request to /api/reviews if you wanted to read all of the reviews that are presently stored in the database.

There are already-existing users, categories, and comment data, which further extends the usefulness and integration of all the data. Although each of these is included in its own table, a relational database links the data by using keys that cross each other.

---

## How to clone my repository

1 - clone the repository down locally using this command in your terminal:

```git
git clone https://github.com/MSalim16/backend-project-games
```

2 - open it up on VSCode using the terminal command:

```
code .
```

3 - install the required dependencies using in the terminal:

```bash
npm install dotenv
```

```bash
npm install pg
```

```bash
npm install express
```

```bash
npm install -D jest
```

```bash
npm install -D jest-sorted
```

```bash
npm install -D supertest
```

4 - create these 2 files in the repository and fill them in with the corresponding data as shown below:

```git

'.env.test'

for the test fle you will have to enter this code into the file for it to function correctly : PGDATABASE = nc_games;

.env.development'

for the development file you will require this code for it to function correctly: PGDATABASE = nc_games;


```

---

## Minimum Versions of Node and Postgres required to run this Project.

Node:v19.0.0

Postgres:v12.12

---

## Scripts

You will then need to run through several scripts in order to really allow the code to run:

1. Run this command in your code editor terminal to build the database on your computer.

```bash
node run setup-dbs
```

2. With the following command, stated databases may now be seeded.

```bash
node run seed
```

3. However, for the tests, this is noted in the test files' headers as something that must be done before each test.

4. Now, I recommend executing this in your terminal to check to verify whether everything is configured correctly.

```bash
npm test
```

If you have followed all of the instructions above all tests should pass.

---
