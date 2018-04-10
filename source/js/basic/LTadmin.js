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
        //是否从登录窗口进来
        console.log(sessionStorage.ldkusername);
        if(!sessionStorage.ldkusername || sessionStorage.ldkusername==''){
            window.location.href = 'source/page/login.html';
        }else{
            $('.username').text(sessionStorage.ldkusername);
        }

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

        //注销用户操作
        $('#logout').on('click',function(){
            sessionStorage.ldkusername = '';
            window.location.href = 'source/page/login.html';
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
    doAjaxRequest : function(url,data,callback,async){
		var async = true;
    	if (async!=undefined) {
			async = async;
    	}
		console.log('是否异步:'+async);
    	$.ajax({
    		url : url,
    		type : 'post',
    		data : data,
    		async : async,
    		success : function(data){
    			callback(data);
    		},
    		error : function(data){
    			callback(data);
    		}
    	});
	},
	doAjaxRequestSign: function(url, call, data, callback, async) {
		$('#self-indicator-wrapper').fadeIn();
		var async = true;
    	if (async!=undefined) {
			async = async;
    	}
		// console.log('是否异步:'+async);

		var ua = ajaxUrl.ua
		var signKey = ajaxUrl.signKey
		var timestamp = new Date().getTime()
		var sign =  md5(ua + "&" + call + "&" + timestamp + "&" + signKey);

		var params = JSON.stringify({
			"ua": ua,
			"call": call,
			"args": data,
			"sign": sign,
			"timestamp": timestamp
		})

		var key = CryptoJS.enc.Utf8.parse(ajaxUrl.cryptoKey)
		var iv  = CryptoJS.enc.Utf8.parse(ajaxUrl.cryptoIv)
		var encrypted = CryptoJS.AES.encrypt(params, key, {
			iv: iv,
			mode: CryptoJS.mode.CBC,
			padding: CryptoJS.pad.Pkcs7
		});
    	$.ajax({
    		url : url,
    		type : 'post',
    		data : encrypted.toString(),
    		async : async,
    		success : function(data){
				$('#self-indicator-wrapper').fadeOut();
				var decrypted = CryptoJS.AES.decrypt(data, key, {
					iv: iv,
					mode: CryptoJS.mode.CBC,
					padding: CryptoJS.pad.Pkcs7
				});
				// var json = JSON.parse(CryptoJS.enc.Utf8.stringify(decrypted).toString())
    			callback(CryptoJS.enc.Utf8.stringify(decrypted).toString());
    		},
    		error : function(data){
				$('#self-indicator-wrapper').fadeOut();
    			callback(data);
    		}
    	});
	}
};
