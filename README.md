BTS SIO SISR 2e Année


# Travailler localement

## Tester le site

Le rendu le plus immédiat est de lancer le serveur localement avec la commande
`npm start`

Au préalable, il est nécessaire d'avoir instancié la base de données Postgres en lancant le script npm
`npm run build-db`

Cela va extraire les variables d'environnement du fichier `.env` et lancer le serveur.

Celui-ci sera immédiatement disponible à l'adresse http://localhost:3000/

le serveur:
```shell
node --env-file=../.env src/backend/server.js`
node --env-file=../.env.local src/index.js
```

## Tester le déploiement

Pour tester le site dans une configuration plus proche du déploiement réel, il est possible d'utiliser docker compose.

Depuis le répertoire racine, lancer la commande
`docker compose up -d`

Le serveur sera accessible à l'adresse http://localhost:3001

# En Production

L'image pour le site en production requiert de modifier le fichier docker-compose pour qu'il construise l'image cible `prod`.

Cette image est la seule nécessaire.

La base de données est hebergée en dehors du serveur.

Si les données sont effacées, alors la commande suivante va les reproduire.
```shell
./.env
PGPASSWORD=$POSTGRES_PASSWORD psql -e -h localhost -d $POSTGRES_DB -U $POSTGRES_USER -p 5433 -f ./scripts/build-db.sql
```


## Mettre CORS sur le bucket S3

Les navigateurs bloquent les documents sinon

```shell
aws s3api put-bucket-cors --bucket portfolio-bts --profile ovh --endpoint-url=https://s3.rbx.io.cloud.ovh.net --cors-configuration=file://cors.json
```

avec `cors.json`
```json
{
   "CORSRules": [
        {
            "AllowedHeaders": ["Content-Type", "Access-Control-Allow-Headers"],
            "AllowedMethods": ["GET", "HEAD", "POST", "PUT", "DELETE"],
            "AllowedOrigins": ["https://portfolio.fief.ovh"],
            "ExposeHeaders": ["Access-Control-Allow-Origin"]
        }
   ]
}


```