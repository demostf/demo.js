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

.PHONY: test
test: node_modules
	node node_modules/.bin/mocha --opts mocha.opts

.PHONY: unit
unit: node_modules
	node node_modules/.bin/mocha --opts unit.mocha.opts

.PHONY: lint
lint: node_modules
	node_modules/.bin/tslint -p tsconfig.json

.PHONY: lint-fix
lint-fix: node_modules
	node_modules/.bin/tslint -p tsconfig.json --fix

.PHONY: src/Data/GameEventTypes.ts
src/Data/GameEventTypes.ts:
	node bin/analyse.js --create-event-definitions src/tests/data/celt.dem > src/Data/GameEventTypes.ts
