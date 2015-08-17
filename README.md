ReactCMS
========

Content management system using React and NodeJS

System Setup
------------

Install support modules
```
sudo npm install -g browserify
sudo npm install -g react-tools
```

Go to site folder and populate database

```
node cmd.js initdb
node cmd.js import
```

Start
-----

Go to application root folder

```
./start
```

Visit website at http://localhost:8700


MacOSX
------

Run the following command to overcome file size limit
```
ulimit -n 2560
```


