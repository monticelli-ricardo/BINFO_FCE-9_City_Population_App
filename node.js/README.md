# Basic Node.js Examples

To run these examples, you must create a symbolic link for the file `index.js` (the unique defined entry point of the Node.js
application) to the JS file that you would like to test:

1. `index-html.js`   --> Basic http module shown
2. `index-express.js` --> Express module with connection to the MariaDB table "students" (requires the table "students" to exist in the Docker MariaDB DB)
3. `rest.js`   --> Simple REST WS developed with the help of Express

The REST example requires that the database contains a table created in the following way:

```sql
create table user (id int primary key, name varchar(255), email varchar(255), profession varchar(255));
```

Ideally, the table should contain some dummy values such that the list operations can output something useful.
