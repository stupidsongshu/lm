var home = {
	partial : 'source/page/home.html',
	page : '主页',
	init : function (argument) {
		$('.current span').text(home.page);
		$('.menuList>li[data-target=home]').addClass('active').siblings('li').removeClass('active');

		LTadmin.doAjaxRequest('http://xfjr.ledaikuan.cn:9191/llm/cp/listProduct','',function(data){
			var obj = JSON.parse(data);
			console.log(obj);
			if(obj.status==1){
				var products = obj.products;
				var lineChartData = {
					title : ['日浏览数','日申请数'],
					X_data : [],
					Y_data : {
						visited : [],
						applied : []
					}
				};
				for(var i=0;i<products.length;i++){
					lineChartData.X_data.push(products[i].productName);
					lineChartData.Y_data.visited.push(products[i].visitNum);
					lineChartData.Y_data.applied.push(products[i].loanNum);
				}
				home.loadLineChart(lineChartData);
			}else{
				alert(obj.statusMsg);
				return;
			}
		});
		LTadmin.doAjaxRequest('http://xfjr.ledaikuan.cn:9191/llm/cp/listDayProduct','',function(data){
			var obj = JSON.parse(data);
			console.log(obj);
			if(obj.status==1){
				var products = obj.products;
				var dayData = {
					name : [],
					visited : [],
					applied : []
				};
				for(var i=0;i<products.length;i++){
					dayData.name.push(products[i].productName);
					dayData.visited.push(products[i].visitNum);
					dayData.applied.push(products[i].loanNum);
				}
				home.loadSliderData(dayData);
			}else{
				alert(obj.statusMsg);
				return;
			}
		});
		//创建app
		$('#creatApp').on('click',function(){
			$('.menuList>li[data-target=app]').addClass('active').siblings('li').removeClass('active');
		});
	},
	loadLineChart : function(data){
		var myLineChart = echarts.init(document.getElementById('lineChart'));

		option = {
			color :['#F18985','#93E0EF'],
		    tooltip: {trigger: 'axis'},
		    legend: {data: data.title},
		    grid: {
		        left: '1%',
		        right: '6%',
		        bottom: '8%',
		        containLabel: true
		    },
		    toolbox: {
		        feature: {
		            saveAsImage: {},
		            dataView: {show: true},
		        }
		    },
		    xAxis: {
		        type: 'category',
		        boundaryGap: false,
		        data: data.X_data,
		        name : '产品名称',
		        nameRotate : '60',
		        axisLabel : {
		        	rotate : 45,
		        	interval : 0,
		        	textStyle : {
		        		fontSize : 10,
		        		fontStyle : 'normal',
		        		fontFamily : '微软雅黑'
		        	}
		        }
		    },
		    yAxis: {
		        type: 'value',
		        name : '数量'
		    },
		    series: [
		        {
		            name: data.title[0],
		            type:'line',
		            stack: '总量',
		            data: data.Y_data.visited
		        },
		        {
		            name: data.title[1],
		            type: 'line',
		            stack: '总量',
		            data: data.Y_data.applied
		        }
		    ]
		};

		myLineChart.setOption(option);
        window.addEventListener('resize', function () {
            myLineChart.resize();
        });
        $("#toggleBtn").on("click",function(){
            setTimeout(function(){
                myLineChart.resize();
            },400);
        });
	},
	loadSliderData : function(data){
		var itemName = data.name;
		var visitedNum = data.visited;
		var appliedNum = data.applied;
		var sliderItems = Math.round(visitedNum.length/5);
		var j=0;
		for(var i=0;i<sliderItems;i++){
			var item = '<div class="item"><div>';
			var visitedBtnItem = '<li data-target="#visitedSlider" data-slide-to="'+i+'"></li>';
			var appliedBtnItem = '<li data-target="#appliedSlider" data-slide-to="'+i+'"></li>';
			var itemItems = (i+1)*5;
			$('#visitedSlider .carousel-inner').append(item);
			$('#visitedSlider .carousel-indicators').append(visitedBtnItem);
			$('#appliedSlider .carousel-inner').append(item);
			$('#appliedSlider .carousel-indicators').append(appliedBtnItem);
			for(;j<itemItems;j++){
				if(j>=visitedNum.length){break;}
				var visitedItemItem = '<p><span class="key">'+itemName[j]+'</span><span class="value">'+visitedNum[j]+'</span></p>';
				var appliedItemItem = '<p><span class="key">'+itemName[j]+'</span><span class="value">'+appliedNum[j]+'</span></p>';
				$('#visitedSlider .carousel-inner').children('.item').eq(i).append(visitedItemItem);
				$('#appliedSlider .carousel-inner').children('.item').eq(i).append(appliedItemItem);
			}
		}
		$('#visitedSlider .carousel-inner').children().eq(0).addClass('active');
		$('#visitedSlider .carousel-indicators').children().eq(0).addClass('active');
		$('#appliedSlider .carousel-inner').children().eq(0).addClass('active');
		$('#appliedSlider .carousel-indicators').children().eq(0).addClass('active');

	}
};