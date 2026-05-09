E2E ?= true
SERVER_BUILD ?= turbo build
SERVER_RUN ?= turbo dev

.PHONY: all build run

all: run

build:
	E2E=$(E2E) $(SERVER_BUILD)

run: build
	E2E=$(E2E) $(SERVER_RUN)
