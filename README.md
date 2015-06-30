ReactCMS
========
Content management system using React and NodeJS

System Setup
------------

Install support modules
```
sudo npm install -g gulp
sudo npm install -g browserify
sudo npm install -g react-tools
```

Go to application root and build js scripts with browserify

```
build
```


Go to site folder and populate database

```
node cmd.js initdb
node cmd.js import
```
or
```
bin/refreshdb
```


MacOSX
------

run the following command to overcome file size limit
```
ulimit -n 2560
```
