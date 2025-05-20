.PHONY: default build clean docs git-hook pretty lint test run

default: build

build: injectable userscript entrypoints

clean:
	rm --force --recursive devcontainer/overlay lib node_modules output overlay tsconfig.tsbuildinfo

docs:
	@echo "This project has no documentation."

git-hook:
	echo "make pretty" > .git/hooks/pre-commit; chmod +x .git/hooks/pre-commit

pretty: node_modules
	npm exec -- biome check --write --no-errors-on-unmatched
	npm pkg fix

lint: node_modules
	npm exec -- biome check .
	npm exec -- tsc --noEmit

test:
	@echo "Kitten Analysts test in production."

run: output
	@node output/entrypoint-backend.js


.PHONY: devcontainer devcontainer-oci
devcontainer: output injectable entrypoints
devcontainer-oci: devcontainer
	docker build \
		--build-arg BRANCH="master" \
		--build-arg REPO="https://github.com/nuclear-unicorn/kittensgame.git" \
		--file devcontainer/Containerfile \
		--no-cache \
		--tag localhost/kadevcontainer:latest \
		.


node_modules:
	npm install

lib: node_modules
	npm exec -- tsc --build

output: node_modules
	npm exec -- vite --config vite.config.user.js build

.PHONY: entrypoints
entrypoints: node_modules
	node build.js

.PHONY: injectable
injectable: node_modules
	npm exec -- vite --config vite.config.inject.js build
	mkdir -p devcontainer/overlay/ && cp output/kitten-analysts.inject.js devcontainer/overlay/kitten-analysts.inject.js
	cp -r node_modules/@kitten-science/kitten-scientists/output/* devcontainer/overlay/

.PHONY: userscript
userscript: node_modules
	npm exec -- vite --config vite.config.user.js build
	MINIFY=true npm exec -- vite --config vite.config.user.js build
