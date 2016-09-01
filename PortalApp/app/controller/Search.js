Ext.define('SpWebPortal.controller.Search', {
    extend: 'Ext.app.Controller',
    
    init: function() {
	//console.info("Search.init");
	this.control({
	    'button[itemid="spwpexpcsvbtn"]' : {
		click: this.forCsv
	    },
	    'checkbox[itemid="req-img-ctl"]': {
		change: this.reqImgChange
	    },
	    'checkbox[itemid="req-geo-ctl"]': {
		change: this.reqGeoChange
	    },
	    'checkbox[itemid="fit-to-map"]': {
		change: this.fitToMapChange
	    }
	});

	this.callParent(arguments);
    },

    config: {
	requireImages: false,
	requireGeoCoords: false,
	matchAll: false,
	fitToMap: false,
	forceFitToMap: false,
        writeToCsv: false
    },

    onSpecialKey: function(field, e) {
	if (e.getKey() == e.ENTER) {
            console.info("doSearch()?");
	    this.doSearch();
	}
    },

    forCsv: function (cmp) {
        //console.info("CSV");
        this.setWriteToCsv(true); 
        this.doSearch(cmp.srch);
        this.setWriteToCsv(false);
    },
    
    mapViewIsActive: function() {
	return Ext.getCmp('spwpmainmappane').isVisible();
    },

    getViewAlias: function() {
	return "override me";
    },

    reqImgChange: function() {
	this.setRequireImages(!this.getRequireImages());
    },

    reqGeoChange: function() {
	this.setRequireGeoCoords(!this.getRequireGeoCoords());
    },

    fitToMapChange: function() {
	this.setFitToMap(!this.getFitToMap());
    },

    matchAllChange: function() {
	//console.info("match all change!");
	this.setMatchAll(!this.getMatchAll());
	//console.info("MatchAll = " + this.getMatchAll());
    },

    escapeForSolr: function(srchText, isFullText) {
	//assuming srchText is defined and non-null
	var result = isFullText ? srchText.toLowerCase() : srchText;
	result = result.replace('&', '%26');
	//etc...
	return result;
    },

    searchLaunched: function() {
	var resultsTab = Ext.getCmp('spwpmaintabpanel');
	if (!resultsTab.isVisible()) {
	    var background = Ext.getCmp('spwpmainbackground');
	    background.setVisible(false);
	    resultsTab.setVisible(true);
	}
	resultsTab.fireEvent('dosearch');
    },

    exportToCsv(url, fileName) {
	//console.info("sending jquery ajax request " + url);
        if (navigator.userAgent.indexOf("MSIE") != -1) {
            window.open(url);
        } else {
            $.ajax({
                url: url,
	        context: this,
	        crossDomain: true,
                success: function(src) {
                    console.info("JQUERY to the rescue!");
                    var a = document.createElement("a");
                    //need to replace \, with , due to issues with solr csv.sv.escape setting.
                    var file = new Blob([src], {type: 'application/csv'});
                    a.href = URL.createObjectURL(file);
                    a.download = fileName + '.csv';
                    document.body.appendChild(a);
                    a.click();
                    setTimeout(function() {
                        document.body.removeChild(a);
                        window.URL.revokeObjectURL(url);
                    }, 0);
                }
            });
        }
    }
    
});

    
