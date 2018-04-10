var app = {
	partial : 'source/page/app.html',
	page : '应用列表',
	step2Create : false,
	init : function (argument) {
		$('.current span').text(app.page);
		$('.menuList>li[data-target=app]').addClass('active').siblings('li').removeClass('active');

		// var call = 'Product.list'
		// var userInfo = JSON.parse(sessionStorage.userInfo)
		// var param = {
		// 	account: userInfo.account,
		// 	token: userInfo.token
		// }
		// LTadmin.doAjaxRequestSign(ajaxUrl.appUrls.listProductUrl, call, param, function(data){
		// 	var obj = JSON.parse(data);
		// 	if (obj.returnCode === '000000') {
		// 		var products = obj.response;
		// 		console.log(products);
		// 		app.initTable(products);
		// 	} else {
		// 		alert(obj.returnMsg);
		// 		return;
		// 	}
		// });

		app.initTable();

		//初始化添加应用按钮
		$('#addApp').on('click',function(){
			sessionStorage.removeItem('productId');//产品唯一Id
			app.reset();//重置表单
			$('.tableWrapper').hide();
			$('.editWrapper').show();
			$('.editWrapper').data('type','0');
			var title = '<a href="javascript:;" class="showAppList">应用列表</a> > 添加应用';
			$('.current span').html(title);
		});
		//初始化返回应用列表按钮
		$('.main').on('click','.showAppList',function(){
			$('.tableWrapper').show();
			$('.editWrapper').hide();
			$('.current span').html('应用列表');
		});

		$('#step1 .btn-createApp').on('click', function() {
			var parameter = {
				"productName"        : $('#productName').val(),//产品名称
				"packageName"        : $('#productPackageName').val(),//产品包名
				"productSubTitle"    : $('#productSubTitle').val(),//产品二级标题
				"partnerId"          : $('#partnerId>option:selected').attr('value'),//产品提供方Id
				"h5ApplyUrl"         : $('#h5ApplyUrl').val(),//产品H5申请链接
				"productTypeId"      : $('#productType>option:selected').attr('value')//产品类型Id
			};
			if(parameter.productName.trim() === ''){
				app.toggleModal('“产品名称”是必填项，请完成！');
				return;
			}
			if(parameter.packageName.trim() === ''){
				app.toggleModal('“产品包名”是必填项，请完成！');
				return;
			}
			if(parameter.productSubTitle.trim() === ''){
				app.toggleModal('“产品二级标题”是必填项，请完成！');
				return;
			}
			if(parameter.partnerId === '请选择产品提供方'){
				app.toggleModal('“产品提供方”是必填项，请完成！');
				return;
			}
			if(parameter.productTypeId === '请选择产品类型'){
				app.toggleModal('“产品类型”是必填项，请完成！');
				return;
			}
			if(parameter.h5ApplyUrl.trim() === ''){
				app.toggleModal('“H5注册链接”是必填项，请完成！');
				return;
			}

			var url = ajaxUrl.appUrls.createAppUrl
			var call = 'Product.create'
			var userInfo = JSON.parse(sessionStorage.userInfo)

			var param = {
				account: userInfo.account,
				token: userInfo.token,
				// 产品包名
				packageName: parameter.packageName,
				// 合作方Id (string)
				partnerId: parameter.partnerId,
				// 产品名称
				productName: parameter.productName,
				// 产品2级标题
				productSubTitle: parameter.productSubTitle,
				// 产品H5申请链接
				h5ApplyUrl: parameter.h5ApplyUrl,
				// 产品类型Id (int)
				productTypeId: parseInt(parameter.productTypeId)
			}

			LTadmin.doAjaxRequestSign(ajaxUrl.appUrls.createAppUrl, call, param, function(data) {
				var obj = JSON.parse(data);
				app.toggleModal(obj.returnMsg);
				if (obj.returnCode === '000000') {
					// 产品唯一Id
					sessionStorage.productId = obj.response;
				}
			})
		})

		//初始化添加应用
		$('.stepContent:first').on('click','.title',function(){
			$(this).toggleClass('active').next().slideToggle();
		});
		$('.stepContent:not(.step1Content)').on('click','.title',function(){
			if (sessionStorage.productId === undefined) {
				app.toggleModal('请先创建应用');
				return;
			} else {
				$(this).toggleClass('active').next().slideToggle();
			}
		});
		//初始化下一步按钮
		$('.btn-next').on('click',function(){
			var _this = this;
			$('.btn-prev').removeClass('btn-disabled').attr('disabled',false);
			var classname = $('.progressView').children('.last').prev().attr('class');
			if(classname.indexOf('active')>-1){
				$(_this).addClass('btn-disabled').attr('disabled',true);
			}
			$('.progressView').children('.active').next().addClass('active current-step').prev().removeClass('current-step');
			var showTarget = '#'+$('.current-step').data('target');
			$(showTarget).show().siblings().hide();
		});
		//初始化上一步按钮
		$('.btn-prev').on('click',function(){
			var _this = this;
			$('.btn-next').removeClass('btn-disabled').attr('disabled',false);
			var activeNum = $('.progressView').children('.active').length;
			if(activeNum!=1){
				$('.progressView').children('.active').eq(activeNum-1).removeClass('active current-step').prev().addClass('current-step');
			}
			var showTarget = '#'+$('.current-step').data('target');
			$(showTarget).show().siblings().hide();
			activeNum = $('.progressView').children('.active').length;
			if(activeNum==1){
				$(_this).addClass('btn-disabled').attr('disabled',true);
			}
		});

		app.initPartners();//初始化产品提供方选择

		app.initFileUploadEvent();//初始化文件上传插件

		// app.initProductFeature();//初始化产品特性
		app.getPropertyConfig(app.initProductFeatureAndApplyInfo) //获取系统参数后初始化产品特性和申请信息

		app.inputEvent();//初始化输入框事件

		app.initStep2Event();//初始化步骤2

		// app.save();//保存应用信息
		// 更新合作产品额度费率
		$('#step1 .btn-updateFee').on('click', function() {
			app.updateFee()
		})
		// 更新产品特性信息
		$('#step2 .btn-updateCharacter').on('click', function() {
			app.updateCharacter()
		})
		// 更新产品申请信息
		$('#step2 .btn-updateApply').on('click', function() {
			app.updateApply()
		})
	},
	toggleModal : function(msg){
		$('.modal-body').text(msg);
		$('#appModal').modal();
	},
	inputEvent : function(){
		$('.checkInput').on('keyup',function(){
			var value = $(this).val();
			value = value.replace(/[^\d.]/g,'');
			$(this).val(value);
		});
	},
	// 系统参数
	getPropertyConfig: function(cb) {
		var url = ajaxUrl.appUrls.getPropertyConfigUrl
		var call = 'Property.config'
		var userInfo = JSON.parse(sessionStorage.userInfo)

		var param = {
			account: userInfo.account,
			token: userInfo.token
		}

		LTadmin.doAjaxRequestSign(ajaxUrl.appUrls.createAppUrl, call, param, function(data) {
			var obj = JSON.parse(data);
			if (obj.returnCode === '000000') {
				cb && cb(obj.response)
			} else {
				app.toggleModal('获取系统参数失败');
			}
		})
	},
	// 更新合作产品额度费率
	updateFee : function(){
		var parameter = {
			// "productId"          : $('#productId').val(),//产品ID
			"minCreLine"         : parseInt($('#minCreLine').val()==''?-1:$('#minCreLine').val()),//产品最小额度
			"maxCreLine"         : parseInt($('#maxCreLine').val()==''?-1:$('#maxCreLine').val()),//产品最大额度
			"interestRateType"   : parseInt($('#interestRateType>.active').attr('value')==undefined?-1:$('#interestRateType>.active').attr('value')),//产品利率类型
			"interestRate"       : parseFloat($('#interestRate').val()==''?-1:$('#interestRate').val()),//产品利率
			"instalType"         : parseInt($('#instalType>.active').attr('value')==undefined?-1:$('#instalType>.active').attr('value')),//产品分期类型
			"instalPeriodList"   : $('#instalPeriodList').val(),//产品分期期数
			"instalReturnType"   : parseInt($('input[name=instalReturnType]:checked').val()==undefined?-1:$('input[name=instalReturnType]:checked').val())//产品分期归还类型
		};

		if(parameter.minCreLine==-1){
			app.toggleModal('“产品最小额度”是必填项，请完成！');
			return;
		}
		if(parameter.maxCreLine==-1){
			app.toggleModal('“产品最大额度”是必填项，请完成！');
			return;
		}
		if(parameter.interestRateType==-1){
			app.toggleModal('“产品利率类型”是必填项，请完成！');
			return;
		}
		if(parameter.interestRate==-1){
			app.toggleModal('“产品利率”是必填项，请完成！');
			return;
		}
		if(parameter.instalType==-1){
			app.toggleModal('“产品分期类型”是必填项，请完成！');
			return;
		}
		if(parameter.instalCycles==-1){
			app.toggleModal('“产品分期间隔”是必填项，请完成！');
			return;
		}
		if(parameter.instalPeriodList.trim() === ''){
			app.toggleModal('“产品分期期数”是必填项，请完成！');
			return;
		}
		if(parameter.instalReturnType === -1){
			app.toggleModal('“产品分期归还类型”是必填项，请完成！');
			return;
		}

		var url = ajaxUrl.appUrls.updateProductFee;
		var call = 'Product.updateFee';
		var async = true;
		var userInfo = JSON.parse(sessionStorage.userInfo)
		parameter.account = userInfo.account
		parameter.token = userInfo.token
		parameter.productId = sessionStorage.productId
		// console.log(parameter);
		// if($('.editWrapper').data('type')=='0'){
		// 	//添加应用
		// 	// url = ajaxUrl.appUrls.createProductDetailUrl;
		// 	url = ajaxUrl.appUrls.updateProductFee;
		// 	call = 'Product.updateFee'
		// }else{
		// 	//保存修改
		// 	async = false;
		// 	if(app.step2Create){
		// 		//点击编辑进入创建应用明细
		// 		url = ajaxUrl.appUrls.createProductDetailUrl;
		// 		app.step2Create = false;//重置
		// 	}else{
		// 		//点击编辑修改应用明细
		// 		url = ajaxUrl.appUrls.updateProductDetailUrl;
		// 	}
		// }
		// LTadmin.doAjaxRequest(url,parameter,function(data){
		// 	var obj = JSON.parse(data);
		// 	console.log(obj);
		// 	if(obj.status==1){
		// 		app.toggleModal(obj.statusMsg);
		// 		$('.tableWrapper').show();
		// 		$('.editWrapper').hide();
		// 		app.refreshTable();//刷新表格数据
		// 		return;
		// 	}else{
		// 		app.toggleModal(obj.statusMsg);
		// 		return;
		// 	}
		// },async);

		LTadmin.doAjaxRequestSign(url, call, parameter, function(data) {
			var obj = JSON.parse(data);
			app.toggleModal(obj.returnMsg);
			if (obj.returnCode === '000000') {

			} else {

			}
		}, async)
	},
	// 更新产品特性信息
	updateCharacter: function(){
		// 产品最佳特性标签组合
		var characterLabelListStr = ''
		var characterLabelList = $('#select_character_label_result').children()
		if (characterLabelList.length > 0) {
			characterLabelList.each(function(index, value) {
				if (index < characterLabelList.length -1) {
					characterLabelListStr += $(value).attr('value') + ';';
				} else {
					characterLabelListStr += $(value).attr('value');
				}
			})
		}

		// 产品适用人群
		var suitRoleListStr = ''
		var suitRoleList = $('#select_suit_role_result').children()
		if (suitRoleList.length > 0) {
			suitRoleList.each(function(index, value) {
				if (index < suitRoleList.length -1) {
					suitRoleListStr += $(value).attr('value') + ';';
				} else {
					suitRoleListStr += $(value).attr('value');
				}
			})
		}

		// 推荐星数
		var recomStar = 0;
		$('#recommendStar').children().each(function(index, value) {
			var val = parseInt($(value).attr('value'))
			if (val === 0 || val === 1) {
				recomStar += 0;
			} else if (val === 2) {
				recomStar += 0.5;
			} else if (val === 3) {
				recomStar += 1;
			}
		})

		// $('#applyProcess').children('span').each(function(index,item){
		// 	parameter.applyProcess += $(this).attr('value');
		// 	if(index<$('#applyProcess').children('span').length-1){
		// 		parameter.applyProcess += ';';
		// 	}
		// });
		// $('#applyKeywords').children('span').each(function(index,item){
		// 	parameter.applyKeywords += $(this).text();
		// 	if(index<$('#applyKeywords').children('span').length-1){
		// 		parameter.applyKeywords += ';';
		// 	}
		// });
		// $('#applyRequire').children('span').each(function(index,item){
		// 	parameter.applyRequire += $(this).text();
		// 	if(index<$('#applyRequire').children('span').length-1){
		// 		parameter.applyRequire += ';';
		// 	}
		// });
		var url = ajaxUrl.appUrls.updateCharacterUrl;
		var call = 'Product.updateCharacter';
		var async = true;
		var userInfo = JSON.parse(sessionStorage.userInfo)
		// if($('.editWrapper').data('type')=='0' ){
		// 	//添加应用
		// 	url = ajaxUrl.appUrls.createProductDetailUrl;
		// }else{
		// 	//保存修改
		// 	async = false;
		// 	if(app.step2Create){
		// 		//点击编辑进入创建应用明细
		// 		url = ajaxUrl.appUrls.createProductDetailUrl;
		// 		app.step2Create = false;//重置
		// 	}else{
		// 		//点击编辑修改应用明细
		// 		url = ajaxUrl.appUrls.updateProductDetailUrl;
		// 	}
		// }

		// LTadmin.doAjaxRequest(url,parameter,function(data){
		// 	var obj = JSON.parse(data);
		// 	console.log(obj);
		// 	if(obj.status==1){
		// 		app.toggleModal(obj.statusMsg);
		// 		$('.tableWrapper').show();
		// 		$('.editWrapper').hide();
		// 		app.refreshTable();//刷新表格数据
		// 		return;
		// 	}else{
		// 		app.toggleModal(obj.statusMsg);
		// 		return;
		// 	}
		// },async);

		var parameter = {
			"productId"          : sessionStorage.productId, //产品ID
			"characterLabelList" : characterLabelListStr, // 产品最佳特性标签组合
			"featuresLabel"      : $('#featureState>.active').attr('value') === undefined ? '' : $('#featureState>.active').attr('value'), // 产品特性状态
			"recomStar"          : '' + recomStar, // 推荐星数
			"suitRoleList"       : suitRoleListStr, // 产品适用人群
			"account"            : userInfo.account,
			"token"              : userInfo.token
		};

		// console.log(parameter);
		LTadmin.doAjaxRequestSign(url, call, parameter, function(data) {
			var obj = JSON.parse(data);
			console.log(obj);
			app.toggleModal(obj.returnMsg);
			if (obj.returnCode === '000000') {
			} else {
			}
		})
	},
	// 更新产品申请信息
	updateApply() {
		// if($('#applyProcess').children('span').length==0){
		// 	app.toggleModal('“产品申请流程”是必填项，请完成！');
		// 	return;
		// }
		// if($('#applyKeywords').children('span').length==0){
		// 	app.toggleModal('“产品申请条件”是必填项，请完成！');
		// 	return;
		// }
		// if($('#applyRequire').children('span').length==0){
		// 	app.toggleModal('“产品申请材料”是必填项，请完成！');
		// 	return;
		// }

		var applyProcessList   = ''; //申请流程
		var applyConditioList  = ''; //申请条件
		var applyMaterialsList = ''; //申请材料
		$('#applyProcess').children('span').each(function(index,item){
			applyProcessList += $(this).attr('value');
			if(index<$('#applyProcess').children('span').length-1){
				applyProcessList += ';';
			}
		});
		$('#select_apply_condition_result').children('span').each(function(index,item){
			applyConditioList += $(this).text();
			if(index<$('#select_apply_condition_result').children('span').length-1){
				applyConditioList += ';';
			}
		});
		$('#select_apply_material_result').children('span').each(function(index,item){
			applyMaterialsList += $(this).text();
			if(index<$('#select_apply_material_result').children('span').length-1){
				applyMaterialsList += ';';
			}
		});

		var url = ajaxUrl.appUrls.updateApplyUrl;
		var call = 'Product.updateApply';
		var async = true;
		var userInfo = JSON.parse(sessionStorage.userInfo);
		// if($('.editWrapper').data('type')=='0' ){
		// 	//添加应用
		// 	url = ajaxUrl.appUrls.createProductDetailUrl;
		// }else{
		// 	//保存修改
		// 	async = false;
		// 	if(app.step2Create){
		// 		//点击编辑进入创建应用明细
		// 		url = ajaxUrl.appUrls.createProductDetailUrl;
		// 		app.step2Create = false;//重置
		// 	}else{
		// 		//点击编辑修改应用明细
		// 		url = ajaxUrl.appUrls.updateProductDetailUrl;
		// 	}
		// }
		// LTadmin.doAjaxRequest(url,parameter,function(data){
		// 	var obj = JSON.parse(data);
		// 	console.log(obj);
		// 	if(obj.status==1){
		// 		app.toggleModal(obj.statusMsg);
		// 		$('.tableWrapper').show();
		// 		$('.editWrapper').hide();
		// 		app.refreshTable();//刷新表格数据
		// 		return;
		// 	}else{
		// 		app.toggleModal(obj.statusMsg);
		// 		return;
		// 	}
		// },async);

		var parameter = {
			"productId"          : sessionStorage.productId,//产品唯一Id
			"applyProcessList"   : applyProcessList,
			"applyConditioList"  : applyConditioList,
			"applyMaterialsList" : applyMaterialsList,
			"account"            : userInfo.account,
			"token"              : userInfo.token
		};
		// console.log(parameter);
		LTadmin.doAjaxRequestSign(url, call, parameter, function(data) {
			var obj = JSON.parse(data);
			console.log(obj);
			app.toggleModal(obj.returnMsg);
			if (obj.returnCode === '000000') {
			} else {}
		})
	},

	// save : function(){
	// 	$('.btn-save').on('click',function(){
	// 		var currentStep = $('.progressView>.current-step').data('target');
	// 		if(currentStep=='step1'){
	// 			app.saveStep1();
	// 		}else if(currentStep=='step2'){
	// 			app.saveStep2();
	// 		}else if(currentStep=='step3'){
	// 			app.saveStep3();
	// 		}
	// 	});
	// },

	// saveStep1 : function(){
	// 	var parameter = {
	// 		"productName"        : $('#productName').val(),//产品名称
	// 		"productPackageName" : $('#productPackageName').val(),//产品包名
	// 		"productSubTitle"    : $('#productSubTitle').val(),//产品二级标题
	// 		"partnerId"          : $('#partnerId>option:selected').attr('value'),//合作方id
	// 		"creLineRangeEx"     : $('#creLineRangeEx').val(),//产品额度区间
	// 		"interestRateEx"     : $('#interestRateEx').val(),//产品利率说明
	// 		"productIconPath"    : $('#productIconPath').val(),//icon存储路径
	// 		"productApkPath"     : '',//apk存储路径
	// 		"featureLabel"       : $('#featureLabel').val(),//产品标签
	// 		"featureKeywords"    : '',//产品特性关键字
	// 		"suitableRole"       : '全适用',//使用人群
	// 		"recommendStar"      : '',//星级
	// 		"featureState"       : $('#featureState>.active').attr('value')==undefined?'':$('#featureState>.active').attr('value'),//产品特性状态
	// 		"scoreRank"          : parseInt($('#scoreRank').val()==''?-1:$('#scoreRank').val()),//产品上线排名得分
	// 		"requireScore"       : parseInt($('#requireScore').val()==''?0:$('#requireScore').val()),//申请条件评分
	// 		"interestRateScore"  : parseInt($('#interestRateScore').val()==''?0:$('#interestRateScore').val()),//利率得分
	// 		"throughRate"        : parseFloat($('#throughRate').val()==''?0:$('#throughRate').val()),//通过率
	// 		"visitNum"           : parseInt($('#visitNum').val()==''?-1:$('#visitNum').val()),//初始查看人数
	// 		"loanNum"            : parseInt($('#loanNum').val()==''?-1:$('#loanNum').val()),//初始放款人数
	// 	};
	// 	console.log(parameter);

	// 	if(parameter.productName==''){
	// 		app.toggleModal('“产品名称”是必填项，请完成！');
	// 		return;
	// 	}
	// 	if(parameter.productPackageName==''){
	// 		app.toggleModal('“产品包名”是必填项，请完成！');
	// 		return;
	// 	}
	// 	if(parameter.productSubTitle==''){
	// 		app.toggleModal('“产品二级标题”是必填项，请完成！');
	// 		return;
	// 	}
	// 	if(parameter.creLineRangeEx==''){
	// 		app.toggleModal('“产品额度区间”是必填项，请完成！');
	// 		return;
	// 	}
	// 	if(parameter.interestRateEx==''){
	// 		app.toggleModal('“产品利率说明”是必填项，请完成！');
	// 		return;
	// 	}
	// 	if($('.editWrapper').data('type')=='0'){
	// 		if(parameter.productIconPath==''){
	// 			app.toggleModal('您尚未上传图标，请完成！');
	// 			return;
	// 		}
	// 	}else{
	// 		parameter.productIconPath = '';
	// 	}
	// 	if(parameter.featureLabel==''){
	// 		app.toggleModal('“产品标签”是必填项，请完成！');
	// 		return;
	// 	}
	// 	if($('#featureKeywords').children('span').length==0){
	// 		app.toggleModal('“产品关键字”是必填项，请完成！');
	// 		return;
	// 	}
	// 	if($('#recommendStar>i[value=0]').length==5){
	// 		app.toggleModal('“产品推荐星数”是必选项，请完成！');
	// 		return;
	// 	}
	// 	/*if(parameter.featureState==''){
	// 		app.toggleModal('“产品特性状态”是必选项，请完成！');
	// 		return;
	// 	}*/
	// 	if(parameter.scoreRank==-1){
	// 		app.toggleModal('“产品综合评分”是必填项，请完成！');
	// 		return;
	// 	}
	// 	if(parameter.visitNum==-1){
	// 		app.toggleModal('“初始查看人数”是必填项，请完成！');
	// 		return;
	// 	}
	// 	if(parameter.loanNum==-1){
	// 		app.toggleModal('“初始申请人数”是必填项，请完成！');
	// 		return;
	// 	}

	// 	$('#featureKeywords').children('span').each(function(index,item){
	// 		parameter.featureKeywords += $(this).text();
	// 		if(index<$('#featureKeywords').children('span').length-1){
	// 			parameter.featureKeywords += ';';
	// 		}
	// 	});

	// 	parameter.recommendStar = $('#recommendStar>i[value=3]').length;
	// 	parameter.recommendStar += ';'+$('#recommendStar>i[value=2]').length;
	// 	parameter.recommendStar += ';'+$('#recommendStar>i[value=1]').length;
	// 	console.log(parameter);
	// 	var url = '';
	// 	if($('.editWrapper').data('type')=='0'){
	// 		url = ajaxUrl.appUrls.createProductUrl;
	// 	}else{
	// 		parameter.productId = parameter.productPackageName;
	// 		url = ajaxUrl.appUrls.updateProductUrl;
	// 	}
	// 	LTadmin.doAjaxRequest(url,parameter,function(data){
	// 		var obj = JSON.parse(data);
	// 		console.log(obj);
	// 		if(obj.status==1){
	// 			app.toggleModal(obj.statusMsg);
	// 			if($('.editWrapper').data('type')=='0'){
	// 				$('#productId').val(obj.productId)
	// 			}
	// 			app.refreshTable();//刷新表格数据
	// 			return;
	// 		}else{
	// 			app.toggleModal(obj.statusMsg);
	// 			return;
	// 		}
	// 	});
	// },

	// saveStep2 : function(){
	// 	var parameter = {
	// 		"productId"          : $('#productId').val(),//产品ID
	// 		"interestRateType"   : parseInt($('#interestRateType>.active').attr('value')==undefined?-1:$('#interestRateType>.active').attr('value')),
	// 		"interestRate"       : parseFloat($('#interestRate').val()==''?-1:$('#interestRate').val()),//产品利率
	// 		"instalType"         : parseInt($('#instalType>.active').attr('value')==undefined?-1:$('#instalType>.active').attr('value')),//产品分期类型
	// 		"instalCycles"       : parseInt($('#instalCycles').val()==''?-1:$('#instalCycles').val()),//产品分期间隔
	// 		"instalPeriod"       : parseInt($('#instalPeriod').val()==''?-1:$('#instalPeriod').val()),//产品分期期数
	// 		"creLineType"        : parseInt($('input[name=creLineType]:checked').val()),//产品额度类型
	// 		"minCreLine"         : parseInt($('#minCreLine').val()==''?-1:$('#minCreLine').val()),//产品最小额度
	// 		"maxCreLine"         : parseInt($('#maxCreLine').val()==''?-1:$('#maxCreLine').val()),//产品最大额度
	// 		"applyProcess"       : '',//选择流程步骤
	// 		"applyKeywords"      : '',//产品申请条件
	// 		"applyRequire"       : '',//产品申请材料
	// 		"h5ApplyUrl"         : $('#h5ApplyUrl').val(),//H5注册链接
	// 		"applyStrategy"      : $('#applyStrategy').val(),//H5申请攻略
	// 		"averageAuditTime"   : parseInt($('#averageAuditTime').val()==''?-1:$('#averageAuditTime').val()),//平均审核时长
	// 		"averageAdvanceTime" : parseInt($('#averageAdvanceTime').val()==''?-1:$('#averageAdvanceTime').val()),//平均放款时长
	// 		"productDescription" : $('#productDescription').val()//产品描述
	// 	};
	// 	console.log(parameter.creLineType);
	// 	if(parameter.interestRateType==-1){
	// 		app.toggleModal('“产品利率类型”是必填项，请完成！');
	// 		return;
	// 	}
	// 	if(parameter.interestRate==-1){
	// 		app.toggleModal('“产品利率”是必填项，请完成！');
	// 		return;
	// 	}
	// 	if(parameter.instalType==-1){
	// 		app.toggleModal('“产品分期类型”是必填项，请完成！');
	// 		return;
	// 	}
	// 	if(parameter.instalCycles==-1){
	// 		app.toggleModal('“产品分期间隔”是必填项，请完成！');
	// 		return;
	// 	}
	// 	if(parameter.instalPeriod==-1){
	// 		app.toggleModal('“产品分期期数”是必填项，请完成！');
	// 		return;
	// 	}
	// 	if(parameter.creLineType==-1){
	// 		app.toggleModal('“产品额度类型”是必填项，请完成！');
	// 		return;
	// 	}
	// 	if(parameter.minCreLine==-1){
	// 		app.toggleModal('“产品最小额度”是必填项，请完成！');
	// 		return;
	// 	}
	// 	if(parameter.maxCreLine==-1){
	// 		app.toggleModal('“产品最大额度”是必填项，请完成！');
	// 		return;
	// 	}
	// 	if($('#applyProcess').children('span').length==0){
	// 		app.toggleModal('“产品申请流程”是必填项，请完成！');
	// 		return;
	// 	}
	// 	if($('#applyKeywords').children('span').length==0){
	// 		app.toggleModal('“产品申请条件”是必填项，请完成！');
	// 		return;
	// 	}
	// 	if($('#applyRequire').children('span').length==0){
	// 		app.toggleModal('“产品申请材料”是必填项，请完成！');
	// 		return;
	// 	}
	// 	if(parameter.h5ApplyUrl==''){
	// 		app.toggleModal('“H5注册链接”是必填项，请完成！');
	// 		return;
	// 	}
	// 	/*if(parameter.applyStrategy==''){
	// 		app.toggleModal('“H5申请攻略”是必填项，请完成！');
	// 		return;
	// 	}*/
	// 	if(parameter.productDescription==''){
	// 		app.toggleModal('“产品描述”是必填项，请完成！');
	// 		return;
	// 	}

	// 	$('#applyProcess').children('span').each(function(index,item){
	// 		parameter.applyProcess += $(this).attr('value');
	// 		if(index<$('#applyProcess').children('span').length-1){
	// 			parameter.applyProcess += ';';
	// 		}
	// 	});
	// 	$('#applyKeywords').children('span').each(function(index,item){
	// 		parameter.applyKeywords += $(this).text();
	// 		if(index<$('#applyKeywords').children('span').length-1){
	// 			parameter.applyKeywords += ';';
	// 		}
	// 	});
	// 	$('#applyRequire').children('span').each(function(index,item){
	// 		parameter.applyRequire += $(this).text();
	// 		if(index<$('#applyRequire').children('span').length-1){
	// 			parameter.applyRequire += ';';
	// 		}
	// 	});
	// 	console.log(parameter);
	// 	var url = '';
	// 	var async = true;
	// 	if($('.editWrapper').data('type')=='0' ){
	// 		//添加应用
	// 		url = ajaxUrl.appUrls.createProductDetailUrl;
	// 	}else{
	// 		//保存修改
	// 		async = false;
	// 		if(app.step2Create){
	// 			//点击编辑进入创建应用明细
	// 			url = ajaxUrl.appUrls.createProductDetailUrl;
	// 			app.step2Create = false;//重置
	// 		}else{
	// 			//点击编辑修改应用明细
	// 			url = ajaxUrl.appUrls.updateProductDetailUrl;
	// 		}
	// 	}
	// 	LTadmin.doAjaxRequest(url,parameter,function(data){
	// 		var obj = JSON.parse(data);
	// 		console.log(obj);
	// 		if(obj.status==1){
	// 			app.toggleModal(obj.statusMsg);
	// 			$('.tableWrapper').show();
	// 			$('.editWrapper').hide();
	// 			app.refreshTable();//刷新表格数据
	// 			return;
	// 		}else{
	// 			app.toggleModal(obj.statusMsg);
	// 			return;
	// 		}
	// 	},async);
	// },
	initStep2Event : function(){
		$('#interestRateType,#instalType').on('click','button',function(){
			$(this).addClass('active').siblings('button').removeClass('active');
		});
	},
	saveStep3 : function(){},
	// 切换应用上线状态
	toggleAppStatus : function(productId,status,index){
		var parameter = {
			"productId" : productId,
			"status"    : parseInt(status)==0?1:0
		};
		LTadmin.doAjaxRequest(ajaxUrl.appUrls.setProductStatusUrl,parameter,function(data){
			var obj = JSON.parse(data);
			console.log(obj);
			if(obj.status==1){
				app.toggleModal(obj.statusMsg);
				$('#table').bootstrapTable('updateCell', {
					"index" : index,
					"field" : 'status',
					"value" : parameter.status
				});
				return;
			}else{
				app.toggleModal(obj.statusMsg);
				return;
			}
		});
	},
	// 修改应用
	editTheApp : function(productId){
		// 获取产品相关信息
		var call = 'Product.find'
		var userInfo = JSON.parse(sessionStorage.userInfo)
		var param = {
			account: userInfo.account,
			token: userInfo.token,
			productId: productId
		}
		LTadmin.doAjaxRequestSign(ajaxUrl.appUrls.getAProductInfoUrl, call, param, function(data) {
			var obj = JSON.parse(data)
			// console.log(obj);
			if (obj.returnCode === '000000') {
				$('.tableWrapper').hide();
				$('.editWrapper').show();
				app.reset();//重置表单
				app.setTheAppInfo(obj.response);
			} else {
				app.toggleModal(obj.returnMsg);
			}
		})
	},
	reset : function(){
		// 基本信息
		$('#productName').val('');
		$('#productPackageName').val('');
		$('#productSubTitle').val('');
		$('#partnerId').val('请选择产品提供方');
		$("#productType").val('请选择产品类型');
		$('#h5ApplyUrl').val('');
		// 图标与安装包
		$('#smallImg').attr('src','');
		$('#productIconPath').val('');
		// 利率分期额度
		$('#minCreLine').val('');
		$('#maxCreLine').val('');
		$('#interestRateType').children('button').removeClass('active');
		$('#interestRate').val('');
		$('#instalType').children('button').removeClass('active');
		// $('#instalCycles').val('');
		$('#instalPeriodList').val('');
		$('input[name=instalReturnType]').attr('checked', false);

		// $('#creLineRangeEx').val('');
		// $('#interestRateEx').val('');
		
		// $('#featureKeywords').empty();
		// $('#featureLabel').val('');
		// 产品特性
		$('#select_character_label .input').children('button').removeClass('selected');
		$('#select_character_label_result').empty();

		$('#suitableRole .input').children('button').removeClass('selected');
		$('#select_suit_role_result').empty();

		$('#recommendStar').children('i').each(function(index, value) {
			// 推荐星数至少一颗星
			if (index === 0) {
				$(this).attr('class','fa fa-star active').attr('value', 3);
			} else {
				$(this).attr('class','fa fa-star-o').attr('value', 0);
			}
		})

		$('#featureState').children('button').removeClass('active');

		// 申请信息
		$('#select_apply_process .input').children('span').removeClass('selected');
		$('#applyProcess').empty();

		$('#applyKeywords .input').children('button').removeClass('selected');
		$('#select_apply_condition_result').empty();

		$('#applyRequire .input').children('button').removeClass('selected');
		$('#select_apply_material_result').empty();

		// $('#scoreRank').val('');
		// $('#requireScore').val('');
		// $('#interestRateScore').val('');
		// $('#throughRate').val('');
		// $('#visitNum').val('');
		// $('#loanNum').val('');
		
		// $('#selectResult').empty();
		// $('#applyKeywords').empty();
		// $('#applyRequire').empty();
		// $('#applyStrategy').val('');
		// $('#averageAuditTime').val('');
		// $('#averageAdvanceTime').val('');
		// $('#productDescription').val('');
	},
	setTheAppInfo : function(obj){
		var productInfo = obj.product;
		var detailInfo = obj.list;
		sessionStorage.productId = productInfo.productId;//产品唯一Id
		console.log(obj);

		// 基本信息
		$('#productId').val(productInfo.productId);
		$('#productName').val(productInfo.productName);
		$('#productPackageName').val(productInfo.productId);
		$('#productSubTitle').val(productInfo.productSubTitle);
		$("#partnerId").val(productInfo.partnerId);
		$("#productType").val(productInfo.productTypeId);
		$("#h5ApplyUrl").val(productInfo.h5ApplyUrl);
		// 图标与安装包
		console.log(ajaxUrlFlag.getDomain())
		$("#smallImg").attr('src', ajaxUrlFlag.getDomain() + productInfo.productIconLink);
		// 利率分期额度
		$("#minCreLine").val(productInfo.minCreline);
		$("#maxCreLine").val(productInfo.maxCreline);
		var _interestRateType = '#interestRateType>button[value='+productInfo.interestrateType+']';
		$(_interestRateType).addClass('active');
		$("#interestRate").val(productInfo.interestrate);
		var _instalType = '#instalType>button[value='+productInfo.instalType+']';
		$(_instalType).addClass('active');
		$("#instalPeriodList").val(productInfo.instalPeriodList);
		$('input[name=instalReturnType]').eq(productInfo.instalReturnType).attr('checked', true);

		function strToArr(str) {
			var arr = [];
			if (str.indexOf(';') !== -1) {
				arr = str.split(';');
			} else {
				arr[0] = str;
			}
			return arr;
		}
		// 特性标签
		var character_label_list = [];
		// 适用人群
		var suit_role_list = [];
		// 推荐星数
		var recom_star = [];
		// 特性状态
		var features_label = [];
		// 申请流程
		var apply_process_list = [];
		// 申请条件
		var apply_condition_list = [];
		// 申请材料
		var apply_materials_list = [];
		if (detailInfo.length > 0) {
			detailInfo.forEach(function(item) {
				switch(item[0]) {
					case 'character_label_list':
						character_label_list = strToArr(item[1]);
						break;
					case 'suit_role_list':
						suit_role_list = strToArr(item[1]);
						break;
					case 'recom_star':
						recom_star = strToArr(item[1]);
						break;
					case 'features_label':
						features_label = strToArr(item[1]);
						break;
					case 'apply_process_list':
						apply_process_list = strToArr(item[1]);
						break;
					case 'apply_condition_list':
						apply_condition_list = strToArr(item[1]);
						break;
					case 'apply_materials_list':
						apply_materials_list = strToArr(item[1]);
						break;
				}
			})
		}

		// 从接口获取到数据后初始化 产品特性和申请信息
		function setLable(parentNode, selectResultNode, arr) {
			var str = '';
			arr.forEach(function(value) {
				str += '<span value="'+ value +'"><div>'+ value +'</div><i class="fa fa-minus-circle" aria-hidden="true"></i></span>';

				$(parentNode + ' .input').children().each(function(index, val) {
					if (value === $(val).attr('value')) {
						$(this).addClass('selected');
					}
				})
			})
			$(selectResultNode).append(str);
		}
		// 从接口获取到数据后初始化 产品申请流程
		function setApplyProcess(parentNode, selectResultNode, arr) {
			var str = '';
			arr.forEach(function(value) {
				str += '<span value="'+value+'"><img src="source/image/app/process/'+value+'.png" alt="流程"><i class="fa fa-minus-circle" aria-hidden="true"></i></span>';

				$(parentNode + ' .input').children().each(function(index, val) {
					if (value === $(val).attr('value')) {
						$(this).addClass('selected');
					}
				})
			})
			$(selectResultNode).append(str);
		}

		// 特性标签
		setLable('#select_character_label', '#select_character_label_result', character_label_list);
		// 适用人群
		setLable('#suitableRole', '#select_suit_role_result', suit_role_list);
		// 申请条件
		setLable('#applyKeywords', '#select_apply_condition_result', apply_condition_list);
		// 申请材料
		setLable('#applyRequire', '#select_apply_material_result', apply_materials_list);
		// 申请流程
		setApplyProcess('#select_apply_process', '#applyProcess', apply_process_list);
		// 推荐星数
		var recommendStar = parseFloat(recom_star[0]);
		var strNumInt = Math.floor(recommendStar);
		var strNumFlo = recommendStar - strNumInt;
		var starList = $('#recommendStar').children('i');
		if (recommendStar > 0) {
			for (var i = 0; i < starList.length; i++) {
				if (i < strNumInt) {
					starList.eq(i).attr('value', 3).attr('class','fa fa-star active');
				}
			}
			if (strNumFlo === 0.5) {
				starList.eq(strNumInt).attr('value', 2).attr('class','fa fa-star-half-o active');
			}
		}
		// 特性状态
		var _featureState = '#featureState>button[value='+features_label[0]+']';
		$(_featureState).addClass('active');
	},
	// 初始化产品特性和申请信息
	initProductFeatureAndApplyInfo : function (data) {
		// 产品特性关键字
		// ------------已废
		$('.keyContent').on('click','i',function () {
			$(this).parent().remove();
		});
		$('.productKeywordAdd').on('click',function(){
			$(this).hide().siblings('input').show().focus();
		});
		$('.keywordInput').on('blur',function(){
			$(this).val('');
			$(this).hide().siblings('span').show();
		});
		$('.keywordInput').on('keyup',function(event){
			if(event.keyCode == 13 ){
				var value = $(this).val().trim();
				$(this).val('');
	            $(this).hide().siblings('span').show();
	            if (value!='') {
					var _html = '<span>'+value+'<i class="fa fa-minus-circle"></i></span>';
					$(this).prev('.keyContent').append(_html);
				}
	        }
		});
		// ------------已废

		console.log(data)
		var character_label = [];  // 产品最佳特性标签
		var suit_role = [];        // 产品适用人群
		var apply_process = [];    // 申请流程
		var apply_condition = [];  // 申请条件
		var apply_materials = [];  // 申请材料
		data.forEach(function(item) {
			switch(item.property) {
				case "character_label":
					character_label = item.propertyValueList;
					break;
				case "suit_role":
					suit_role = item.propertyValueList;
					break;
				case 'apply_process':
					apply_process = item.propertyValueList;
					break;
				case 'apply_condition':
					apply_condition = item.propertyValueList;
					break;
				case 'apply_materials':
					apply_materials = item.propertyValueList;
					break;
			}
		})

		// 选择标签组合
		function selectLabelGroup(parentNode, selectResultNode) {
			// 增
			$(parentNode).on('click','button',function(){
				var classname = $(this).attr('class') === undefined ? '' : $(this).attr('class');
				if(classname.indexOf('selected') === -1){
					$(this).addClass('selected');
					var value = $(this).attr('value');
					var _html = '<span value="'+ value +'"><div>'+ value +'</div><i class="fa fa-minus-circle" aria-hidden="true"></i></span>';
					$(selectResultNode).append(_html);
				}
			});
			// 删
			$(selectResultNode).on('click','i',function(){
				var value = $(this).parent().attr('value');
				$(this).parent().remove();
				var _el = parentNode + '>.input>button[value="'+value+'"]';
				$(_el).removeClass('selected');
			});
		}

		// 1.初始化产品特性
		// 1.1初始化产品最佳特性标签
		var str_character_label = '';
		character_label.forEach(function(item) {
			str_character_label += '<button value="'+ item +'">' + item + '</button> ';
		})
		$('#select_character_label .input').append(str_character_label);
		selectLabelGroup('#select_character_label', '#select_character_label_result');
		// $('#select_character_label').on('click','button',function(){
		// 	var classname = $(this).attr('class') === undefined ? '' : $(this).attr('class');
		// 	if(classname.indexOf('selected') === -1){
		// 		$(this).addClass('selected');
		// 		var value = $(this).attr('value');
		// 		var _html = '<span value="'+ value +'"><div>'+ value +'</div><i class="fa fa-minus-circle" aria-hidden="true"></i></span>';
		// 		$('#select_character_label_result').append(_html);
		// 	}
		// });
		// $('#select_character_label_result').on('click','i',function(){
		// 	var value = $(this).parent().attr('value');
		// 	$(this).parent().remove();
		// 	var _el = '#select_character_label>.input>button[value='+value+']';
		// 	$(_el).removeClass('selected');
		// });

		// 1.2初始化适用人群
		var str_suit_role = '';
		suit_role.forEach(function(item) {
			str_suit_role += '<button value="'+ item +'">' + item + '</button> ';
		})
		$('#suitableRole .input').append(str_suit_role);
		selectLabelGroup('#suitableRole', '#select_suit_role_result');
		// $('#suitableRole').on('click','button',function(){
		// 	// $(this).addClass('active').siblings('button').removeClass('active');
		// 	var classname = $(this).attr('class') === undefined ? '' : $(this).attr('class');
		// 	if(classname.indexOf('selected') === -1){
		// 		$(this).addClass('selected');
		// 		var value = $(this).attr('value');
		// 		var _html = '<span value="'+ value +'"><div>'+ value +'</div><i class="fa fa-minus-circle" aria-hidden="true"></i></span>';
		// 		$('#select_suit_role_result').append(_html);
		// 	}
		// });
		// $('#select_suit_role_result').on('click','i',function(){
		// 	var value = $(this).parent().attr('value');
		// 	$(this).parent().remove();
		// 	var _el = '#suitableRole>.input>button[value='+value+']';
		// 	$(_el).removeClass('selected');
		// });

		// 1.3初始化推荐星数
		$('#recommendStar').on('click','i',function(){
			var index = $(this).index();
			if (index === 0) return; // 推荐星数至少一颗星
			var prevValue = parseInt($(this).prev().attr('value'));
			var value = parseInt($(this).attr('value'));
			if(value==0){
				if(index>0){
					$(this).prevAll('i').attr('class','fa fa-star active').attr('value',3);
					if(prevValue==2){
						$(this).prev().attr('class','fa fa-star-half-o active').attr('value',2);
					}
				}
				value += 1;
				$(this).attr('class','fa fa-star-o active');
			}else if(value==1){
				if(index>0){
					$(this).prevAll('i').attr('class','fa fa-star active').attr('value',3);
				}
				value += 1;
				$(this).attr('class','fa fa-star-half-o active');
			}else if(value==2){
				value += 1;
				$(this).attr('class','fa fa-star active');
			}else{
				value = 0;
				$(this).nextAll('i').attr('class','fa fa-star-o').attr('value','0');
				$(this).removeClass('fa-star').addClass('fa-star-o');
				$(this).removeClass('active');
			}
			$(this).attr('value',value);
		});
		// 1.4初始化产品特性状态
		$('#featureState').on('click','button',function(){
			var classname = $(this).attr('class');
			if(classname!=undefined && classname != '' && classname.indexOf('active')>-1){
				$(this).removeClass('active');
			}else{
				$(this).addClass('active').siblings().removeClass('active');
			}
		});

		// 2.初始化申请信息
		$('#productRateType,#productStageType').on('click','button',function(){
			$(this).addClass('active').siblings('button').removeClass('active');
		});
		// $('.selectInput').on('click',function(){
		// 	$('.selectOptions').slideDown();
		// });
		// $('.selectOptions').hover(function(){
		// },function(){
		// 	$(this).slideUp();
		// });
		// $('.selectOptions').on('click','li',function(){
		// 	var classname = $(this).attr('class')==undefined?'':$(this).attr('class');
		// 	if(classname.indexOf('disabled')==-1){
		// 		var value = $(this).attr('value');
		// 		var _html = '<span value="'+value+'"><img src="source/image/app/process/'+value+'.png" alt="流程">'+
		// 					'<i class="fa fa-minus-circle" aria-hidden="true"></i></span>';
		// 		$(this).addClass('disabled');
		// 		$('.selectResult').append(_html);
		// 	}
		// 	return;
		// });

		// 2.1初始化产品申请流程
		var apply_process_dom = ''
		apply_process.forEach(function(item) {
			apply_process_dom += '<span class="apply_process_item" value="'+ item +'"><img src="source/image/app/process/'+ item +'.png" alt=""></span>'
		})
		$('#select_apply_process .input').append(apply_process_dom);
		$('#select_apply_process').on('click','span.apply_process_item',function(){
			var classname = $(this).attr('class')==undefined?'':$(this).attr('class');
			if(classname.indexOf('selected') === -1){
				var value = $(this).attr('value');
				var _html = '<span value="'+value+'"><img src="source/image/app/process/'+value+'.png" alt="流程"><i class="fa fa-minus-circle" aria-hidden="true"></i></span>';
				$(this).addClass('selected');
				$('#applyProcess').append(_html);
			}
			return;
		});
		$('#applyProcess').on('click','i',function(){
			var value = $(this).parent().attr('value');
			$(this).parent().remove();
			var _el = '#select_apply_process>.input>span[value='+value+']';
			$(_el).removeClass('selected');
		});

		// 2.2初始化产品申请条件
		var str_apply_condition = '';
		apply_condition.forEach(function(item) {
			str_apply_condition += '<button value="'+ item +'">' + item + '</button> ';
		})
		$('#applyKeywords .input').append(str_apply_condition);
		selectLabelGroup('#applyKeywords', '#select_apply_condition_result');

		// 2.3初始化产品申请材料
		var str_apply_materials = '';
		apply_materials.forEach(function(item) {
			str_apply_materials += '<button value="'+ item +'">' + item + '</button> ';
		})
		$('#applyRequire .input').append(str_apply_materials);
		selectLabelGroup('#applyRequire', '#select_apply_material_result');
	},
	initPartners : function () {
		var call = 'Partner.list'
		var userInfo = JSON.parse(sessionStorage.userInfo)
		var param = {
			account: userInfo.account,
			token: userInfo.token
		}

		LTadmin.doAjaxRequestSign(ajaxUrl.partnerUrls.listPartnerUrl, call, param, function(data){
			var obj = JSON.parse(data);
			if (obj.returnCode === '000000') {
				var partners = obj.response;
				var _html = '<option value="请选择产品提供方" checked>请选择产品提供方</option>';
				for(var i=0;i<partners.length;i++){
					_html += '<option value="'+partners[i].partnerId+'">'+partners[i].partnerCompany+'</option>';
				}
				$('#partnerId').append(_html);
				return;
			} else {
				alert(obj.returnMsg);
				return;
			}
		});
	},
	initFileUploadEvent : function () {
		//初始化页面拖拽
		//阻止浏览器默认行。
	    $(document).on({
	        dragleave:function(e){ e.preventDefault(); },   //拖离
	        drop:function(e){ e.preventDefault(); },        //拖后放
	        dragenter:function(e){ e.preventDefault(); },   //拖进
	        dragover:function(e){ e.preventDefault(); }     //拖来拖去
	    });
	    //拖拽图片上传
	    var drap_img = document.getElementById('drap_img'); //拖拽区域
	    drap_img.addEventListener("drop",function(e){
	    	e.preventDefault(); //取消默认浏览器拖拽效果
	    	var fileList = e.dataTransfer.files; //获取文件对象
	    	app.initFileUpload(fileList,1);
	    },false);
	    //选择图片上传
	    $('#imgFile').on('change',function(e){
	    	app.initFileUpload(this.files,1);
	    });
	    //拖拽apk上传
	    var drap_apk = document.getElementById('drap_apk'); //拖拽区域
	    drap_apk.addEventListener("drop",function(e){
	    	e.preventDefault(); //取消默认浏览器拖拽效果
	    	var fileList = e.dataTransfer.files; //获取文件对象
	    	app.initFileUpload(fileList,2);
	    },false);
	    //选择apk上传
	    $('#apkFile').on('change',function(e){
	    	app.initFileUpload(this.files,2);
	    });
	},
	initFileUpload : function(fileList,type){
		console.log(fileList);
		//检测是否是拖拽文件到页面的操作
        if(fileList[0].length == 0){
            return false;
        }
        $('.img_name').text('');
        $('.apk_name').text('');
        $('.img_progress').text('');
        $('.apk_progress').text('');

		var filename = fileList[0].name; //文件名称
	    var filesize = Math.floor((fileList[0].size)/1024/1024);
        if(filesize>10){
			app.toggleModal('上传文件的大小不能超过10M！');
            return false;
    	}
        if(type==1){
        	//拖拉图片到浏览器，可以实现预览功能
		    var img = window.URL.createObjectURL(fileList[0]);
		    //检测文件是不是图片
	        if(fileList[0].type.indexOf('image')===-1){
				app.toggleModal('您上传的不是图片！');
	            return false;
	        }
        	$('#smallImg').attr('src',img);
        	$('.img_name').text(filename);
        }else{
        	//检测文件是不是apk文件
	        if(fileList[0].name.indexOf('.apk')===-1){
				app.toggleModal('您上传的不是apk文件！');
	            return false;
	        }
	        $('.apk_name').text(filename);
        }
        //上传
        app.upload(fileList[0],type);
	},
	upload : function(file,type){
		var xhr = new XMLHttpRequest();
        xhr.upload.addEventListener("progress", function(e){
            if(e.lengthComputable) {
                var percentage = Math.round((e.loaded * 100) / e.total)+'%';
                console.log(percentage)
                console.log(type)
                if(type==1){
	        		$('.img_progress').text(percentage);
	        	}else{
	        		$('.apk_progress').text(percentage);
	        	}
            }
        }, false);

        xhr.upload.addEventListener("load", function(e){
        	if(type==1){
        		$('.img_progress').text('100%');
        	}else{
        		$('.apk_progress').text('100%');
        	}
        }, false);

        xhr.open("POST", ajaxUrl.uploadFileUrl, true);
        xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4 && xhr.status == 200) {
                var data = JSON.parse(xhr.responseText);
                console.log(data); // handle response.progress.style.display = "none";
				app.toggleModal(data.returnMsg);
				if (data.returnCode === '000000') {
					if (type == 1) {
						$('#productIconPath').val(data.response);
					} else if (type == 2) {
						$('#productApkPath').val(data.response);
					}
				}
            }
        };
		var fd = new FormData();
		var userInfo = JSON.parse(sessionStorage.userInfo);
		var ua = ajaxUrl.ua;
		var call = 'File.uploadIcon';
		var signKey = ajaxUrl.signKey;
		var timestamp = new Date().getTime();
		var sign = md5(ua + "&" + call + "&" + timestamp + "&" + signKey);
        if(type==1){
			fd.append("ua", ua);
			fd.append("call", call);
			fd.append("args", JSON.stringify({
				account: userInfo.account,
				token: userInfo.token,
				productId: sessionStorage.productId,
				fileType: 'icon'
			}));
			fd.append("sign", sign);
			fd.append("timestamp", timestamp);
			fd.append("icon", file);
    	}else{
    		fd.append("cachefile", file);
    		fd.append("userName", sessionStorage.ldkusername);
    	}
        xhr.send(fd);
	},
	refreshTable : function(){
    	LTadmin.doAjaxRequest(ajaxUrl.appUrls.listProductUrl,'',function(data){
			var obj = JSON.parse(data);
			console.log(obj);
			if(obj.status==1){
				var products = obj.products;
				$('#table').bootstrapTable('filterBy', { rows:this.allData});
				$('#table').bootstrapTable('load', products);
			}else{
				app.toggleModal(obj.statusMsg);
				return;
			}
		},false);
	},
	initTable : function(data){
		// var url = ajaxUrl.partnerUrls.listPartnerUrl
		// var call = 'Partner.list'
		// var userInfo = JSON.parse(sessionStorage.userInfo)
		// var ajaxOptions = {
		// 	account: userInfo.account,
		// 	token: userInfo.token
		// }
		// function ajax(result) {
		// 	LTadmin.doAjaxRequestSign(url, call, ajaxOptions, function(data){
		// 		var obj = JSON.parse(data);
		// 		if (obj.returnCode === '000000') {
		// 			var partners = obj.response;
		// 			result.success({
		// 				row: partners
		// 			});
		// 			$('#table').bootstrapTable('load', partners);  
		// 		} else {
		// 			partner.toggleModal(obj.returnMsg);
		// 			return;
		// 		}
		// 	})
		// }

		var url = ajaxUrl.appUrls.listProductUrl
		var call = 'Product.list'
		var userInfo = JSON.parse(sessionStorage.userInfo)
		var ajaxOptions = {
			account: userInfo.account,
			token: userInfo.token
		}
		function bootstrapTableAjax(result) {
			LTadmin.doAjaxRequestSign(url, call, ajaxOptions, function(data){
				var obj = JSON.parse(data);
				if (obj.returnCode === '000000') {
					var products = obj.response;
					result.success({
						row: products
					});
					$('#table').bootstrapTable('load', products);
				} else {
					alert(obj.returnMsg);
					return;
				}
			});
		}

		$('#table').bootstrapTable({
	        idField: "id",
			toolbar: "#toolbar",
			url: url,
			method: 'post',
			ajax: bootstrapTableAjax,
			ajaxOptions: ajaxOptions,
	        cache: false,
	        striped: true,
	        pagination: true,
	        pageSize: 10,
	        pageNumber:1,
			pageList: [10, 20, 50, 100, 200],
	        search: true,
	        sortable : true,
	        showColumns: true,
	        showRefresh: true,
	        showExport: true,
	        search: true,
	        // data : data,
	        // columns: [
	        //     {field:"id",           title:"id",      width:"100",align:"center",valign:"middle",visible:false},
	        //     {field:"productName",  title:"应用名称", width:"100",align:"left",  valign:"middle",formatter:"nameTransform"},
	        //     {field:"status",       title:"状态",     width:"100",align:"center",valign:"middle",formatter:"appStatusTransform",cellStyle:"statusStyle"},
	        //     {field:"startTime",    title:"创建时间", width:"200",align:"center",valign:"middle",sortable:true},
	        //     {field:"scoreRank",    title:"排名/评分",width:"100",align:"center",valign:"middle",sortable:true},
	        //     {field:"visitNum",     title:"日浏览数", width:"100",align:"center",valign:"middle",sortable:true},
	        //     {field:"loanNum",      title:"日申请数", width:"100",align:"center",valign:"middle",sortable:true},
	        //     {field:"recommendStar",title:"推荐星数", width:"100",align:"center",valign:"middle",sortable:true,formatter:"appStarTransform"},
	        //     {field:"featureState", title:"状态标签", width:"100",align:"center",valign:"middle",formatter:"labelTransform"},
	        //     {field:"action",       title:"操作",     width:"100",align:"center",valign:"middle",formatter:"editAction",events:"eidtTheAppEvents"}
			// ],
			columns: [
	            {field:"id",           title:"id",      width:"100",align:"center",valign:"middle",visible:false},
	            {field:"productName",  title:"应用名称", width:"100",align:"left",  valign:"middle",formatter:"nameTransform"},
	            {field:"productStatus",title:"状态",     width:"100",align:"center",valign:"middle",formatter:"appStatusTransform",cellStyle:"statusStyle"},
	            // {field:"startTime",    title:"创建时间", width:"200",align:"center",valign:"middle",sortable:true},
	            // {field:"scoreRank",    title:"排名/评分",width:"100",align:"center",valign:"middle",sortable:true},
	            // {field:"visitNum",     title:"日浏览数", width:"100",align:"center",valign:"middle",sortable:true},
	            // {field:"loanNum",      title:"日申请数", width:"100",align:"center",valign:"middle",sortable:true},
	            // {field:"recommendStar",title:"推荐星数", width:"100",align:"center",valign:"middle",sortable:true,formatter:"appStarTransform"},
	            {field:"featureState", title:"状态标签", width:"100",align:"center",valign:"middle",formatter:"labelTransform"},
	            {field:"action",       title:"操作",     width:"100",align:"center",valign:"middle",formatter:"editAction",events:"eidtTheAppEvents"}
	        ],
	        formatNoMatches: function(){return '无符合条件的记录';},
	        onSearch : function(){
				// 当搜索表格时触发
			},
	        // onRefresh : function(){ app.refreshTable();},
	        onRefresh : function(){},
	        onLoadSuccess : function(){
				// sortable(document.getElementById('table').getElementsByTagName('tbody')[0]);
			}
	    });
	   	$('#getOnLine').on('click',function(){
	   		$('#table').bootstrapTable('filterBy', {'productStatus':1});
		});
		$('#getOffLine').on('click',function(){
	   		$('#table').bootstrapTable('filterBy', {'productStatus':0});
		});
	}
};

