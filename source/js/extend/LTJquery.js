var request_url = 'http://xfjr.maimob.net:81';

var LTJquery = {
	init : function(){
		window.onresize = function(){LTJquery.resize();}
		LTJquery.resize();
		//LTJquery.setHighlight();
	},
	resize : function(){
		var basic = 18.75;
		var winWidth = 0;
		var fontSize  = 0;
		if (document.documentElement && document.documentElement.clientHeight && document.documentElement.clientWidth){
			winWidth = document.documentElement.clientWidth;
		}
		fontSize  = Math.round(winWidth/basic)>27 ? 27 : Math.round(winWidth/basic);
		$('html').css('fontSize',fontSize+'px');
	},
	setHighlight : function(){
		$.ajax({
			url : 'source/asset.txt',
			type : 'post',
			data : '',
			success : function(data){
				var obj = JSON.parse(data);
				$('.highlight').css('color',obj.color);
				$('.btn').css('background',obj.color);
				$('.dialog .close').css('backgroundColor',obj.color);
			}
		});
	}
}
LTJquery.init();

var DOMvisible = {
    getHiddenProp : function(){
        var prefixes = ['webkit', 'moz', 'ms', 'o'];

        // if 'hidden' is natively supported just return it
        if ('hidden' in document) return 'hidden';
        // otherwise loop over all the known prefixes until we find one
        for (var i = 0; i < prefixes.length; i++) {
            if ((prefixes[i] + 'Hidden') in document) 
                return prefixes[i] + 'Hidden';
        }
        // otherwise it's not supported
        return null;
    },
    getVisibilityState : function(){
        var prefixes = ['webkit', 'moz', 'ms', 'o'];
        if ('visibilityState' in document) return 'visibilityState';
        for (var i = 0; i < prefixes.length; i++) {
            if ((prefixes[i] + 'VisibilityState') in document)
                return prefixes[i] + 'VisibilityState';
        }
        // otherwise it's not supported
        return null;
    },
    isHidden : function(){
        var prop = getHiddenProp();
        if (!prop) return false;

        return document[prop];
    }
}
