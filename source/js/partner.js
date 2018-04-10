var partner = {
	partial : 'source/page/partner.html',
	page : '合作方列表',
	init : function (argument) {
		$('.current span').text(partner.page);
		$('.menuList>li[data-target=partner]').addClass('active').siblings('li').removeClass('active');

		// LTadmin.doAjaxRequest(ajaxUrl.partnerUrls.listPartnerUrl,'',function(data){
		// 	var obj = JSON.parse(data);
		// 	console.log(obj);
		// 	if(obj.status==1){
		// 		var partners = obj.partners;
		// 		partner.initTable(partners);
		// 	}else{
		// 		partner.toggleModal(obj.statusMsg);
		// 		return;
		// 	}
		// });

		// var call = 'Partner.list'
		// var userInfo = JSON.parse(sessionStorage.userInfo)
		// var param = {
		// 	account: userInfo.account,
		// 	token: userInfo.token
		// }
		// LTadmin.doAjaxRequestSign(ajaxUrl.partnerUrls.listPartnerUrl, call, param, function(data){
		// 	var obj = JSON.parse(data);
		// 	if (obj.returnCode === '000000') {
		// 		var partners = obj.response;
		// 		partner.initTable(partners);
		// 	} else {
		// 		partner.toggleModal(obj.returnMsg);
		// 		return;
		// 	}
		// });

		partner.initTable();

		//初始化添加合作方按钮
		$('#addPartner').on('click',function(){
			$('.tableWrapper').hide();
			$('.editWrapper').show();
			$('.editWrapper').data('type','0');
			var title = '<a href="javascript:;" class="showPartnerList">合作方列表</a> > 添加合作方';
			$('.current span').html(title);

			$('#addOrModifyPartnerTitle').text('添加合作方');
			$('#companyName').val('')
			$('#partnerContactName').val('')
			$('#partnerContactMobileNo').val('')
			$('#partnerContactEmail').val('')
			$('#partnerDomainWrapper').show();
			$('#partnerDomain').val('')
		});
		//初始化返回合作方列表按钮
		$('.main').on('click','.showPartnerList',function(){
			$('.tableWrapper').show();
			$('.editWrapper').hide();
			$('.current span').html('合作方列表');
		});

		//保存合作方信息
		$('#savaPartnerInfo').on('click',function(){ partner.save(); });
	},
	toggleModal : function(msg){
		$('.modal-body').text(msg);
		$('#partnerModal').modal();
	},
	save : function(){
		var url = ''
		var call = ''
		var param = null
		var userInfo = JSON.parse(sessionStorage.userInfo)

		var parameter = {
			"partnerCompany"         : $('#companyName').val(),
			"partnerContactName"     : $('#partnerContactName').val(),
			"partnerContactPhone"    : $('#partnerContactMobileNo').val(),
			"partnerContactEmail"    : $('#partnerContactEmail').val(),
			"partnerWebsite"         : $('#partnerDomain').val()
		};

		if(parameter.partnerCompany.trim() === ''){
			partner.toggleModal('“合作方名称”为空，请完成！');
			return;
		}
		// if(parameter.partnerContactName.trim() === ''){
		// 	partner.toggleModal('“联系人”为空，请完成！');
		// 	return;
		// }
		// if(parameter.partnerContactPhone.trim() === ''){
		// 	partner.toggleModal('“联系电话”为空，请完成！');
		// 	return;
		// }
		// if(parameter.partnerContactEmail.trim() === ''){
		// 	partner.toggleModal('“联系邮箱”为空，请完成！');
		// 	return;
		// }
		if(parameter.partnerWebsite.trim() === ''){
			partner.toggleModal('“公司主页”为空，请完成！');
			return;
		}


		// LTadmin.doAjaxRequest(url,parameter,function(data){
		// 	var obj = JSON.parse(data);
		// 	console.log(obj);
		// 	if(obj.status==1){
		// 		partner.toggleModal(obj.statusMsg);
		// 		partner.refreshTable();//刷新表格数据
		// 		$('.tableWrapper').show();
		// 		$('.editWrapper').hide();
		// 		$('#companyName').val('');
		// 		$('#partnerContactName').val('');
		// 		$('#partnerContactMobileNo').val('');
		// 		$('#partnerContactEmail').val('');
		// 		$('#partnerDomain').val('');
		// 		return;
		// 	}else{
		// 		partner.toggleModal(obj.statusMsg);
		// 		return;
		// 	}
		// },false);

		var type = $('.editWrapper').data('type')
		if (type === '0') {
			// 新建合作方
			url = ajaxUrl.partnerUrls.createPartnerUrl;
			call = 'Partner.add'
			param = {
				account: userInfo.account,
				token: userInfo.token,
				partnerCompany: parameter.partnerCompany,
				partnerContactName: parameter.partnerContactName,
				partnerContactPhone: parameter.partnerContactPhone,
				partnerContactEmail: parameter.partnerContactEmail,
				partnerWebsite: parameter.partnerWebsite
			}
		} else if (type === '1') {
			// 修改合作方
			url = ajaxUrl.partnerUrls.updatePartnerUrl;
			call = 'Partner.update'
			param = {
				account: userInfo.account,
				token: userInfo.token,
				partnerId: $('#partnerId').val(),
				partnerCompany: parameter.partnerCompany,
				partnerContactName: parameter.partnerContactName,
				partnerContactPhone: parameter.partnerContactPhone,
				partnerContactEmail: parameter.partnerContactEmail,
				partnerWebsite: parameter.partnerWebsite
			}
		}
		LTadmin.doAjaxRequestSign(url, call, param, function(data) {
			var obj = JSON.parse(data)
			partner.toggleModal(obj.returnMsg)
			// if (obj.returnCode === '000000') {
			// } else {}
		})
	},
	editThePartner : function(partnerId){
		// var parameter = {"partnerId":partnerId}
		// $('#partnerId').val(partnerId);
		// LTadmin.doAjaxRequest(ajaxUrl.partnerUrls.getAPartnerInfoUrl,parameter,function(data){
		// 	var obj = JSON.parse(data);
		// 	console.log(obj);
		// 	if(obj.status==1){
		// 		var partner = obj.partner;
		// 		$('.tableWrapper').hide();
		// 		$('.editWrapper').show();
		// 		$('#companyName').val(partner.companyName);
		// 		$('#partnerContactName').val(partner.partnerContactName);
		// 		$('#partnerContactMobileNo').val(partner.partnerContactMobileNo);
		// 		$('#partnerContactEmail').val(partner.partnerContactEmail);
		// 		$('#partnerDomain').val(partner.partnerDomain);
		// 	}else{
		// 		partner.toggleModal(obj.statusMsg);
		// 		return;
		// 	}
		// });

		// 合作方 '公司主页'字段 只能添加不能修改
		$('#partnerDomainWrapper').hide();

		$('#addOrModifyPartnerTitle').text('修改合作方');
		// 合作方信息获取
		var call = 'Partner.find'
		var userInfo = JSON.parse(sessionStorage.userInfo)
		var param = {
			account: userInfo.account,
			token: userInfo.token,
			partnerId: partnerId
		}
		LTadmin.doAjaxRequestSign(ajaxUrl.partnerUrls.getAPartnerInfoUrl, call, param, function(data) {
			var obj = JSON.parse(data)
			if (obj.returnCode === '000000') {
				var partnerInfo = obj.response;
				$('.tableWrapper').hide();
				$('.editWrapper').show();
				$('#companyName').val(partnerInfo.partnerCompany);
				$('#partnerContactName').val(partnerInfo.partnerContactName);
				$('#partnerContactMobileNo').val(partnerInfo.partnerContactPhone);
				$('#partnerContactEmail').val(partnerInfo.partnerContactEmail);
				// $('#partnerDomain').val(partnerInfo.partnerWebsite);
			} else {
				partner.toggleModal(obj.returnMsg)
			}
		})
	},
	refreshTable : function(){
    	LTadmin.doAjaxRequest(ajaxUrl.partnerUrls.listPartnerUrl,'',function(data){
			var obj = JSON.parse(data);
			console.log(obj);
			if(obj.status==1){
				var partners = obj.partners;
				$('#table').bootstrapTable('load', partners);
			}else{
				partner.toggleModal(obj.statusMsg);
				return;
			}
		},false);
	},
	initTable : function(data){
		var url = ajaxUrl.partnerUrls.listPartnerUrl
		var call = 'Partner.list'
		var userInfo = JSON.parse(sessionStorage.userInfo)
		var ajaxOptions = {
			account: userInfo.account,
			token: userInfo.token
		}
		function bootstrapTableAjax(result) {
			LTadmin.doAjaxRequestSign(url, call, ajaxOptions, function(data){
				var obj = JSON.parse(data);
				if (obj.returnCode === '000000') {
					var partners = obj.response;
					result.success({
						row: partners
					});
					$('#table').bootstrapTable('load', partners);
				} else {
					partner.toggleModal(obj.returnMsg);
					return;
				}
			})
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
			paginationLoop: false,
	        pageSize: 10,
	        pageNumber:1,
	        pageList: [10, 20, 50, 100, 200],
	        search: true,
	        sortable : true,
	        showColumns: true,
	        showRefresh: true,
	        showExport: true,
			search: true,
	        data : data,
	        columns: [
	            {field:"partnerId",title:"id",width:"100",align:"center",valign:"middle",visible:false},
	            {field:"partnerCompany",title:"合作方名称",width:"300",align:"left",valign:"middle"},
	            // {field:"companyName",title:"合作方名称",width:"300",align:"left",valign:"middle"},
	            // {field:"partnerContactName",title:"联系人",width:"100",align:"center",valign:"middle"},
	            // {field:"partnerContactMobileNo",title:"联系电话",width:"100",align:"center",valign:"middle",sortable:true},
	            // {field:"partnerContactEmail",title:"联系邮箱",width:"100",align:"center",valign:"middle",sortable:true},
	            // {field:"partnerDomain",title:"公司主页",width:"100",align:"center",valign:"middle",sortable:true},
	            // {field:"cooperateType",title:"合作方式",width:"100",align:"center",valign:"middle",sortable:true,formatter:"cooperateTypeFormatter"},
	            // {field:"partnerDomain",title:"合作方域名",width:"100",align:"center",valign:"middle",sortable:true},
	            {field:"action",title:"操作",width:"100",align:"center",valign:"middle",formatter:"partnerEditAction",events:"eidtThePartnerEvents"}
	        ],
	        formatNoMatches: function(){return '无符合条件的记录';},
	        onSearch : function(){
				// 当搜索表格时触发
				console.log('当搜索表格时触发')
			},
	        // onRefresh : function(){ partner.refreshTable(); },
	        onRefresh : function(){
				// 点击刷新按钮后触发
			},
	        onLoadSuccess : function(){
				// 远程数据加载成功时触发成功
				console.log('远程数据加载成功时触发成功')
			}
	    });
	}
};

/* 表格格式化函数 */
function partnerEditAction(value,row,index){
	return [
		'<span class="action">',
		'<a class="editPartner" href="javascript::"><i class="fa fa-pencil"></i></a>',
		'</span>'
	].join('');
}
/* 编辑某个应用 <span class="notice">修改应用信息</span>*/
window.eidtThePartnerEvents = {
    "click .editPartner" : function(e,value,row,index){
        console.log(row);
        $('.tableWrapper').hide();
		$('.editWrapper').show();
		var title = '<a href="javascript:;" class="showPartnerList">合作方列表列表</a> > 编辑合作方信息';
		$('.current span').html(title);
		$('.editWrapper').data('type','1');
		partner.editThePartner(row.partnerId);

		$('#partnerId').val(row.partnerId)
    }
};
function cooperateTypeFormatter(value,row,index){
	var type = value!=undefined?value:'-';
	return [
		'<a class="viewCooperateType" href="javascript:;">'+type+'</a>'
	].join();
}
/* 表格格式化函数 end */