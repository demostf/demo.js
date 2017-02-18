tsc=node_modules/.bin/tsc

.PHONY: all
all: build

node_modules: package.json
	npm install --deps

.PHONY: watch
watch: node_modules
	node $(tsc) --watch

.PHONY: build
build: node_modules
	node $(tsc)
	node $(tsc) -p tsconfig.es6.json

.PHONY: test
test: node_modules
	node node_modules/.bin/mocha --opts mocha.opts
