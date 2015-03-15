config for upstart
-------------------------------------
sudo cp leapbase.conf /etc/init/leapbase.conf
sudo service leapbase restart
tail -f /var/log/leapbase.log
