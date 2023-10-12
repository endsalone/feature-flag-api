This is a private project about feature flag studings, which I want to ative a better knowloge how to encapsulate the context and put some other concepts in practice.

All the postman collections and Envs are in the folder `./postman`, so you can import it in your postman and test the endpoints.

I was tired of make the requests to the localhost:PORT then I decided to create a reverse proxy to make it easier to access the continers endpoints, so to access the endpoints you need to use the following pattern:

```bash
  http://api.localhost
```

If you want to change you need to edit the file `./nginx.conf` and change the `server_name` to the domain you want to use.

## Folder structure

I decided to use the clean architecture to organize the folders, so I have the following layers:

```bash
.
├── application # The application layer
├── common # The common layer
├── infra # The infrastructure layer
├── migrations # The migrations
├── modules # The modules
│   ├── module # The module
│   │   ├── application # Have the controllers and all things related to the application
│   │   ├── domain # Have the domain entities and the interfaces
│   │   ├── dto # Have the data transfer objects
│   │   ├── use-cases # Have the use cases
```

## Technologies
- [x] NestJS
- [x] Docker
- [x] Postgres
- [x] TypeORM
- [x] Jest
- [x] NGINX
- [ ] Redis


## Features
- [x] User creation
- [x] User authentication
- [ ] User password recovery
- [ ] User password update
- [ ] User delete
- [x] User authorization
- [x] Organization creation
- [x] Environment creation when organization is created
- [x] List organizations
- [ ] Update organization
- [ ] Delete organization
- [x] Project creation
- [x] List projects
- [x] Update project
- [x] Delete project
- [x] Feature creation
- [x] List features
- [x] Update feature
- [ ] Delete feature
- [x] Feature Variation creation
- [x] List feature variations
- [x] Update feature variation
- [ ] Delete feature variation
- [ ] Make the whole features control point to organization instead of project
- [ ] Add the target audience in the feature variation
- [ ] Update the feature variation to receive the target audience
- [ ] Rollout the feature variation to the target audience
- [ ] Create secret and key segregatted by environments
- [ ] Allow custom environments
- [ ] Cache list of features make it faster reading
- [ ] Use OAuth2 to authenticate the users instead local authentication

## How to run
```bash
  docker-compose up -d
```

## How to check for logs
```bash
  docker logs api_feature_flag -f
```

## How to test
```bash
  npm run test
```

All NESTJS logs and TypeORM logs are enabled, so you can see the logs in the terminal.