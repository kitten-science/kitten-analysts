.PHONY: default build clean docs git-hook pretty lint test run

default: build

build: lib output

clean:
	rm --force --recursive lib node_modules output overlay tsconfig.tsbuildinfo

docs:
	@echo "This project has no documentation."

git-hook:
	echo "make pretty" > .git/hooks/pre-commit

pretty: node_modules
	yarn biome check --write --no-errors-on-unmatched
	npm pkg fix

lint: node_modules
	yarn biome check .
	yarn tsc --noEmit

test:
	@echo "Kitten Analysts test in production."


node_modules:
	yarn install

lib: node_modules
	yarn tsc --build

output: node_modules
	yarn vite --config vite.config.userscript.js build

.PHONY: entrypoints
entrypoints: node_modules
	node build.js

.PHONY: injectable
injectable: node_modules
	yarn vite --config vite.config.inject.js build

.PHONY: userscript
userscript: node_modules
	yarn vite --config vite.config.userscript.js build
	MINIFY=true yarn vite --config vite.config.userscript.js build

overlay: injectable
	mkdir -p overlay || true
	cp output/*.inject.js overlay/
	cp -r node_modules/@kitten-science/kitten-scientists/output/* overlay/
