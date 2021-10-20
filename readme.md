<!-- @format -->

# Programming challenge from Mnemonic

Install all dependencies by running:
`npm ci`

The server uses a local mysql db. To set it up locally run `setup.sql` located in `MySQL/setup.sql` on your local db. Change `connectdb.js` to the correct configuration.

To run the application run:
`npm run start`

Use for example postMan to send POST request to localhost:3000/api/balance, using the format:

```
{
  "cashAmount": double,
  "sourceAccount": int,
  "destinationAccount": int
}
```
