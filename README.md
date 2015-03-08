ReactCMS
========
Content management system using React and NodeJS

System: Ubuntu


Support tools
-------------
sudo apt-get install gcc make build-essential


MongoDB install
---------------
sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 7F0CEB10
echo "deb http://repo.mongodb.org/apt/ubuntu "$(lsb_release -sc)"/mongodb-org/3.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-3.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org

sudo service mongod start
sudo service mongod stop


Node install
------------
sudo add-apt-repository ppa:chris-lea/node.js
sudo apt-get update
sudo apt-get install -y nodejs

