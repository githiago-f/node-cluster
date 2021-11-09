# node-cluster
Testing node cluster module

## About

Express application with node-cluster module.

### Application step-by-step
This application will start limitting it's libuv threadpool size to 1;
Then, the application will create and spawn all worker threads with the express server listening to port 3000;

## Extras

This application uses `pino` as it's logging solution.
