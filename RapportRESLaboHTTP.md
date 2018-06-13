#Laboratoire HTTP Infra

####Author:  Walid Koubaa on 13.06.2018

##Partie 1

Ici on cree un site web statique a partir d'un bootstrap.

On cree nos images docker et on demarre les containers, apres avoir kill/remove les containers toujours presents.


	docker kill $(docker ps -q)

	docker rm $(docker ps -a -q)

	docker build -t res/apache_php .

	docker run -d --name apache_static -p 8080:80 res/apache_php

Ensuite on ouvre un navigateur et tape l'adresse *localhost:8080*

On peut aussi lancer directement le fichier **index.html dans un navigateur** !

Pour cela un script **demo1** effectuant toute les commandes de la partie 1 est fourni.


 
##Partie 2 

Ici on cree un site web dynamique


	docker kill $(docker ps -q)
	docker rm $(docker ps -a -q)

	docker build -t res/express .
	docker run -d --name express_dynamic -p 3000:3000 res/express

Ensuite on ouvre un navigateur et tape l'adresse *localhost:3000*.

On peut aussi lancer directement en tapant dans un terminal *telnet localhost 3000* et taper **GET / HTTP/1.0** suivit de la touche *Enter* deux fois.


Pour cela un script **demo2** effectuant toute les commandes de la partie 2 est fourni.

##Partie 3 

On developpe ici un reverse proxy.
Un fichier de config reverse-proxy.conf spécifie toutes les informations necessaires a la creation de ces container aux ports voulus.

On executes nos 3 programmes dockerisé:

	docker kill $(docker ps -q)
	docker rm $(docker ps -a -q)
	
	docker build -t res/apache_php apache-php-image/.

	docker build -t res/express_dynamic express-image/.

	docker build -t res/apache_rp apache-reverse-proxy/.

	docker run -d --name apache_static res/apache_php

	docker run -d --name express_dynamic res/express
	
	docker run -d --name apache_rp -p 8080:80 res/apache_rp

Pour cela un script **demo3** effectuant toute les commandes de la partie 3 est fourni.



##Partie 4 Ajax & JQuery


Nous disposons d'un script Java dockers.js, executé au moment ou page chargé.
Nous disposons des Requetes Ajax en arriere plan en utilisant JQuery, et plus specifiqueemnt la fonction getJSON.

**Ici nous recuperons un contenu dynamique cree par le javascript dockers.js qui nous fourni un nom et hash de container "docker", qui sera ensuite loadé toute les deux secondes et ajouté à tout les champs de type  "maclasse" dans le site web statique.**

-> en JQuery # pour recupere l'id (d'un body ou header...)
 et . pour recuperer le nom de la classe (d'un body ou header...
 
demo.res.ch est a 127.0.0.0 ici. (MacOs et Docker tools)

Un probleme persistait encore avec demo.res.ch:8080/api/dockers jamais loadé meme si avec telnet localhost 3000 cela fonctionne. 

MAIS LOADE avec demo.res.ch:3000 !

**En effet jusqu'ici la config est provisoire donc le "mapping" entre l'adresse fournie dans le fichier de configuration et "/api/students/"**

Nous ferons cette configuration de maniere dynamique dans la partie 5 du laboratoire :) !


-> DEMO : ouvrir le fichier html (open index.html) ou bien lancer le conteneur docker.

Aussi un script **demo4** effectuant toute les commandes de la partie 3 est fourni.

Il suffit de lancer un navigateur et entrer **demo.res.ch:8080**. Le contenu est chargé dynamiquement.

##Partie 5 Config dynamique du reverse proxy

docker -e flag pour spécifier des variables d'environnement depuis l'exterieur (exemeple ip et port specifier de manière dynamiques)

setup.sh pour effectuer la config dynamique puis generer un fichier de configuration


*docker run -e HELLO=world -e RES=heigvd -it res/apache_rp /bin/bash*

et en tapant *export* on obtient toutes les variables d'environnement

modif du dockerfile et ajout du script apache2-foreground

#####docker build -t res/apache_rp .

puis dans un but de test:

#####docker run res/apache_rp

avant de specifier les valeur static et dynamic, le docker se contente d'afficher des variables static et dynamique mais sans valeur

Une fois ces variables initialisée on peut executer de cette facon:

#####docker run -e STATIC_APP=172.17.0.2:80 -e DYNAMIC_APP=172.17.0.3:3000 res/apache_rp

affichage des valeur des varaibles specifiees


Code php de test : 

	HEADER

	<?php print "hello"?>

	FOOTER

avec **php config-template.php** -> retourne l'affichage du code php


