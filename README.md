## Keystone Mysql Support  (IN PROGRESS)


## About

This is an attempt to give Keystone the **ability** to work with  **Mysql relational databases**. 

I made this decision after I read on keystone issues that there is no intention to work on a Mysql support as they actually have plenty of work with Keystone itself.

## CURRENT STATUS

The required foundation & implementation strategy are ready. So this code is a good start point.

The main idea is to use a wrapper for mongoose I called *dbObj* (`_core/keystone/_dbObj`).

This project was set to use a local version of Keystone (`_core/keystone`) to enable changes tracking. Connection to mongoDB was kept for facilitate test until the full replacement '_DBObj' full implementation is ready.

***Capability***
Current version is able to create Mysql tables automatically for keystone models (only for simple attributes).
## Install & running steps

1. Start Mongodb server

Mongodb Server is still required, and will remain, until the replacement Wrapper is fully ready
```sh
mongod --dbpath path/to/data/folder
```
2. Start Mysql Server
```sh
/etc/init.d/mysqld start
```
*I use MAMP*
		
3. Run modifier version of keystone-mysql
```sh
node keystone.js 
```
*You can use DEV Mode for live js reload*		
```sh
KEYSTONE_DEV=true node keystone.js 
```

5. Debug NodeJS serverside using CHROME NODE JS DEBUGGER (*Optional*)
```sh
KEYSTONE_DEV=true node --inspect-brk keystone.js 
```

## Contribute
1. Please *Star* this project so it can gain support.
2. Contributions (with ideas, approach or coding) are welcome.
3. Fork, create feature branch & send a pull request !

Contact me (be.saladin@gmail.com).
