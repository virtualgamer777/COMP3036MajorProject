SOLUTION ?= COMP3036.sln
WEB_DIR ?= apps/Web
TEST_DIR ?= tests/PlaywrightTests

.PHONY: all build watch watch-web watch-server watch-all start start-web test

all: build

build:
	@echo "Building solution: $(SOLUTION)"
	@dotnet build $(SOLUTION)

watch-web:
	@echo "Starting dotnet watch for web app in $(WEB_DIR)"
	@cd $(WEB_DIR) && dotnet watch run

start: watch-web

WEB_BIN ?= /home/feetloaf/Documents/code/FullStackDevelopment/COMP3036MajorProject/apps/Web/bin/Debug/net10.0/Web

start-web:
	@echo "Starting web app in $(WEB_DIR)"
	@cd $(WEB_DIR) && dotnet run > /tmp/dotnet.log 2>&1 &
	@sleep 5
	@pgrep -f '$(WEB_BIN)' > /tmp/dotnet.pid

test:
	@$(MAKE) start-web
	@echo "Running tests in $(TEST_DIR)"
	@dotnet test $(TEST_DIR); \
	TEST_EXIT=$$?; \
	if [ -f /tmp/dotnet.pid ]; then \
		PID=$$(cat /tmp/dotnet.pid); \
		kill -9 $$PID 2>/dev/null || true; \
		rm -f /tmp/dotnet.pid; \
	fi; \
	pkill -9 -f '$(WEB_BIN)' 2>/dev/null || true; \
	exit $$TEST_EXIT
