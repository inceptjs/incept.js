rm -rf node_modules/@inceptjs
mkdir node_modules/@inceptjs

mkdir node_modules/@inceptjs/types
ln -s ../../../packages/types/dist node_modules/@inceptjs/types/dist
ln -s ../../../packages/types/package.json node_modules/@inceptjs/types/package.json

mkdir node_modules/@inceptjs/framework
ln -s ../../../packages/framework/dist node_modules/@inceptjs/framework/dist
ln -s ../../../packages/framework/package.json node_modules/@inceptjs/framework/package.json

rm -rf node_modules/inceptjs
mkdir node_modules/inceptjs
ln -s ../../packages/incept/dist node_modules/inceptjs/dist
ln -s ../../packages/incept/package.json node_modules/inceptjs/package.json
ln -s ../../packages/incept/components.js node_modules/inceptjs/components.js
ln -s ../../packages/incept/loadable.js node_modules/inceptjs/loadable.js