var sort = {
    partial: 'source/page/sort.html',
    page: '排序',
    init: function() {
		$('.current span').text(sort.page);
		$('.menuList>li[data-target=sort]').addClass('active').siblings('li').removeClass('active');

        sort.initTable();
    },
    initTable : function(){
		var url = ajaxUrl.appUrls.listProductRankUrl
		var call = 'Product.rank'
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
					console.log(products)
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
	        // idField: "id",
			url: url,
			method: 'post',
			ajax: bootstrapTableAjax,
			ajaxOptions: ajaxOptions,
	        cache: false,
	        striped: true,
	        sortable : true,
			showExport: true,
			columns: [
	            {field:"productId",    title:"id",      width:"100",align:"center",valign:"middle",visible:true},
				{field:"productName",  title:"应用名称", width:"100",align:"left",  valign:"middle",formatter:"nameTransform"},
				{field:"productStatus",title:"状态",     width:"100",align:"center",valign:"middle",formatter:"appStatusTransform",cellStyle:"statusStyle"},
	            {field:"action",       title:"操作",     width:"100",align:"center",valign:"middle",formatter:"editActionHasSort",events:"eidtTheAppEvents"}
	        ],
	        formatNoMatches: function(){return '无符合条件的记录';},
	        onLoadSuccess : function(){
				sort.sortableFn(document.getElementById('table').getElementsByTagName('tbody')[0]);

				// 置顶排序
				setTimeout(function() {
					$('#table').on('click', '.stickTop', function(e) {
						var parentTr = $(this).parents('tr')
						var productId = parentTr.children(':first').text();
						var movedNo = -1;
						var insertNo = 0;

						parentTr.addClass('stickTop-choosen');
						$('#table tbody tr').each(function(index, value) {
							if ($(value).hasClass('stickTop-choosen')) {
								movedNo = index;
								return;
							}
						})

						console.log(productId, movedNo, insertNo);
						if (movedNo !== insertNo) {
							sort.updateRank(productId, movedNo, insertNo);
						}
					})
				}, 0)
			}
	    });
	},
	// 更新产品排序
	updateRank: function(productId, movedNo, insertNo) {
		var url = ajaxUrl.appUrls.listProductUpdateRankUrl
		var call = 'Product.updateRank'
		var userInfo = JSON.parse(sessionStorage.userInfo)
		var param = {
			account: userInfo.account,
			token: userInfo.token,
			productId: productId,
			movedNo: movedNo,
			insertNo: insertNo
		}
		LTadmin.doAjaxRequestSign(url, call, param, function(data) {
			var obj = JSON.parse(data);
			console.log(obj)
			if (obj.returnCode === '000000') {
				var products = obj.response;
				$('#table').bootstrapTable('load', products);
			} else {}
		})
	},
	sortableFn: function(el) {
		Sortable.create(el, {
			handle: '.sortHandle',
			animation: 150,
			onEnd: function (/**Event*/evt) {
				var itemEl = evt.item;  // dragged HTMLElement
				// evt.to;    // target list
				// evt.from;  // previous list
				// evt.oldIndex;  // element's old index within old parent
				// evt.newIndex;  // element's new index within new parent
				var productId = itemEl.getElementsByTagName('td')[0].innerHTML;
				var movedNo = evt.oldIndex;
				var insertNo = evt.newIndex;
				console.log(productId, movedNo, insertNo);
				if (movedNo !== insertNo) {
					sort.updateRank(productId, movedNo, insertNo);
				}
			}
		});
	}
}
