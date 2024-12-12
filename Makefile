# Mirror for downloading Apache Solr.
SOLR_MIRROR := http://archive.apache.org/dist/lucene/solr

# Use latest available version of Solr 
export SOLR_VERSION := $(shell curl -s $(SOLR_MIRROR)/ | python3 get_latest_solr_vers.py)
export SOLR_VERSION = 7.5.0

export SOLR_DIST := solr-$(SOLR_VERSION)
export TOPDIR := $(shell pwd)

all: build

clean:
	rm -rf build/

realclean: clean
	rm -rf solr-* unpacked-war

build: $(SOLR_DIST) build.make specify_exports specify_exports/*.zip
	cp -r $(SOLR_DIST)/ build
	$(MAKE) -f $(TOPDIR)/build.make -C build
	touch $@

$(SOLR_DIST).tgz:
	# Fetching Solr distribution tar ball.
	wget $(SOLR_MIRROR)/$(SOLR_VERSION)/$@

$(SOLR_DIST): $(SOLR_DIST).tgz
	# Unpacking Solr distribution.
	rm -rf $@
	tar -zxf $<

$(SOLR_DIST)/%: $(SOLR_DIST)
