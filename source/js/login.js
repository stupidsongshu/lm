window.onload = function () {
	var login = document.getElementById('login');
	// var forget = document.getElementById('forget');
	login.onclick = function(){
		LOGIN.login();//登录
	}
	// forget.onclick = function(){
	// 	LOGIN.forget();//忘记密码
	// }
}

var LOGIN = {
	toggleTips : function(msg){
		var tipsText = document.getElementById('tipsText');
		tipsText.innerHTML = msg;
		tipsText.style.display = 'block';
		setTimeout(function(){
			tipsText.style.display = 'none';
		},3000);
	},
	enterEvent : function(event){
		if(event.keyCode){
            if(event.keyCode != 13){
                return;
            }
            LOGIN.login();
        }else{
            if(event.keyCode != 13){
                return;
            }
            LOGIN.login();
        }
	},
	// login : function(){
	// 	var userName = document.getElementById('userName');
	// 	var password = document.getElementById('password');
	// 	var paramter = "userName="+userName.value+"&password="+password.value;
	// 	if(userName.value.trim() == ''){
	// 		LOGIN.toggleTips('用户名不能为空');
	// 		return ;
	// 	}
	// 	if(password.value.trim() == ''){
	// 		LOGIN.toggleTips('密码不能为空');
	// 		return ;
	// 	}

	// 	var xhr;
	// 	if(window.XMLHttpRequest){
	// 	    xhr = new XMLHttpRequest();	 //IE7+,Firefox,Chrome,Opera,Safari浏览器执行代码
	// 	}else{
	// 	    xhr = new ActiveXObject("Microsoft.XMLHTTP");// IE6, IE5 浏览器执行代码
	// 	}
	// 	xhr.open("POST",ajaxUrl.loginUrl,true);
	// 	xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
	// 	xhr.send(paramter);
	// 	xhr.onreadystatechange = function(){
	//   		if (xhr.readyState==4 && xhr.status==200){
	//   			var obj = JSON.parse(xhr.responseText);
	//   			if(obj.status==1){
	//   				sessionStorage.ldkusername = userName.value;
	//   				LOGIN.toggleTips('登录成功');
	//   				window.location.href = '../../index.html';
	//   			}else if(obj.status==-1 || obj.status==-2){
	//   				LOGIN.toggleTips('用户名不存在');
	//   			}else if(obj.status==-3){
	//   				LOGIN.toggleTips('密码错误');
	//   			}
	//     	}else{
	//     		LOGIN.toggleTips('服务器错误');
	//     	}
  	// 	}
	// },
	login() {
		var url = ajaxUrl.loginUrls.loginUrl
		var call = "Account.login"

		var userName = document.getElementById('userName');
		var password = document.getElementById('password');
		if(userName.value.trim() == ''){
			LOGIN.toggleTips('用户名不能为空');
			return ;
		}
		if(password.value.trim() == ''){
			LOGIN.toggleTips('密码不能为空');
			return ;
		}

		var param = {
			account: userName.value,
			password: password.value
		}

		// LTadmin.doAjaxRequestSign(url, call, param, function(data) {
		// 	data = JSON.parse(data)
		// 	if (data.returnCode === '000000') {
		// 		LOGIN.toggleTips('登录成功');
		// 		sessionStorage.ldkusername = userName.value;
		// 		sessionStorage.userInfo = JSON.stringify(data.response)
		// 		window.location.href = '../../index.html';
		// 	} else {
		// 		LOGIN.toggleTips(data.returnMsg);
		// 	}
		// })


		LTadmin.doAjaxRequestSign(url, call, param, function(data) {
			data = JSON.parse(data)
			console.log(data)
			if (data.returnCode === '000000') {
				LOGIN.toggleTips('登录成功');
				sessionStorage.ldkusername = userName.value;
				sessionStorage.userInfo = JSON.stringify(data.response);
				window.location.href = '../../index.html';
			} else {
				LOGIN.toggleTips(data.returnMsg);
			}
		})
	},
	forget : function(){
		var userName = document.getElementById('userName').value;
		var paramter = "userName="+userName;
		if(userName.trim() == ''){
			LOGIN.toggleTips('请输入用户名');
			return ;
		}

		var xhr;
		if(window.XMLHttpRequest){
		    xhr = new XMLHttpRequest();	 //IE7+,Firefox,Chrome,Opera,Safari浏览器执行代码
		}else{
		    xhr = new ActiveXObject("Microsoft.XMLHTTP");// IE6, IE5 浏览器执行代码
		}
		xhr.open("POST",ajaxUrl.forgetPwd,true);
		xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
		xhr.send(paramter);
		xhr.onreadystatechange = function(){
	  		if (xhr.readyState==4 && xhr.status==200){
	  			var obj = JSON.parse(xhr.responseText);
	  			if(obj.status==1){
	  				if(userName.indexOf('@')>-1){
	  					LOGIN.toggleTips('重设密码邮件已发到您的邮箱');
	  				}else{
	  					LOGIN.toggleTips('重设密码短信已发到您的手机');
	  				}
	  			}else if(obj.status==-1 || obj.status==-2){
	  				LOGIN.toggleTips('用户名不存在');
	  			}
	    	}else{
	    		LOGIN.toggleTips('服务器错误');
	    	}
  		}
	}
};