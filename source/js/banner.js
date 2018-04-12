var banner = {
	partial : 'source/page/banner.html',
	page : 'banner列表',
	init : function (argument) {
		$('.current span').text(partner.page);
		$('.menuList>li[data-target=banner]').addClass('active').siblings('li').removeClass('active');
		//初始化banner列表
		LTadmin.doAjaxRequest(ajaxUrl.bannerUrls.listBannerUrl,'',function(data){
			var obj = JSON.parse(data);
			console.log(obj);
			if(obj.status==1){
				var bannerList = obj.bannerList;
				banner.initTable(bannerList);
			}else{
				util.toggleModal(obj.statusMsg);
				return;
			}
		});

		//初始化添加合作方按钮
		$('#addBanner').on('click',function(){
			$('.tableWrapper').hide();
			$('.editWrapper').show();
			var title = '<a href="javascript:;" class="showBannerList">banner列表</a> > 添加banner';
			$('.current span').html(title);
		});
		//初始化返回合作方列表按钮
		$('.main').on('click','.showBannerList',function(){
			$('.tableWrapper').show();
			$('.editWrapper').hide();
			$('.current span').html('banner列表');
		});

		banner.initProducts();//初始化所属产品列表

		banner.initFileUploadEvent();//初始化文件上传插件

		//创建banner
		$('#savaBannerInfo').on('click',function(){ banner.save(); });

	},
	save : function(){
		var parameter = {
			"productId"   : $('#productId>option:selected').attr('value'),//合作方id
			"position"    : $('#position').val(),//banner位置
			"linkType"    : $('#linkType>option:selected').attr('value'),//跳转类型
			"linkPath"    : $('#linkPath').val(),//跳转url
			"imageLink"   : $('#imageLink').val()
		};

		if(parameter.productId==''){
			util.toggleModal("请选择“所属产品”！");
			return;
		}
		if(parameter.position==''){
			util.toggleModal("请完成“banner位置”！");
			return;
		}else{
			parameter.position = parseInt(parameter.position);
		}
		if(parameter.imageLink==''){
			util.toggleModal("请上传“banner图片”！");
			return;
		}
		if(parameter.linkType==''){
			util.toggleModal("请选择“跳转类型”！");
			return;
		}else{
			parameter.linkType = parseInt(parameter.linkType);
		}
		if(parameter.linkPath==''){
			util.toggleModal("请完成“跳转链接”！");
			return;
		}

		console.log(parameter);

		var url = '';
		if($('.editWrapper').data('type')=='0'){
			url = ajaxUrl.bannerUrls.createBannerUrl;
		}else{
			parameter.id = parseInt($('#id').val());
			if(parameter.imageLink=='1'){
				parameter.imageLink = '';
			}
			url = ajaxUrl.bannerUrls.updateBannerUrl;
		}
		LTadmin.doAjaxRequest(url,parameter,function(data){
			var obj = JSON.parse(data);
			console.log(obj);
			if(obj.status==1){
				util.toggleModal(obj.statusMsg);
				banner.refreshTable();//刷新表格数据
				$('.tableWrapper').show();
				$('.editWrapper').hide();
				$('#productId').val('');
				$('#position').val('');
				$('#linkType').val('');
				$('#linkPath').val('');
				$('#bannerImg').attr('src','');
				$('#imageLink').val('');
				return;
			}else{
				util.toggleModal(obj.statusMsg);
				return;
			}
		},false);

	},
	editTheBanner : function(id){
		var parameter = {"id":id}
		$('#id').val(id);
		LTadmin.doAjaxRequest(ajaxUrl.bannerUrls.getABannerInfoUrl,parameter,function(data){
			var obj = JSON.parse(data);
			console.log(obj);
			if(obj.status==1){
				var bannerData = obj.banner;
				$('.tableWrapper').hide();
				$('.editWrapper').show();
				$('#productId').val(bannerData.productId);
				$('#position').val(bannerData.position);
				$('#linkType').val(bannerData.linkType);
				$('#linkPath').val(bannerData.linkPath);
				$('#bannerImg').attr('src',bannerData.imageLink);
				$('#imageLink').val('1');
				return;
			}else{
				util.toggleModal(obj.statusMsg);
				return;
			}
		});
	},
	toggleBannerStatus : function(id,status,index){
		var parameter = {
			"id"        : id,
			"status"    : parseInt(status)==0?1:0
		};
		LTadmin.doAjaxRequest(ajaxUrl.bannerUrls.setBannerStatusUrl,parameter,function(data){
			var obj = JSON.parse(data);
			console.log(obj);
			if(obj.status==1){
				util.toggleModal(obj.statusMsg);
				$('#bannerTable').bootstrapTable('updateCell', {
					"index" : index,
					"field" : 'status',
					"value" : parameter.status
				});
				return;
			}else{
				util.toggleModal(obj.statusMsg);
				return;
			}
		});
	},
	initFileUploadEvent : function(){
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
	    	banner.initFileUpload(fileList,1);
	    },false);
	    //选择图片上传
	    $('#bannerImgFile').on('change',function(e){
	    	banner.initFileUpload(this.files,1);
	    });
	},
	initFileUpload : function(fileList,type){
		console.log(fileList);
		//检测是否是拖拽文件到页面的操作
        if(fileList[0].length == 0){
            return false;
        }
        $('.bannerImg_name').text('');
        $('.bannerImg_progress').text('');

		var filename = fileList[0].name; //文件名称
	    var filesize = Math.floor((fileList[0].size)/1024/1024);
        if(filesize>10){
        	util.toggleModal("上传文件的大小不能超过10M");
            return false;
    	}
        if(type==1){
        	//拖拉图片到浏览器，可以实现预览功能
		    var img = window.webkitURL.createObjectURL(fileList[0]);
		    //检测文件是不是图片
	        if(fileList[0].type.indexOf('image')===-1){
	        	util.toggleModal("您上传的不是图片！");
	            return false;
	        }
        	$('#bannerImg').attr('src',img);
        	$('.bannerImg_name').text(filename);
        }else{
        	//检测文件是不是apk文件
	        if(fileList[0].name.indexOf('.apk')===-1){
	        	util.toggleModal("您上传的不是apk文件！");
	            return false;
	        }
	        $('.apk_name').text(filename);
        }
        //上传
        banner.upload(fileList[0],type);
	},
	upload : function(file,type){
		var xhr = new XMLHttpRequest();
        xhr.upload.addEventListener("progress", function(e){
            if(e.lengthComputable) {
                var percentage = Math.round((e.loaded * 100) / e.total)+'%';
                console.log(percentage)
                console.log(type)
                if(type==1){
	        		$('.bannerImg_progress').text(percentage);
	        	}else{
	        		$('.apk_progress').text(percentage);
	        	}
            }
        }, false);

        xhr.upload.addEventListener("load", function(e){
        	if(type==1){
        		$('.bannerImg_progress').text('100%');
        	}else{
        		$('.apk_progress').text('100%');
        	}
        }, false);

        xhr.open("POST", ajaxUrl.uploadFileUrl);
        xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4 && xhr.status == 200) {
                var data = JSON.parse(xhr.responseText);
                console.log(data); // handle response.progress.style.display = "none";
                if(type==1){
		    		$('#imageLink').val(data.filePath);
		    	}else{
		    		$('#productApkPath').val(data.filePath);
		    	}
            }
        };
        var fd = new FormData();
        if(type==1){
    		fd.append("cachefile", file);
    		fd.append("userName", sessionStorage.ldkusername);
    	}else{
    		fd.append("cachefile", file);
    		fd.append("userName", sessionStorage.ldkusername);
    	}
        xhr.send(fd);
	},
	initProducts : function(){
		LTadmin.doAjaxRequest(ajaxUrl.appUrls.listProductUrl,'',function(data){
			var obj = JSON.parse(data);
			console.log(obj);
			var products = obj.products;
			if(obj.status==1){
				var _html = '';
				for(var i=0;i<products.length;i++){
					_html += '<option value="'+products[i].productId+'">'+products[i].productName+'</option>';
				}
				$('#productId').append(_html);
				return;
			}else{
				util.toggleModal(obj.statusMsg);
				return;
			}
		});
	},
	refreshTable : function(){
    	LTadmin.doAjaxRequest(ajaxUrl.bannerUrls.listBannerUrl,'',function(data){
			var obj = JSON.parse(data);
			console.log(obj);
			if(obj.status==1){
				var bannerList = obj.bannerList;
				$('#bannerTable').bootstrapTable('load', bannerList);
			}else{
				util.toggleModal(obj.statusMsg);
				return;
			}
		},false);
	},
	initTable : function(data){
		$('#bannerTable').bootstrapTable({
	        idField: "id",
	        toolbar: "#toolbar",
	        method: 'post',
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
	        data : data,
	        columns: [
	            {field:"id",title:"id",width:"100",align:"center",valign:"middle",visible:false},
	            {field:"imageLink",title:"banner",width:"300",align:"center",valign:"middle",formatter:"bannerFormatter"},
	            {field:"status",title:"是否启用",width:"100",align:"center",valign:"middle",formatter:"statusFormatter",cellStyle:"statusStyle"},
	            {field:"updateTime",title:"配置时间",width:"200",align:"center",valign:"middle",sortable:true},
	            {field:"position",title:"位置",width:"100",align:"center",valign:"middle",sortable:true},
	            {field:"productId",title:"所属产品",width:"100",align:"center",valign:"middle"},
	            {field:"linkPath",title:"跳转链接",width:"100",align:"center",valign:"middle",formatter:"linkFormatter"},
	            {field:"linkType",title:"跳转类型",width:"100",align:"center",valign:"middle",sortable:true,formatter:"linkTypeFormatter"},
	            {field:"action",title:"操作",width:"100",align:"center",valign:"middle",formatter:"bannerEditAction",events:"eidtTheBannerEvents"}
	        ],
	        formatNoMatches: function(){return '无符合条件的记录';},
	        onSearch : function(){  },
	        onRefresh : function(){ banner.refreshTable(); },
	        onLoadSuccess : function(){  }
	    });
	}
};

