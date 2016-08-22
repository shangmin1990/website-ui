/**
 * @Author benjamin zhaoyuxiang
 * @Desc echarts main script
 * @Date 2016-04-15
 */
angular.module("ui.website.chart",[])
    .service('ChartService', [function(){
        /**
         * highcharts 类型
         * @type
         * @deprecated 不在支持highcharts类型
         */
        var defaultHighchartOptionsMap = {
            // 平滑曲线图
            pline: {
                chart: {
                    type: 'spline',
                    margin:[30,20,65,20]
                },
                title: {
                    text: ''
                },
                subtitle: {
                    text: ''
                },
                xAxis: {
                    gridLineWidth: 0,
                    //categories: arr_time_key,
                    categories: [],
                    lineColor: '#bababa',
                    type: 'datetime',
                    tickmarkPlacement:'on',
                    labels: {
                        style: { fontSize: '14px'},
                        y:20
                    }
                },
                yAxis: {
                    title: {
                        text: '',
                        style: {
                            color: '#bababa',//颜色
                            fontSize:'14px'  //字体
                        }
                    },
                    lineColor: '#bababa',
                    labels: {
                        enabled:false,
                        style: { fontSize: '14px' }
                    },
                    plotLines: [{
                        value: 0,
                        width: 0,
                        color: '#808080'
                    }],
                    tickPixelInterval: 30,
                    lineWidth: 0,
                    tickWidth: 0,
                    gridLineColor: '#efefef'
                },
                tooltip: {
                    //crosshairs: true,
                    shared: true,
                    valueSuffix: '',
                    borderWidth:1,
                    borderColor: '#8b8b8b',
                    useHTML:true,
                    crosshairs: {
                        width: 1,
                        color: 'gray',
                        dashStyle: 'shortdot'
                    },
                    formatter: function(){
                        return '';
                    }
                },
                plotOptions: {
                    line: {
                        dataLabels: {
                            enabled: false
                        },
                        enableMouseTracking: true,
                        lineColor:"#47a6ff"
                    },
                    series: {
                        marker: {
                            symbol: 'circle'
                        }
                    }
                },
                legend :  {
                    layout: 'horizontal',
                    align: 'center',
                    verticalAlign: 'bottom',
                    borderWidth: 0
                },
                credits : {
                    enabled:false//不显示highCharts版权信息
                },
                series: [{
                    name:'',
                    data: []
                }]
            }
        };

        var defaultEChartOptionsMap = {
            line: {
                title: {
                    text: ''
                },
                tooltip : {
                    trigger: 'axis'
                },
                legend: {
                    data:[]
                },
                toolbox: {
                    show: false
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis : [
                    {
                        type : 'category',
                        boundaryGap : false,
                        data : []
                    }
                ],
                yAxis : [
                    {
                        type : 'value'
                    }
                ],
                series : [

                ]
            },
            bar: {
                "title":{
                    "x":"center"
                },
                "tooltip":{
                    "borderWidth":1,
                    "borderColor":"#8b8b8b",
                    "backgroundColor":"#ffffff",
                    "textStyle":{
                        "color":"#333333"
                    },
                    "trigger":"item",
                    "formatter":"{b} : {c}%"
                },
                "calculable":false,
                "grid":{
                    "borderWidth":0,
                    "x":'3%',
                    "y":20,
                    "y2":50,
                    "width":"94%"
                },
                "xAxis":[
                    {
                        "show":true,
                        "type":"category",
                        "data":[],
                        "splitLine":{
                            "show":true,
                            "lineStyle":{
                                "color":"white",
                                "width":10
                            }
                        },
                        "axisLabel":{
                            "show":true,
                            "interval":"0",
                            "margin":15
                        },
                        "axisLine":{
                            "show":true,
                            "lineStyle":{
                                "color":"#d2d2d2",
                                "width":1
                            }
                        },
                        "axisTick":{
                            "onGap":null,
                            "lineStyle":{
                                "color":"#d2d2d2"
                            }
                        }
                    }
                ],
                "yAxis":[
                    {
                        "type":"value",
                        "show":false
                    }
                ],
                "series":[

                ]
            },
            /**
             * 饼图
             */
            'pie': {
                legend: {
                    orient: 'horizontal',
                    y: 'bottom',
                    data: []
                },
                tooltip : {
                    trigger: 'item',
                    borderWidth:1,
                    borderColor: '#8b8b8b',
                    backgroundColor:"#ffffff",
                    textStyle:{
                        color:'#333333'
                    },
                    formatter: function (params) {
                        var res = params.name + ': '+Number(params.percent).toFixed(1) + '%'
                        return res;
                    }
                },
                //重点参数，去除圆饼图的上下空白圈
                calculable : false,
                series : [
                    {
                        name: '',
                        type: 'pie',
                        //center: ['50%', '45%'],
                        //radius: ['50', '80'],
                        itemStyle: {
                            normal: {
                                label: {
                                    show: false
                                },
                                labelLine: {
                                    show: false
                                }
                            },
                            emphasis: {
                                label: {
                                    show: true,
                                    position: 'center',
                                    textStyle: {
                                        fontSize: '30',
                                        fontWeight: 'bold'
                                    }
                                }
                            }
                        }
                        ,
                        data: []
                    }]
            }
        };

        return {
            getInstance: function(dom, chart, chartType){
                if(!chart){
                    if(chartType == 'echarts'){
                        return echarts.init(dom);
                    } else if(chartType == 'highcharts'){
                        return $(dom).highcharts();
                    }
                } else if(defaultEChartOptionsMap.hasOwnProperty(chart)){
                    return echarts.init(dom);
                }else if(defaultHighchartOptionsMap.hasOwnProperty(chart)){
                    return highcharts.init(dom);
                }
            },
            getOption: function(chart, originalData, style, formatter, config){
                if(!chart){
                    return originalData;
                }
                var option = angular.copy(defaultEChartOptionsMap[chart]);

                if(formatter()){
                    option.tooltip.formatter = formatter();
                }

                var y = originalData.data;
                var x = originalData.category;
                if(config.limit > 0 && x.length > config.limit){
                    x = x.slice(0, config.limit);
                    //y = y.slice(0, config.limit);
                }
                var series = [];
                if(chart == 'bar'){
                    for(var j = 0; j < y.length; j++){
                        var yAxisDatas = [];
                        var perData = y[j];
                        var formatData = [];
                        var seriesItem = {
                            name: '',
                            type: chart,
                            barWidth: 30,
                            data:[]
                        }
                        if(config.limit > 0 && x.length > config.limit){
                            perData = perData.slice(0, config.limit);
                            //y = y.slice(0, config.limit);
                        }
                        for(var i = 0; i < perData.length; i++){
                            var item = {
                                name: x[i],
                                data: perData[i]
                            }
                            formatData.push(item);
                        }
                        // array 浅copy一份
                        var sortForColor = config && config.sortForColor;
                        var color = style && style.color && style.color.length >= y.length && style.color[0].length >= perData.length;
                        if(sortForColor && color){
                            var formatDataCopy = formatData.concat();
                            formatDataCopy.sort(function(a, b){
                                return Number(b.data) - Number(a.data);
                            });
                            for(var i = 0; i < formatDataCopy.length; i++){
                                formatDataCopy[i].color = style.color[j][i];
                            }
                            //formatData = formatDataCopy;
                        }

                        for(var i = 0 ; i < formatData.length; i++){
                            var yAxisDataItem = {
                                "value": formatData[i].data,
                                "name": formatData[i].name,
                                "itemStyle":{
                                    "normal":{
                                        //"color":formatData[i].color,
                                        "label":{
                                            "show":true,
                                            "position":"top",
                                            "formatter":"{c}%",
                                            "textStyle":{
                                                "color":"#37a3fd"
                                            }
                                        },
                                        "labelLine":{
                                            "show":false
                                        }
                                    },
                                    //    ,
                                    "emphasis":{
                                        "label":{
                                            "show":true,
                                            "position":"top",
                                            "formatter":"{c}%",
                                            "textStyle":{
                                                "color":"#37a3fd"
                                            }
                                        }
                                    }
                                }
                            };
                            if(formatData[i].color){
                                yAxisDataItem.itemStyle.normal.color = formatData[i].color;
                            }
                            yAxisDatas.push(yAxisDataItem);
                        }
                        seriesItem.data = yAxisDatas;
                        series.push(seriesItem);
                    }

                    option.series = series;
                    option.xAxis[0].data = originalData.category;
                    if(style.orientation === 'vertical'){
                        var temp = option.yAxis;
                        option.yAxis = xAxis;
                        option.xAxis = temp;
                    }
                    return option;
                }else if(chart == 'line'){
                    for(var j = 0; j < y.length; j++){
                        var yAxisDatas = [];
                        var perData = y[j];
                        var formatData = [];
                        var seriesItem = {
                            name: '',
                            type: chart,
                            data:[]
                        }

                        for(var i = 0; i < perData.length; i++){
                            var item = {
                                name: x[i],
                                data: perData[i]
                            }
                            formatData.push(item);
                        }

                        for(var i = 0 ; i < formatData.length; i++){
                            var yAxisDataItem = {
                                "value": formatData[i].data,
                                "name": formatData[i].name
                                //"itemStyle":{
                                //    "normal":{
                                //        "label":{
                                //            "show":true,
                                //            "position":"top",
                                //            "formatter":"{c}%",
                                //            "textStyle":{
                                //                "color":"#37a3fd"
                                //            }
                                //        },
                                //        "labelLine":{
                                //            "show":false
                                //        }
                                //    },
                                //    //    ,
                                //    "emphasis":{
                                //        "label":{
                                //            "show":true,
                                //            "position":"top",
                                //            "formatter":"{c}%",
                                //            "textStyle":{
                                //                "color":"#37a3fd"
                                //            }
                                //        }
                                //    }
                                //}
                            };
                            yAxisDatas.push(yAxisDataItem);
                        }
                        if(style && style.color && style.color.length >= y.length){
                            var itemStyle = {
                                "normal":{
                                    color: style.color[j],
                                }
                            };
                            seriesItem.lineStyle = itemStyle;
                        }
                        seriesItem.data = yAxisDatas;
                        series.push(seriesItem);
                    }

                    option.series = series;
                    option.xAxis[0].data = originalData.category;
                    return option;
                }else if (chart == 'pie'){

                    for(var j =0 ; j< y.length; j++){
                        var yAxisDatas = [];
                        var yDataItem = y[j];
                        if(!yDataItem || yDataItem.length != x.length){
                            throw new Error('Data error, check your data please');
                        }
                        for(var i = 0 ; i < x.length; i++){
                            var yAxisDataItem = {
                                name: x[i],
                                value: y[j][i],
                                itemStyle: {
                                    normal: {
                                        //color: style.color[i % style.color.length]
                                    },
                                    emphasis: {
                                        label: {
                                            show:false
                                        }
                                    }
                                }
                            };
                            if(style.color && style.color.length >= y.length && style.color[0].length >= x.length){
                                yAxisDataItem.itemStyle.normal.color = style.color[j][i];
                            }
                            yAxisDatas.push(yAxisDataItem);
                        }
                        option.series[j].data = yAxisDatas;
                        option.legend.data = originalData.category;
                        if(style && style.center && style.center.length >= y.length){
                            option.series[j].center = style.center[j];
                        }
                        if(style && style.radius && style.radius.length >= y.length){
                            option.series[j].radius = style.radius[j];
                        }
                        return option;
                    }
                }
            }
        }
    }])
    .directive('chart', ['ChartService', function(ChartService){
        var defaultConfig = {
            // 是否显示loading画面
            showLoading: true,
            // 是否按照颜色值排序
            sortForColor: false,
            // 是否限制显示
            limit: -1,
            // 没有数据时的提示
            noDataTemplateUrl: 'templates/echarts/no-data.html'
        };
        // 默认的样式
        var defaultStyle = {

            bar: {
                //color: ["#03a7e5","#03a7e5","#1db5ee","#1db5ee","#42ccff","#42ccff","#7ddcff","#7ddcff","#a6e7ff","#a6e7ff","#a6e7ff"],
                orientation: 'horizontal'
            },
            pie: {
                //color: ["#42ccff", "#fbd444"]
            }
        }
        return {
            restrict: 'A',
            scope: {
                // 何种类型的图表 bar line pie or 自定义option
                chart: '@',
                // echarts HightCharts
                //chartType: '@',
                config: '@',
                // 数据 格式: {category:[], data:[[],[],[]]}
                chartData: '=data',
                eventType: '@',
                eventHandler: '&',
                chartStyle: '@',
                tooltipFormatter: '&',
                // 更新数据时, legend没有更新,setOption(o, true);
                // @ http://echarts.baidu.com/api.html#echartsInstance.setOption
                updateNotMerge: '@'
            },
            templateUrl: 'website-ui/chart/no-data.html',
            replace: false,
            compile: function(templateEle, templateAttrs){
                return function(scope, ele, attrs, ctrls){
                    //console.log(scope)
                    var computedStyle = window.getComputedStyle(ele[0]);
                    var height = computedStyle.getPropertyValue('height')
                    //没有设置height高度
                    if(height == '0px'){
                        ele.css({
                            height: '200px'
                        });
                    }
                    var config_ = {};
                    var style_ = {};
                    try{
                        if(scope.config){
                            config_ = JSON.parse(scope.config);
                        }
                        if(scope.chartStyle){
                            style_ = JSON.parse(scope.chartStyle);
                        }

                    } catch (e){

                    }
                    var config = angular.extend({}, defaultConfig, config_);
                    var style = defaultStyle[scope.chart];
                    var style_extend = angular.extend({}, style, style_);
                    var chartType = 'echarts';
                    //if(attrs.hasOwnProperty('echarts')){
                    //    chartType = 'echarts';
                    //}

                    function echartsInit(){
                        var chart_dom = ele.find('div').find('div')[0];
                        //alert(chart_dom.id);
                        var chartInstance = ChartService.getInstance(chart_dom, scope.chart, chartType);
                        if(scope.eventType && scope.eventHandler){
                            chartInstance.on(scope.eventType, function(param){
                                scope.eventHandler()(param);
                                //alert('a');
                            });
                            console.log('绑定事件成功');
                        }
                        scope.$on('chart:resize', function(){
                            chartInstance.resize();
                        });
                        if(config.showLoading){
                            chartInstance.showLoading();
                        }
                        scope.$on('chart:loading', function(){
                            scope.noData = false;
                            chartInstance.showLoading();
                        });
                        return chartInstance;
                    }
                    var chartInstance = echartsInit();
                    scope.$watch('chartData', function(newValue, oldValue){
                        if(newValue !== undefined){
                            if(newValue == 'chart:loading'){
                                scope.noData = false;
                                chartInstance.showLoading();
                                return;
                            }
                            try{
                                var option = ChartService.getOption(scope.chart, newValue, style_extend, scope.tooltipFormatter, config);
                                chartInstance.hideLoading();
                                var updateNotMerge = false;
                                if(scope.updateNotMerge === 'true'){
                                    updateNotMerge = true;
                                }
                                chartInstance.setOption(option, updateNotMerge);
                                scope.noData = false;
                                //scope.noData = true;
                            }catch (e){
                                console.error(e.message);
                                chartInstance.hideLoading();
                                scope.noData = true;
                                chartInstance = echartsInit();
                            }
                        }
                    });
                }
            }
        }
}]).run(['$templateCache', function($templateCache){
    var template = [];
    template.push('<div style="position: relative;height: 100%;">');
    template.push('<div style="height: 100%; width: 100%;"></div>');
    template.push('<div id="nodata_container" ng-if="noData" style="height: 100%; width: 100%; position: absolute; left: 0;top: 0;display: flex;align-items: center;justify-content: center">');
    template.push('<div><img src="data:image/png;base64,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" height="77" width="101"/> <p style="margin-top: 10px;text-align:center"></p></div>');
    template.push('</div>');
    $templateCache.put('website-ui/chart/no-data.html', template.join(''));
}]);
