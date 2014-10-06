# About
This module is designed to be used for logging in batches.
There is a submodule called ajaxlogger that will use the logger queuing to log to a server

# Usage
if you are using logger.js directly then logger needs to be initialized with a function that actually saves the logs. If you are using a server then using logger/ajaxlogger will take care of this for you.

To initialize the modules, for ajaxlogger call

```
ajaxlogger.init('https://localhost/api/path/to/log/to');
```

for using the generic logger initialize with:

```
logger.init(function writeFunction(object, done));
```

Other Options:
- ttl: time until queue is flushed

Then to log you can log with any object:

```
log({action: 'login', userId: '11111'});
```

chaining is allowed:

```
log({test: '1'}).error({test: '2'}).warn({test: '3'});
```

Logs in the queue are stored as objects with the date the log method was called and the object of the log message.

The writeLogFunction will also be called with the date the call was made and an array of log objects as mentioned above. The dates allow the server to determine the offset of when the log method was called (in cases where the write is happening on a server).

There is also a method to get and clear the log queue. This is designed so that in the case of ajaxlogger other api calls can grab the log queue and have the logs piggyback on the network call to furthur reduce network calls.
