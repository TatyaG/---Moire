#!/usr/bin/env sh

# остановить публикации при ошибках
set -e

# сборка приложения 
npm run build

# переход в каталог сборки
cd dist

# инициализация репозитория и загрузка кода в GitHub
git init
git add -A
git commit -m "deploy"
git push -f https://github.com/TatyaG/moire.git master:gh-pages

cd ..
