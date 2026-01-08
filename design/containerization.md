# Containerization Strategy

## Goals
- Run locally, staging, prod
- Replace MongoDB with minimal code change
- No DB logic in controllers

## Containers
- api (Node.js)
- db (MongoDB)
- redis (optional later)

## Docker Compose


DB Abstraction Rule

Use repository pattern

No MongoDB aggregation in controllers

Replaceable with:

PostgreSQL

DynamoDB

CosmosDB