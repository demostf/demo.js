TS_JS    := $(TS_SRC:.ts=.js)

.PHONY: all tsc

all: $(TS_JS)

$(TS_JS): %.js: %.ts js.stub
    $(TSLINT) $<

js.stub: $(TS_SRC)
    $(TSC) $^
    @touch $@
