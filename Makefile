infra:
	$(call log, "Starting docker containers")
	docker-compose up

node_modules:
	$(call log, "Installing dependencies")
	rm -rf node_modules
	yarn cache clean --force
	yarn install

build-js:
	$(call log, "Building")
	yarn build:js

watch:
	$(call log, "Starting dev server")
	yarn watch

db-generate-migration:
	$(call log, "Creating migration")
	yarn typeorm:migration:generate -- -n ${name}

db-run-migration:
	$(call log, "Database migration")
	yarn typeorm:migration:run

db-revert:
	$(call log, "Database rollback")
	yarn typeorm:migration:revert

db-reset: db-revert db-run

test:
	$(call log, "Running tests")
	yarn test

test-coverage:
	$(call log, "Running tests")
	yarn test:coverage

lint-ts:
	$(call log, "Running eslint")
	yarn lint:ts

prettier:
	$(call log, "Running eslint")
	yarn format

rules := \
	infra \
	node_modules \
	build-js \
	watch \
	db-generate-migration \
	db-run-migration \
	db-revert \
	db-reset \
	test \
	test-coverage \
	lint-ts \
	prettier \

.PHONY: $(rules)
