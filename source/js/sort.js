var sort = {
    partial: 'source/page/sort.html',
    page: '排序',
    init: function() {
        sort.initTable();
    },
    initTable : function(){
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

		$('#sortable').bootstrapTable({
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
				console.log('当搜索表格时触发')
			},
	        // onRefresh : function(){ app.refreshTable();},
	        onRefresh : function(){},
	        onLoadSuccess : function(){
				// sortable(document.getElementById('sortable').getElementsByTagName('tbody')[0]);
			}
	    });
	   	$('#getOnLine').on('click',function(){
	   		$('#table').bootstrapTable('filterBy', {'productStatus':1});
		});
		$('#getOffLine').on('click',function(){
	   		$('#table').bootstrapTable('filterBy', {'productStatus':0});
		});
	}
}

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
		'<a class="sortHandle"><i class="glyphicon glyphicon-resize-vertical" aria-hidden="true"></i></a>',
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

function sortable(el) {
	Sortable.create(el, {
		handle: '.sortHandle',
        animation: 150,
        onStart: function (/**Event*/evt) {
            evt.oldIndex;  // element index within parent
            // console.log(evt.oldIndex)
        },
        onEnd: function (/**Event*/evt) {
            var itemEl = evt.item;  // dragged HTMLElement
            evt.to;    // target list
            evt.from;  // previous list
            evt.oldIndex;  // element's old index within old parent
            evt.newIndex;  // element's new index within new parent
			console.log(evt)
			console.log(evt.oldIndex, evt.newIndex)
		},
		onUpdate: function(evt) {
			console.log('onUpdate')
		},
		onSort: function(evt) {
			console.log('onSort')
		},
		onMove: function() {
			console.log('onMove')
		}
	});
}
