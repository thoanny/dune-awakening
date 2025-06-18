# dune-awakening

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```

## Admin

Installer Django :
`python -m pip install Django`

Vérifier que le dossier Scripts de Python soit dans les variables d'environnements (Path), exemple :
`C:\Users\{user}\AppData\Roaming\Python\Python313\Scripts`

Pour démarrer le serveur :
`python ./admin/manage.py 7000` (pour lancer sur le port 7000)

D'abord créer un projet (admin), puis créer des apps (app).

Modifier les models.py, importer dans le admin.py.

Si modification de models : `python manage.py makemigrations` pour générer les migrations, puis `python manage.py migrate` pour exécuter les migrations.