/* 表格格式化函数：*/
function nameTransform(value,row,index){
	return '<img src="'+row.productIconLink+'" class="nameIcon" />'+value;
}
function statusStyle(value,row,index){
	if(row.status==0){
		return {classes: 'red'};
	}else{
		return {classes: 'green'};
	}
	return row.status;
}
function appStatusTransform(value,row,index){
    // return row.status == "0" ? "未上线" : "已上线";
    return row.productStatus == "0" ? "未上线" : "已上线";
}
function appStarTransform(value,row,index){
	var starStr = ['<span>'];
	var recommendStar = row.recommendStar.replace('；',';');
	var starArr = recommendStar.split(';');
	var fullStar = parseInt(starArr[0]);
	var halfStar = parseInt(starArr[1]);
	var emptyStar = parseInt(starArr[2]);
	for(var i=1;i<=fullStar;i++){
		starStr.push('<i class="fa fa-star red" aria-hidden="true"></i>');
	}
	for(var i=1;i<=halfStar;i++){
		starStr.push('<i class="fa fa-star-half-o red" aria-hidden="true"></i>');
	}
	for(var i=1;i<=emptyStar;i++){
		starStr.push('<i class="fa fa-star-o red" aria-hidden="true"></i>');
	}
	starStr.push('</span>');
    return starStr.join('');
}
function labelTransform(value,row,index){
	if(row.featureState=='hot'){
		var lable = ['<img src="source/image/app/hot.png" class="table-label" alt="hot" />'];
		return lable.join('');
	}else if(row.featureState=='fast'){
		var lable = ['<img src="source/image/app/fast.png" class="table-label" alt="fast" />'];
		return lable.join('');
	}else if(row.featureState=='low'){
		var lable = ['<img src="source/image/app/low.png" class="table-label" alt="low" />'];
		return lable.join('');
	}else{
		return '无';
	}
}
function editAction(value,row,index){
	return [
		'<p class="action">',
		'<a class="editTheApp" href="javascript::"><i class="fa fa-pencil"></i></a>',
		'<a class="toggleTheApp" href="javascript::"><i class="fa fa-wrench"></i></a>',
		'</p>'
	].join('');
}
/* 编辑某个应用 <span class="notice">修改应用信息</span>*/
window.eidtTheAppEvents = {
    'click .editTheApp' : function(e,value,row,index){
        console.log(row);
		var title = '<a href="javascript:;" class="showAppList">应用列表</a> > 编辑应用';
		$('.current span').html(title);
		$('.editWrapper').data('type','1');
        app.editTheApp(row.productId);
    },
    'click .toggleTheApp' : function(e,value,row,index){
    	app.toggleAppStatus(row.productId,row.status,index);
    }
};
/* 表格格式化函数：end */

// function sortable(el) {
// 	Sortable.create(el, {
// 		handle: '.sortHandle',
//         animation: 150,
//         onStart: function (/**Event*/evt) {
//             evt.oldIndex;  // element index within parent
//             // console.log(evt.oldIndex)
//         },
//         onEnd: function (/**Event*/evt) {
//             var itemEl = evt.item;  // dragged HTMLElement
//             evt.to;    // target list
//             evt.from;  // previous list
//             evt.oldIndex;  // element's old index within old parent
//             evt.newIndex;  // element's new index within new parent
// 			console.log(evt)
// 			console.log(evt.oldIndex, evt.newIndex)
// 		},
// 		onUpdate: function(evt) {
// 			console.log('onUpdate')
// 		},
// 		onSort: function(evt) {
// 			console.log('onSort')
// 		},
// 		onMove: function() {
// 			console.log('onMove')
// 		}
// 	});
// }
