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
                tooltipFormatter: '&'
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
                                chartInstance.setOption(option);
                                scope.noData = false;
                                //scope.noData = true;
                            }catch (e){
                                console.error(e.message);
                                chartInstance.hideLoading();
                                chartInstance.clear();
                                scope.noData = true;
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
    template.push('<div><img src="data:image/png;base64,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" height="76" width="101"/> <p style="margin-top: 10px;text-align:center"></p></div>');
    template.push('</div>');
    $templateCache.put('website-ui/chart/no-data.html', template.join(''));
}]);
