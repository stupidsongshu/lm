window.onload = function () {
	RESETPWD.init();
}
var RESETPWD = {
	url : 'http://apmen.cn:8080/llm/login/',
	getUrlParams : function(){
		var urlParams = window.location.search.substring(1);
		var params = urlParams.split('=');
		if(params[0]=='id'){
			return params[1];
		}else{
			return '';
		}
	},
	toggleTips : function(msg){
		var tipsText = document.getElementById('tipsText');
		tipsText.innerHTML = msg;
		tipsText.style.display = 'block';
		setTimeout(function(){
			tipsText.style.display = 'none';
		},3000);
	},
	init : function(){
		if(RESETPWD.getUrlParams == ''){
			window.location.href = '../page/404.html';
		}
		var submit = document.getElementById('submit');
		submit.onclick = function(){
			RESETPWD.resetPwd();//登录
		}
	},
	resetPwd : function(){
		var password1 = document.getElementById('password1').value;
		var password2 = document.getElementById('password2').value;
		var id = RESETPWD.getUrlParams();
		var paramter;
		if(password1 == ''){
			LOGIN.toggleTips('密码不能为空');
			return ;
		}
		if(password2 == ''){
			LOGIN.toggleTips('确认密码不能为空');
			return ;
		}
		if(password1 != password2){
			LOGIN.toggleTips('确认密码与所设密码不一致');
			return ;
		}

		paramter = "id="+id+"&password="+password1;

		var xhr;
		if(window.XMLHttpRequest){
		    xhr = new XMLHttpRequest();	 //IE7+,Firefox,Chrome,Opera,Safari浏览器执行代码
		}else{
		    xhr = new ActiveXObject("Microsoft.XMLHTTP");// IE6, IE5 浏览器执行代码
		}
		xhr.open("POST",LOGIN.url+"replacePwd",true);
		xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
		xhr.send(paramter);
		xhr.onreadystatechange = function(){
	  		if (xhr.readyState==4 && xhr.status==200){
	  			var obj = JSON.parse(xhr.responseText);
	  			if(obj.status==1){
	  				LOGIN.toggleTips('设置密码成功,5s后自动跳转到登录页面');
	  				setTimeout(function(){
	  					window.location.href = 'login.html';
	  				},5000);
	  			}
	    	}else{
	    		LOGIN.toggleTips('服务器错误');
	    	}
  		}
	}
};