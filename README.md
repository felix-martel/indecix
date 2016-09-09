# indecix
Projet MODAL INF471T

Configuration GIT : 
Il faut installer télécharger et installer git : https://git-scm.com/downloads
- Dans la console, se placer dans le répertoire de travail. Ici, si ton projet Cordova s'appelle td1,
alors il faut se placer dans td1/www/

- Créer un répertoire git : git init
- Ajouter le répertoire GitHub distant : git remote add web https://github.com/felix-martel/indecix.git/
- Télécharger les fichiers depuis GitHub : git pull web master (il te demandera de t'identifier)

Ensuite, lire ce guide : http://rogerdudler.github.io/git-guide/
En deux mots : tu as trois "zones" :
- ton working directory WD, qui contient tes fichiers et dans lequel tu travailles
- la HEAD : c'est un dossier qui comporte les fichiers dans l'état valide
- le répertoire distant MASTER (celui qui est en ligne)
Le principe c'est que tu travailles dans WD, tu fais tes changements, et une fois que ça marche et que tu veux les valider,
tu les valides et les déplaces dans HEAD avec 'commit'. Puis tu les envoies sur le serveur avec 'push'.
Les commandes essentielles étant :
- git status : permet de connaitre l'état du répertoire, les changements à commit, etc.
- git add nom_du_fichier : permet d'ajouter un fichier au répertoire (utile si tu crées un nouveau fichier)
- git commit -m "Ici rentrer un message pour expliquer les changements" : permet de valider les changements que tu as fait en local et de les placer dans HEAD
- git push web master : permet d'envoyer les changements vers le serveur
- git pull web master : permet de récupérer les changements du serveur
