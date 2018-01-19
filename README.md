## Keystone Mysql Support  (IN PROGRESS)


### About
This is an attempt to add support to Keystone for Mysql relational databases.


### CURRENT STATUS

The required foundation & implementation strategy are ready. So this code is a good start point.

The main idea is to use a wrapper for mongoose I called *dbObj* (`_core/keystone/_dbObj`).

This project was set to use a local version of Keystone (`_core/keystone`) to enable changes tracking. Connection to mongoDB was kept for facilitate test until the full replacement '_DBObj' full implementation is ready.

***Capability***
Current version is able to create Mysql tables automatically for keystone models (only for simple attributes).


### Contribute
Contributions (with ideas, approach or coding) are welcome.
Familiarity with javascript & NodeJS is required.
Contact me (be.saladin@gmail.com).
