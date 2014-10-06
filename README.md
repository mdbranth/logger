# About
This module is designed to be used for logging to the server in a client side web app. The app queues up log messages to reduce the number of network calls.

# Usage
The module needs to be initialized with jquery.
additional options:
- ttl: time until queue is flushed
- apiPath: path where log calls are made

To initialize the module make a call like the following once:

```
log.init(window.$).ttl(2000).apiPath('https://localhost/api/log');
```

Then to log you can log with any object:

```
log({action: 'login', userId: '11111'});
```

Logs in the queue are stored as objects with the client side date the log method was called and the stringified json of the log message.

The server will get a call with the client side date the call was made and an array of log objects as mentioned above. The dates allow the server to determine the offset of when the log method was called.

There is also a method to get and clear the log queue. This is designed so that other api calls can grab the log queue and have the logs piggyback on the network call to furthur reduce network calls.
