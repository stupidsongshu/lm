/* 表格格式化函数：*/
function nameTransform(value,row,index){
	return '<img src="'+row.productIconLink+'" class="nameIcon" />'+value;
}
function statusStyle(value,row,index){
	if(row.productStatus==0){
		return {classes: 'red'};
	}else{
		return {classes: 'green'};
	}
	return row.status;
}
function toggleProductStatusFormatter(value,row,index){
	if (row.productStatus === 0) {        // 已下线
		return [
			'<a class="toggleTheApp" style="color: gray;" href="javascript:;"><img style="width:26px;height:26px;" src="source/image/app/offline.png">已下线</a>'
		].join('');
	} else if (row.productStatus === 1) { // 已上线
		return [
			'<a class="toggleTheApp" style="color: #1afa29;" href="javascript:;"><img style="width:26px;height:26px;" src="source/image/app/online.png">已上线</a>'
		].join('');
	}
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
		'<a class="editTheApp" href="javascript:;"><i class="fa fa-pencil"></i>修改</a>',
		'</p>'
	].join('');
}
function editIsShow(value,row,index){
	// console.log(row)
	var arr = []
	arr.push('<p class="action">')
	// khwShow为undefined或0时表示在卡还王上不展示，为1时表示在卡还王上展示
	var khwShow = parseInt(row.platformShow.khwShow === undefined ? 0 : row.platformShow.khwShow)
	var ldkShow = parseInt(row.platformShow.ldkShow === undefined ? 0 : row.platformShow.ldkShow)

	// 卡还王展示状态
	if (khwShow === 0) {
		arr.push('<a class="khwShow" href="javascript:;"><i class="glyphicon glyphicon-eye-close"></i>卡还王</a>')
	} else if (khwShow === 1) {
		arr.push('<a class="khwShow" href="javascript:;"><i class="glyphicon glyphicon-eye-open"></i>卡还王</a>')
	}

	// 乐贷款展示状态
	if (ldkShow === 0) {
		arr.push('<a class="ldkShow" href="javascript:;"><i class="glyphicon glyphicon-eye-close"></i>乐贷款</a>')
	} else if (ldkShow === 1) {
		arr.push('<a class="ldkShow" href="javascript:;"><i class="glyphicon glyphicon-eye-open"></i>乐贷款</a>')
	}

	arr.push('</p>')

	return arr.join('')
}
function editActionHasSort(value,row,index){
	return [
		'<p class="action">',
        '<a class="stickTop"><i class="glyphicon glyphicon-arrow-up" aria-hidden="true"></i>置顶</a>',
        '<a class="sortHandle"><i class="glyphicon glyphicon-resize-vertical" aria-hidden="true"></i>排序</a>',
		'</p>'
	].join('');
}
/* 表格格式化函数：end */

var util = {
    toggleModal : function(msg){
		$('.modal-body').text(msg);
		$('#appModal').modal();
	},
	toggleModalAjaxError(msg) {
		msg = msg ? msg : '获取数据失败，请稍后重试';
		$('.modal-body').text(msg);
		$('#appModal').modal();
	}
}