code realisé :
	
	<?php
	$DYNAMIC_APP = getenv('DYNAMIC_APP');
	$STATIC_APP = getenv('STATIC_APP');
	?>

	<VirtualHost *:80>
	ServerName demo.res.ch
	
	ProxyPass '/api/students/' 'http://<?php print "$DYNAMIC_APP"?>/'
	ProxyPassReverse '/api/students/' 'http://<?php print "$DYNAMIC_APP"?>/'

    ProxyPass '/' 'http://<?php print "$STATIC_APP"?>/'
	ProxyPassReverse '/' 'http://<?php print "$STATIC_APP"?>/'

	</VirtualHost>


Grace a ce code nous avons reussit a effectuer une configuration dynamique des variables d'environnement

(voir capture d'ecran)

-> On est capable de generer le fichier de config avec php !


Ensuite on ajoutes la copie du dossier contenant les templates  de fichiers de config, dans notre Dockerfile du serveur apache_proxy.

Enfin, on ajoutes la commande d'execution du fichier de config en php, à notre script.

*php /var/apache2/templates/config-template.php > /etc/apache2/sites-available/001-reverse-proxy.conf*

Ces configs sont ensuite enregistres de maniere dynamique dans le meme ficheir de configuration que l'etape précedente, a savoir *001-reverse-proxy.conf*


#Final countdown

dernière étape ici !

On tue tout nos containers encore en activité et lancant plusieurs containers de chaque image docker (apache_dynamic, expres_dynamic).


La dernière commande a effectuer est celle ci :

	docker run -d -e STATIC_APP=172.17.0.5:80 -e DYNAMIC_APP=172.17.0.8:3000 --name apache_rp -p 8080:80 res/apache_rp 

Comme on peut le constater, en lancant dans un browser **demo.res.ch:8080** on tombe sur la page html statique, et en tapant **demo.res.ch:8080/api/dockers**, on tombe sur le contenu JSON retourné par notre *express_image*.


Un script **demo5** permet d'effectuer toutes les commandes necessaires de cette etape.

##Bonus

###Load Balancer


Le load balancing nous permet d'obtenir plusieurs noeuds du serveur statiques, ainsi que plusieurs noeuds du serveur dynamique. You show that you can have **multiple static server nodes** and **multiple dynamic server nodes**.

Cette technique de load balancing permet à la fois de répondre à une charge trop importante d'un service en la répartissant sur plusieurs serveurs, et de réduire l'indisponibilité potentielle de ce service que pourrait provoquer la panne logicielle ou matérielle d'un unique serveur

Le load balancer s'occupe de repartir la charge de requetes.

A l'aide de Proxy Balancer on defini un balancer e chargeant de repartir les requetes de nos sites web


Specifier une adress ip de manière equitable entre site staique et site dynamique
Choisi une adresse parmi celles references dans le laoad balancer depuis le proxy et repartide manière equitable vers une des requete.

Un script **demo6_1** permet d'effectuer toutes les commandes necessaires de cette etape.


###Sticky sessions


 Now, here comes the role of sticky-session. If the load balancer is instructed to use sticky sessions, all of your interactions will happen with the same physical server, even though other servers are present. Thus, your session object will be the same throughout your entire interaction with this website.

To summarize, In case of Sticky Sessions, all your requests will be directed to the same physical web server while in case of a non-sticky loadbalancer may choose any webserver to serve your requests.


Ca cree un cookie et si tu fait un requete sur proxy et qcree un balancer tu retombe sur le meme balancer, tant que le balancer est

Example : Serveur d'Amazon dirigeant toute srequetes d'un client vers un balancer 32, et si crash redirige vers 33 -> Utile pour DoS, et reparti les taches et grace aux cookies c'est spécifié sur quel balancer on est redirigé !

Pour la demo on se base sur la demo6_1 et lancons le loadbalancer en rajoutant pour un des serveurs (static ou dynamic) un cookie de session.

Un script **demo6_2** permet d'effectuer toutes les commandes necessaires de cette etape.


### Management UI


Pour effectuer un management de nos iamges et container dockers sur notre machine nous avons decide d'utiliser Portainer.io

Portainer.io est ...

Pour demarrer le container nous executons les commande suivantes :
	
	docker volume create portainer_data
	docker run -d -p 9000:9000 --name portainer --restart always -v /var/run/docker.sock:/var/run/docker.sock -v portainer_data:/data portainer/portainer
	
Les ids et usernames utilisée sont les suivants:	
	zedsdead
	dockerislovedockerislife
	
Il nous suffit ensuite de taper dans un navigateur :
	
	demo.res.ch:9000

On choisi une gestion des dockers locaux (localhost).

Nous arrivons sur une interface de gestion de dockers assez intuitive, presentant les dockers images/containers en mode running/off sur notre laptop.
Nous pouvons "kill","rm","pause" nos containers locaux


Un script **demo6_3** permet d'effectuer toutes les commandes necessaires de cette etape.