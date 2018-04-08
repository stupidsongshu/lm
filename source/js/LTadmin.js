window.onload = function () {
	LTadmin.init();
	miniSPA.changeURL();
}
var LTadmin = {
	default : {
		"home" : {
			style : 'source/css/home.css',
			script : 'source/js/home.js'
		}
	},
	init : function(){
		$('.toggleMenu').on('click',function(){
			console.log($('.wrapper[role=wrapper]').width());
			$('.side[role=menu]').toggleClass('slideLeft');
			$('.main[role=main]').toggleClass('slideLeft');
			console.log($('.main[role=main]').width());
			console.log($('.header[role=header]').width());
			setTimeout(function(){
				console.log($('.main[role=main]').width());
			},600);
		});
		$('ul[role=menuList]').on('click','li',function(){
			var _this = this;
			var rel = $(_this).data('rel');
			$(_this).addClass('active').children('ul').slideDown();
			$(_this).siblings('li').removeClass('active').children('ul').slideUp();
		});
		$('.subMenu').on('click','li',function(){
			$(this).addClass('active').siblings('li').removeClass('active');
		});
	},
    loadStyle : function(url){
        var link = document.createElement("link");
        link.type = "text/css";
        link.rel = "stylesheet";
        link.href = url;
        document.getElementsByTagName("head")[0].appendChild(link);
    },
    loadScript : function(url){
        var script = document.createElement("script");
        script.type = "text/javascript";
        script.src = url;
        document.body.appendChild(script);
    },
    doAjaxRequest : function(url,data,callback){
    	$.ajax({
    		url : url,
    		type : 'post',
    		data : data,
    		success : function(data){
    			callback(data);
    		},
    		error : function(data){
    			callback(data);
    		}
    	});
    }
};
