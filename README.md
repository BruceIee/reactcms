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

Go to site folder and load project (default to main project under data/main)

```
node cmd.js load
```

Start
-----

Go to application root folder (where this github project is cloned to)

```
./start
```

Visit website at http://localhost:8700


Support
-------

On MacSOX, there may be error due to low number of file descriptors

Run the following command to overcome file size limit
```
ulimit -n 2560
```
