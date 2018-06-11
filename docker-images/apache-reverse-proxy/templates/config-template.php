<?php
	$DYNAMIC_APP = getenv('DYNAMIC_APP');
	$STATIC_APP = getenv('STATIC_APP');
?>

<VirtualHost *:80>
	ServerName demo.res.ch
	
	ProxyPass "/api/dockers/" "http://172.17.0.3:3000/"
	ProxyPassReverse "/api/dockers/" "http://172.17.0.3:3000/"

    ProxyPass "/" "http://172.17.0.2:80/"
	ProxyPassReverse "/" "http://172.17.0.2:80/"
	

</VirtualHost>