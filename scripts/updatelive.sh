service rpgchefd stop
rm /var/www/rpgchef
rm -rf /var/www/rpgchef_previous
mv /var/www/rpgchef_current /var/www/rpgchef_previous
mv /var/www/rpgchef_next /var/www/rpgchef_current
ln -s /var/www/rpgchef_current /var/www/rpgchef
/opt/texbin/mktexlsr
/usr/bin/fc-cache -fv
service rpgchefd start