/* 表格格式化函数 */
function bannerFormatter(value,row,index){
	return [
		'<img class="bannerImg" src="'+value+'" />'
	].join();
}
function statusFormatter(value,row,index){
	return value==0?'否':'是';
}
function statusStyle(value,row,index){
	if(row.status==0){
		return {classes: 'red'};
	}else{
		return {classes: 'green'};
	}
	return row.status;
}
function linkFormatter(value,row,index){
	return [
		'<a href="'+value+'" target="_blank"><i class="fa fa-external-link" aria-hidden="true"></i></a>'
	].join();
}
function linkTypeFormatter(value,row,index){
	return value==0?'跳转三方url':'跳转详情';
}
function bannerEditAction(value,row,index){
	return [
		'<span class="action">',
		'<a class="editBanner" href="javascript:;"><i class="fa fa-pencil"></i></a>',
		'<a class="toggleBanner" href="javascript:;"><i class="fa fa-wrench"></i></a>',
		'</span>'
	].join('');
}
window.eidtTheBannerEvents = {
	'click .editBanner' : function(e,value,row,index){
        console.log(row);
		var title = '<a href="javascript:;" class="showAppList">banner列表</a> > 编辑banner';
		$('.current span').html(title);
		$('.editWrapper').data('type','1');
        banner.editTheBanner(row.id);
    },
    'click .toggleBanner' : function(e,value,row,index){
    	banner.toggleBannerStatus(row.id,row.status,index);
    }
}
/* 表格格式化函数：end */
