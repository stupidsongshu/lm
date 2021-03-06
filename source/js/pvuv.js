var pvuv = {
  partial : 'source/page/pvuv.html',
  page : 'pvuv',
  productRankData: [],
  init: function() {
    pvuv.listRecentGeneral();
    pvuv.list7DayHourPVUV();
    // pvuv.list7DayActionPVUV();
    pvuv.productRank(function(arr) {
      pvuv.list7DayActionPVUV(arr);
    });
    pvuv.list7DayFrom();
    pvuv.list7DayPlatform();
  },
  selectDayOptions: function(el, data) {
    var tpl = '';
    data.forEach(function(item) {
      tpl += '<button type="button" class="btn btn-default" data-dayTime="' + item.dayTime + '">'+ item.dayTime +'</button>';
    })
    el.html(tpl);
  },
  // 最近概况
  listRecentGeneral: function() {
    var url = ajaxUrl.pvUvUrls.listRecentGeneral;
    var call = 'PVUV.listRecentGeneral';
    LTadmin.doAjaxRequestSign(url, call, {}, function(data) {
      var obj = JSON.parse(data);
      console.log('listRecentGeneral', obj);
      if (obj.returnCode === '000000') {
        var listRecentGeneral = $('#listRecentGeneral');
        var tpl = '';
        obj.response.forEach(function(item) {
          tpl += '<tr>' +
                    '<td>' + item.dayTime + '</td>'+
                    '<td>' + item.pv + '</td>' +
                    '<td>' + item.uv + '</td>' +
                    '<td>' + item.newUser + '</td>' +
                    '<td>' + (item.newUser/item.uv*100).toFixed(2) + '%</td>' +
                  '</tr>'
        })
        listRecentGeneral.append(tpl);
      }
    })
  },
  list7DayHourPVUV: function() {
    var list7DayHourPVUV = echarts.init(document.getElementById('list7DayHourPVUV'));
    var list7DayHourPVUVSelect = $('#list7DayHourPVUVSelect');
    var list7DayHourPVUVData = {};

    window.onresize = function() {
      list7DayHourPVUV.resize();
    }

    var option = {};

    var url = ajaxUrl.pvUvUrls.list7DayHourPVUV;
    var call = 'PVUV.list7DayHourPVUV';
    // list7DayHourPVUV.showLoading();
    LTadmin.doAjaxRequestSign(url, call, {}, function(data) {
      // list7DayHourPVUV.hideLoading();
      var obj = JSON.parse(data);
      if (obj.returnCode === '000000') {
        list7DayHourPVUVData = obj.response;
        // 降序排序
        list7DayHourPVUVData.sort(function(a, b) {
          return new Date(b.dayTime).getTime() - new Date(a.dayTime).getTime();
        })
        // 初始化选择控件 绑定事件
        pvuv.selectDayOptions(list7DayHourPVUVSelect, list7DayHourPVUVData);
        list7DayHourPVUVSelect.find('button').on('click', function() {
          renderOneDay($(this).attr('data-dayTime'));
        })
        // 升序排序
        list7DayHourPVUVData.forEach(function(item) {
          item.hourPvUvList.sort(function(a, b) {
            return a.hour - b.hour;
          })
        })
        console.log('list7DayHourPVUV', list7DayHourPVUVData)
        // 默认渲染最近一天数据
        var lastDayTime = list7DayHourPVUVData[0].dayTime;
        renderOneDay(lastDayTime);
      }
    })

    function renderOneDay(dayTime) {
      console.log('dayTime:', dayTime);
      resetOption();
      for (var i = 0, len = list7DayHourPVUVData.length; i < len; i++) {
        if (list7DayHourPVUVData[i].dayTime === dayTime) {
          for (var j = 0, length = list7DayHourPVUVData[i].hourPvUvList.length; j < length; j++) {
            option.xAxis.data.push(list7DayHourPVUVData[i].hourPvUvList[j].hour);
            option.series[0].data.push(list7DayHourPVUVData[i].hourPvUvList[j].pv);
            option.series[1].data.push(list7DayHourPVUVData[i].hourPvUvList[j].uv);
          }
          break;
        }
      }

      list7DayHourPVUV.setOption(option);
    }

    function resetOption() {
      option = {
        title: {
          text: '最近7天-按小时'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985'
            }
          }
        },
        toolbox: {
          feature: {
            dataView: {
              show: true
            },
            saveAsImage: {}
          }
        },
        legend: {
          data:['pv', 'uv']
        },
        xAxis: {
          data: []
        },
        yAxis: {},
        series: [
          {
            name: 'pv',
            type: 'line',
            data: []
          },
          {
            name: 'uv',
            type: 'line',
            data: []
          }
        ]
      };
    }
  },
  list7DayActionPVUV: function(productRankArr) {
    var list7DayActionPVUV = echarts.init(document.getElementById('list7DayActionPVUV'));
    var list7DayActionPVUVSelect = $('#list7DayActionPVUVSelect');
    var list7DayActionPVUVData = {};

    window.onresize = function() {
      list7DayActionPVUV.resize();
    }

    var option = {};

    var url = ajaxUrl.pvUvUrls.list7DayActionPVUV;
    var call = 'PVUV.list7DayActionPVUV';
    LTadmin.doAjaxRequestSign(url, call, {}, function(data) {
      var obj = JSON.parse(data);
      if (obj.returnCode === '000000') {
        list7DayActionPVUVData = obj.response;
        // 降序排序
        list7DayActionPVUVData.sort(function(a, b) {
          return new Date(b.dayTime).getTime() - new Date(a.dayTime).getTime();
        })
        // 初始化选择控件 绑定事件
        pvuv.selectDayOptions(list7DayActionPVUVSelect, list7DayActionPVUVData);
        list7DayActionPVUVSelect.find('button').on('click', function() {
          renderOneDay($(this).attr('data-dayTime'));
        })
        // 默认渲染最近一天数据
        var lastDayTime = list7DayActionPVUVData[0].dayTime;
        renderOneDay(lastDayTime);
      }
      console.log('list7DayActionPVUV', obj);
    })

    function renderOneDay(dayTime) {
      console.log('dayTime:', dayTime);
      resetOption();
      for (var i = 0, len = list7DayActionPVUVData.length; i < len; i++) {
        if (list7DayActionPVUVData[i].dayTime === dayTime) {
          for (var j = 0, length = list7DayActionPVUVData[i].actionPvUvList.length; j < length; j++) {
            option.xAxis.data.push(productRankArr[list7DayActionPVUVData[i].actionPvUvList[j].action - 1]);
            option.series[0].data.push(list7DayActionPVUVData[i].actionPvUvList[j].pv);
            option.series[1].data.push(list7DayActionPVUVData[i].actionPvUvList[j].uv);
          }
          break;
        }
      }

      list7DayActionPVUV.setOption(option);
    }

    function resetOption() {
      option = {
        title: {
          text: '最近7天-点击次数'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985'
            }
          }
        },
        toolbox: {
          feature: {
            dataView: {
              show: true
            },
            saveAsImage: {}
          }
        },
        legend: {
          data:['pv', 'uv']
        },
        xAxis: {
          data: []
        },
        yAxis: {},
        series: [
          {
            name: 'pv',
            type: 'line',
            data: []
          },
          {
            name: 'uv',
            type: 'line',
            data: []
          }
        ]
      };
    }
  },
  list7DayFrom: function() {
    var list7DayFrom = echarts.init(document.getElementById('list7DayFrom'));
    var list7DayFromSelect = $('#list7DayFromSelect');
    var list7DayFromData = {};

    window.onresize = function() {
      list7DayFrom.resize();
    }

    var option = {};

    var url = ajaxUrl.pvUvUrls.list7DayFrom;
    var call = 'PVUV.list7DayFrom';
    LTadmin.doAjaxRequestSign(url, call, {}, function(data) {
      var obj = JSON.parse(data);
      console.log('list7DayFrom', obj);
      if (obj.returnCode === '000000') {
        list7DayFromData = obj.response;
        // 降序排序
        list7DayFromData.sort(function(a, b) {
          return new Date(b.dayTime).getTime() - new Date(a.dayTime).getTime();
        })
        // 初始化选择控件 绑定事件
        pvuv.selectDayOptions(list7DayFromSelect, list7DayFromData);
        list7DayFromSelect.find('button').on('click', function() {
          renderOneDay($(this).attr('data-dayTime'));
        })
        // 默认渲染最近一天数据
        var lastDayTime = list7DayFromData[0].dayTime;
        renderOneDay(lastDayTime);
      }
    })

    function renderOneDay(dayTime) {
      console.log('dayTime:', dayTime);
      resetOption();
      for (var i = 0, len = list7DayFromData.length; i < len; i++) {
        if (list7DayFromData[i].dayTime === dayTime) {
          for (var j = 0, length = list7DayFromData[i].fromCountList.length; j < length; j++) {
            option.xAxis.data.push(list7DayFromData[i].fromCountList[j].from);
            option.series[0].data.push(list7DayFromData[i].fromCountList[j].count);
          }
          break;
        }
      }

      list7DayFrom.setOption(option);
    }

    function resetOption() {
      option = {
        title: {
          text: '最近7天-访问来源'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985'
            }
          }
        },
        toolbox: {
          feature: {
            dataView: {
              show: true
            },
            saveAsImage: {}
          }
        },
        legend: {
          data:['count']
        },
        xAxis: {
          data: []
        },
        yAxis: {},
        series: [
          {
            name: 'count',
            type: 'line',
            data: []
          }
        ]
      };
    }
  },
  list7DayPlatform: function() {
    // 定义数据
    // var legendData = ['count'];
    // var seriesData = [
    //   {
    //     name: 'count',
    //     type: 'line',
    //     data: []
    //   }
    // ];

    var chartOption = {
      title: {
        text: '最近7天-list7DayPlatform'
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          label: {
            backgroundColor: '#6a7985'
          }
        }
      },
      toolbox: {
        feature: {
          dataView: {
            show: true
          },
          saveAsImage: {}
        }
      },
      legend: {
        data: ['count']
      },
      xAxis: {
        data: []
      },
      yAxis: {},
      series: [
        {
          name: 'count',
          type: 'line',
          data: []
        }
      ]
    };
    pvuv.list7DayChart('list7DayPlatform', chartOption);
  },
  list7DayChart: function(call, chartOption) {
    var chart = echarts.init(document.getElementById(call));
    var selectDay = $('#' + call + 'Select');
    var chartData = {};

    chartOption = JSON.parse(JSON.stringify(chartOption))

    var url = ajaxUrl.pvUvUrls[call];
    LTadmin.doAjaxRequestSign(url, 'PVUV.' + call, {}, function(data) {
      var obj = JSON.parse(data);
      console.log(call, obj);
      if (obj.returnCode === '000000') {
        chartData = obj.response;
        // 降序排序
        chartData.sort(function(a, b) {
          return new Date(b.dayTime).getTime() - new Date(a.dayTime).getTime();
        })
        // 初始化近7天选择按钮 绑定事件
        pvuv.selectDayOptions(selectDay, chartData);
        selectDay.find('button').on('click', function() {
          renderOneDay($(this).attr('data-dayTime'));
        })
        // 默认渲染最近一天数据
        var lastDayTime = chartData[0].dayTime;
        renderOneDay(lastDayTime);
      }
    })

    var firstListName = ''; // 数据一级列表名
    var field = {}
    if (call === 'list7DayPlatform') {
      firstListName = 'platformCountList';
      field.xAxis = 'platform'
      field.yAxis = 'count'
    }

    var option = null;
    function renderOneDay(dayTime) {
      console.log('dayTime:', dayTime);
      resetOption(); // 重置echarts option

      for (var i = 0, l = chartData.length; i < l; i++) {
        if (chartData[i].dayTime === dayTime) {
          // console.log(chartData[i][firstListName])
          for (var j = 0, length = chartData[i][firstListName].length; j < length; j++) {
            // chartOption.xAxis.data.push(chartData[i][firstListName][j].platform);
            // chartOption.series[0].data.push(chartData[i][firstListName][j].count);
            chartOption.xAxis.data.push(chartData[i][firstListName][j][field.xAxis]);
            for (var k = 0, seriesLen = chartOption.series.length; k < seriesLen; k++) {
              chartOption.series[k].data.push(chartData[i][firstListName][j][field.yAxis]);
            }
          }
          break;
        }
      }

      chart.setOption(chartOption);
    }

    function resetOption() {
      option = chartOption;
    }
  },
  productRank: function(cb) {
    var url = ajaxUrl.appUrls.listProductRankUrl
		var call = 'Product.rank'
		var userInfo = JSON.parse(sessionStorage.userInfo)
		var ajaxOptions = {
			account: userInfo.account,
			token: userInfo.token
		}
    LTadmin.doAjaxRequestSign(url, call, ajaxOptions, function(data){
      var obj = JSON.parse(data);
      console.log('productRank', obj)
      if (obj.returnCode === '000000') {
        obj.response.forEach(function(item) {
          pvuv.productRankData.push(item.productName);
        })
        cb && cb(pvuv.productRankData);
      } else {
        alert(obj.returnMsg);
      }
    });
  }
};
