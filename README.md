## GraphQL Artillery Test Runner / Report generator CLI tool kit

Interface for easy running GraphQL endpoints by url with Schema file or custom queries, based on:

- easygraphql-load-tester(https://github.com/EasyGraphQL/easygraphql-load-tester)
- get-graphql-schema(https://github.com/prisma-labs/get-graphql-schema)
- Artillery.IO(https://github.com/artilleryio/artillery)

### Test Kit usage and commands:

    $ gql-testkit

    Options:
      --config, -c    JSON config file path in app root directory
      --schema, -s    GraphQL Schema file path in app root directory
      --update  -u    Schema update flag
      --report  -r    Report flag, check if only report needed
      --file    -f    JSON report file in package sandbox outputFolder, need -r flag

### JSON config file(*) :

    {
      "config": {
        "name": "Testing GraphQL with Artillery",
        "url": "http://server.domain:8080/graphql",
        "selectedQueries": ["signin", "signup", "user"],
        "queryFile": true,
        "withMutations": true,
        "duration": 1,
        "arrivalRate": 1,
        "withOutput": true,
        "outputFolder": "tests-gql-report",
        "target": "http://localhost:8080/",
        "headers": {
          "Authorization": "bearer <TOKEN>"
        },
        "schema": {
          "filename": "schema.graphql",
          "method": "POST",
          "json": false
        }
      },
      "args": {
        "signin": {
          "email": "test@test.com",
          "password": "123456"
        },
        "signup": {
          "email": "test@test.com",
          "password": "123456",
          "firstName": "John",
          "secondName": "Smith"
        },
        "user": {
          "id": 1
        }
      }
    }

* Automatic generated after run command without or with wrong config file