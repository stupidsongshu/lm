/* 对话框 */
var shade = {
	dialog : {
		title : function(title){$(this).text(title);},
		content : function(content){$(this).text(content);},
		close : function(){
			$("#body").removeClass("popActive");
			$("#dialog").popup('close');
		},
		open : function(flag){
			this.init(flag);
			$("#body").addClass("popActive");
			$("#dialog").on("click","a",function(){
				$("#body").removeClass("popActive");
				$("#dialog").popup('close');
			});
			$("#dialog").popup('open');
		},
		init : function(flag){
			var dialogHtml = '<div class="title">提示</div>'+
          		'<p class="dialog-content">这是对话框对话框内容</p>'+
          		'<div class="btn-group" data-role="controlgroup" data-type="horizontal">'+
          		'</div>';
          	var cancelBtn = '<a href="#" class="ui-btn cancel" id="cancel" target="_self">取消</a>';
          	var confirmBtn = '<a href="#" class="ui-btn confirm" id="cancel" target="_self">确定</a>';
          	var singleBtn = '<a href="#" class="ui-btn confirm single" id="cancel" target="_self">确定</a>';
          	$("#dialog").html(dialogHtml);
          	if(!flag){
          		$("#dialog .btn-group").append(cancelBtn);
          		$("#dialog .btn-group").append(confirmBtn);
          	}else{
          		$("#dialog .btn-group").append(singleBtn);
          	}
		}

	},
	loading : {
		showLoading : function(html){
			$("#body").addClass("popActive")
			$.mobile.loading( 'show', {
			  theme: 'a',
			  textonly: false,
			  html: html
			});
		},
		hideLoading : function(){
			$("#body").removeClass("popActive");
			$.mobile.loading('hide');
		}
	}
}
// function toggleDialog(){
// 	$("#body").addClass("popActive")
// 	$("#dialog").popup('open');
// }
// function toggleLoading(html){
// 	$("#body").addClass("popActive")
// 	$.mobile.loading( 'show', {
// 	  // text: '正在加载...',
// 	  /*textVisible: true,*/
// 	  theme: 'a',
// 	  textonly: false,
// 	  html: html
// 	});
// }
// function dialogBtnEvent(){
// 	$("#dialog").on("click","a",function(){
// 		$("#dialog").popup('close');
// 	});
// }
// function title(title){$(this).text(title);}
// function content(content){$(this).text(content);}