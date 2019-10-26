## GraphQL Test Runner / Report generator CLI tool kit

Interface for easy running GraphQL endpoints by url with Schema file or custom queries, based on:

- easygraphql-load-tester(https://github.com/EasyGraphQL/easygraphql-load-tester)
- Artillery.IO(https://github.com/artilleryio/artillery)

### Test Kit usage and commands:

    $ gql-testkit

    Options:
      --config, -c    JSON config file path in app root directory
      --schema, -s    GraphQL Schema file path in app root directory
      --update  -u    Schema update flag
      --report  -r    Report flag, check if only report needed
      --file    -f    JSON report file in package sandbox outputFolder, need -r flag

### JSON file example(gqlconfig.example.json):

    {
      "config": {
        "name": "Testing GraphQL EndPoint",
        "url": "http://server.domain:8080/graphql",
        "selectedQueries": ["yourGraphQLmutation", "query"],
        "queryFile": true,
        "withMutations": true,
        "duration": 1,
        "arrivalRate": 1,
        "withOutput": true,
        "outputFolder": "tests-gql-report",
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
        "data": {
          "key": "value"
        }
      }
    }
