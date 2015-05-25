ReactCMS
========
Content management system using React and NodeJS

System Setup
------------

Install support modules
```
sudo npm install -g gulp
```

On command line, go to site folder

run the following commands to populate database:

```
node cmd.js initdb
node cmd.js import
```

or
```
bin/refreshdb
```

MacOSX

run the following command to overcome file size limit
```
ulimit -n 2560
```
