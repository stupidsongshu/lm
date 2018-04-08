window.onload = function(){
	deviceType();
	LDK.init();

	//shade.dialog.toggleDialog();//打开对话框
	//shade.dialog.title("提示");//设置对话框标题
	//shade.dialog.content("这是对话框内容");//设置对话框内容

	//shade.loading.showLoading('<img src="source/image/loading.gif"/>');//显示加载层
	//shade.loading.hideLoading();//隐藏加载层
}
//测试数据
var data = {
	"name" : "现金无忧",
	"id" : "123",
	"url" : "http://www.baidu.com",
	"caculate" : {
		"rate" : "0.018",
		"rateText" : "月利率",
		"limitRange" : [500,20000],
		"limitTime" : [3,6,9,12],
		"flag" : "2",
		"timeList" : [3,6,9,12],
	},
	"detail" : {
		"points" : ["无需信用卡","无需查看信用报告"],
		"process": ["../image/detail/process/1.png",
					"../image/detail/process/2.png",
					"../image/detail/process/3.png",
					"../image/detail/process/4.png",
					"../image/detail/process/5.png"],
		"condition" : "18~55周岁",
		"material"  : "1、身份证<br/>2、手机号验证<br/>3、银行卡信息"
	}
};
var LDK = {};
LDK.ui = {};
LDK.app = {};
LDK.ui = function() {
	$(".back").on("click",function(){
		location.href = "../../index.html";
	});
	$("#setLoanNum").on("change",function(){
		LDK.app.setLoanNum();
	});
	$("#limitTime").on("change",function(){
		LDK.app.setLoanNum();
	});
	$("#body").on("click",".apply",function(){
		LDK.app.countApplicants();
	});
}
/****************请求数据*****************/
LDK.app.countApplicants = function(){
	//点击申请后统计方法
	alert(111);
}
LDK.app.loadData = function(){
	var flag,
		flagText,
		repayText,
		limitTimeStr,
		oneContentStr,
		twoContnetStr;
	var defaultLoan  = data.caculate.limitRange[0]*2,//设置默认贷款金额
		defaultTime  = data.caculate.limitTime[0],//设置默认贷款期限
		defaultRepay = (defaultLoan/defaultTime).toFixed(2),
		defaultInstrest = data.caculate.rate*defaultLoan*defaultTime,
		percentRate = (data.caculate.rate*100).toFixed(1)+"%";//设置默认每月还款
	//测试
	$("title").text(data.name);
	$("#headTitle").text(data.name).attr("appid",data.id);
	$(".variable").text(data.caculate.rateText+"："+percentRate).attr("value",data.caculate.rate);
	$(".limitRange").text(data.caculate.limitRange[0]+"~"+data.caculate.limitRange[1]+"元");
	$(".loanNum").text(defaultLoan);//显示默认贷款金额
	$("#setLoanNum").val(defaultLoan).slider("refresh");//设置默认贷款金额
	$("#setLoanNum").prop("min", data.caculate.limitRange[0]).slider("refresh");
	$("#setLoanNum").prop("max", data.caculate.limitRange[1]).slider("refresh");
	$(".min").text(data.caculate.limitRange[0]);
	$(".max").text(data.caculate.limitRange[1]+"元");
	$(".timeLimit").text(data.caculate.limitTime[0]+"~"+data.caculate.limitTime[3]+"月");
	$(".limitTime").attr("flag",data.caculate.flag);//期限类别
	if(data.caculate.flag ==1){
		flag = "日";
		repayText = "日还款(元)";
	}else if(data.caculate.flag ==2){
		flag = "月";
		repayText = "月还款(元)";
	}
	$(".repay").text(defaultRepay);//还款金额
	$(".repayText").text(repayText);//还款金额文字
	$(".totalIntrest").text(defaultInstrest);//默认利息

	//添加期限列表
	for(var i=0; i<data.caculate.limitTime.length; i++){
		var value = data.caculate.limitTime[i];
		limitTimeStr = '<option value="'+value+'">'+value+flag+'</option>';
		$("#limitTime").append(limitTimeStr);
	}
	$("#limitTime").prev().text(defaultTime+"月");
	//设置详细信息
	for(var i=0; i<data.detail.points.length; i++){
		oneContentStr = '<span>'+data.detail.points[i]+'</span>';
		$(".oneContent").append(oneContentStr);
	}
	for(var i=0; i<data.detail.process.length; i++){
		twoContnetStr = '<span><img src="'+data.detail.process[i]+'"></span>';
		$(".twoContent").append(twoContnetStr);
	}
	$(".threeContent").text(data.detail.condition);
	$(".fourContent").html(data.detail.material);
	$("#apply").attr("rel",data.url);//立即申请按钮跳转

	//正式：把上面的代码删掉
	var id = LDK.app.getId();
	var params = {"id":id};
	/*LDK.app.ajaxRequest("url","params",function(status,response){
		if(status==200){
			var flag,
				flagText,
				repayText,
				limitTimeStr,
				oneContentStr,
				twoContnetStr;
			var defaultLoan  = data.caculate.limitRange[0]*2,//设置默认贷款金额
				defaultTime  = data.caculate.limitTime[0],//设置默认贷款期限
				defaultRepay = (defaultLoan/defaultTime).toFixed(2),
				defaultInstrest = data.caculate.rate*defaultLoan*defaultTime,
				percentRate = (data.caculate.rate*100).toFixed(1)+"%";//设置默认每月还款
			//测试
			$("#headTitle").text(data.name).attr("id",data.id);
			$(".variable").text(data.caculate.rateText+"："+percentRate).attr("value",data.caculate.rate);
			$(".limitRange").text(data.caculate.limitRange[0]+"~"+data.caculate.limitRange[1]+"元");
			$(".loanNum").text(defaultLoan);//显示默认贷款金额
			$("#setLoanNum").val(defaultLoan).slider("refresh");//设置默认贷款金额
			$("#setLoanNum").prop("min", data.caculate.limitRange[0]).slider("refresh");
			$("#setLoanNum").prop("max", data.caculate.limitRange[1]).slider("refresh");
			$(".min").text(data.caculate.limitRange[0]);
			$(".max").text(data.caculate.limitRange[1]+"元");
			$(".timeLimit").text(data.caculate.limitTime[0]+"~"+data.caculate.limitTime[3]+"月");
			$(".limitTime").attr("flag",data.caculate.flag);//期限类别
			if(data.caculate.flag ==1){
				flag = "日";
				repayText = "日还款(元)";
			}else if(data.caculate.flag ==2){
				flag = "月";
				repayText = "月还款(元)";
			}
			$(".repay").text(defaultRepay);//还款金额
			$(".repayText").text(repayText);//还款金额文字
			$(".totalIntrest").text(defaultInstrest);//默认利息

			//添加期限列表
			for(var i=0; i<data.caculate.limitTime.length; i++){
				var value = data.caculate.limitTime[i];
				limitTimeStr = '<option value="'+value+'">'+value+flag+'</option>';
				$("#limitTime").append(limitTimeStr);
			}
			$("#limitTime").prev().text(defaultTime+"月");
			//设置详细信息
			for(var i=0; i<data.detail.points.length; i++){
				oneContentStr = '<span>'+data.detail.points[i]+'</span>';
				$(".oneContent").append(oneContentStr);
			}
			for(var i=0; i<data.detail.process.length; i++){
				twoContnetStr = '<span><img src="'+data.detail.process[i]+'"></span>';
				$(".twoContent").append(twoContnetStr);
			}
			$(".threeContent").text(data.detail.condition);
			$(".fourContent").html(data.detail.material);
			$(".apply").attr("href",data.url);//立即申请按钮跳转
		}
	});*/
}
LDK.app.setLoanNum = function(){
	var rate = parseFloat($(".variable").attr("value")),//利率
		limitTime = parseInt($("#limitTime").val()),//期限选择值
		loanNum = parseInt($("#setLoanNum").val()),//当前贷款金额
		flag = $("#limitTime").attr("flag");
	var repay,instrest;
	instrest = parseFloat((loanNum*rate*limitTime).toFixed(2));
	repay = (parseFloat(loanNum/limitTime)+(loanNum*rate)).toFixed(2);
	/*********************** 利息计算 *************************/
	/*switch(flag){
		case 1:
			console.log("日利率计算");
			//日利率计算代码
			instrest = parseFloat((loanNum*rate*limitTime).toFixed(2));
			repay = (parseFloat(loanNum/limitTime)+(loanNum*rate)).toFixed(2);
			break;
		case 2:
			console.log("月利率计算");
			//月利率计算代码
			instrest = parseFloat((loanNum*rate*limitTime).toFixed(2));
			repay = (parseFloat(loanNum/limitTime)+(loanNum*rate)).toFixed(2);
			break;
		case 3:
			console.log("年利率计算");
			//年利率计算代码
			instrest = parseFloat((loanNum*rate*limitTime).toFixed(2));
			repay = (parseFloat(loanNum/limitTime)+(loanNum*rate)).toFixed(2);
			break;
	}*/
	$(".repay").text(repay);
	$(".totalIntrest").text(instrest);
	$(".loanNum").text(loanNum);
}
LDK.app.getId = function(){
	var query = window.location.search.substring(1);
	var pair = query.split("=");
	return pair[1];
}
LDK.app.ajaxRequest = function(url,params,callback){
	$.ajax({
		url : url,
		data : params,
		type : 'post',
		success : function(status,response){
			callback(status,response);
		}
	});
}
LDK.init = function(){
	LDK.ui();
	LDK.app.loadData();
	$("#apply").on('click',function(){
		var rel = $(this).attr("rel");
		window.location.href = rel;
	});
}
$(window).resize(function () {deviceType();});
function deviceType() {
    var browser = {
        version: function () {
            var u = navigator.userAgent;
            var app = navigator.appVersion;
            return {
                trident : u.indexOf('Trident') > -1,
                presto : u.indexOf('Presto') > -1,
                webkit : u.indexOf('AppleWebkit') > -1,
                gecko : u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1,
                mobile : !!u.match(/AppleWebKit.*Mobile.*/) || !!u.match(/AppleWebKit/),
                ios : !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/),
                android : u.indexOf('Android') > -1 || u.indexOf('Linux') > -1,
                iPhone : u.indexOf('iPhone') > -1 || u.indexOf('Mac') > -1,
                iPad : u.indexOf('iPad') > -1,
                webApp : u.indexOf('Safari') == -1
            };
        }(),
        language:(navigator.browserLanguge || navigator.language).toLowerCase()
    }
    if( browser.version.ios || browser.version.iPhone || browser.version.iPad ){
        return 'ios';
    }else if( browser.version.android ){
        return 'android';
    }else {
        $("#body").addClass("changeBody");
    }
}

