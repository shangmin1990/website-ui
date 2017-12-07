angular.module('ui.website.loading', [])
    .factory('LoadingService', ['$rootScope', '$document', '$compile', '$timeout', function($rootScope, $document, $compile, $timeout){
        return {
            show: function (elementId, imageSrc) {
                var ele = $document.find('#' + elementId);
                this.showUseElement(ele);
            },
            showUseElement: function (ele, imageSrc) {
                if (ele.length > 0){
                    var loadingEle = ele.find('ws-loading');
                    if (loadingEle.length == 0){
                        var id = uuid();
                        var loadingDirective = angular.element('<ws-loading loading-img="'+imageSrc+'"></ws-loading>');
                        loadingDirective.attr('id', id);
                        ele.prepend(loadingDirective);
                        var scope = $rootScope.$new(true);
                        loadingEle = $compile(loadingDirective)(scope);
                    }

                    this.initSize(loadingEle);
                    $(ele.children()[1]).hide();

                    $timeout(function () {
                        loadingEle.show();
                        loadingEle.find('div').show();
                    }, 0)
                    return loadingEle.attr('id');
                } else {
                    console.error("LoadingService : no element found!!!")
                }
            },
            hide: function (elementId) {
                var ele = $document.find('#' + elementId);
                this.hideUseElement(ele);
            },
            hideUseElement: function (ele) {
                var loadingEle = ele.find('ws-loading');
                loadingEle.hide();
                $(ele.children()[1]).show();
            },
            initSize: function (ele) {
                var parent = ele.parent();
                var width = parent.width();
                var minHeight = 100;
                var height = parent.height() >= minHeight ? parent.height(): minHeight;
                var children = ele.children();
                $(children[0]).css({
                    height: height + 'px',
                    width: width + 'px'
                });
                ele.css({
                    height: height + 'px',
                    width: width + 'px'
                });
            }
        }
    }])
    .directive('wsLoading', ['$timeout', '$rootScope', 'LoadingService', function($timeout, $rootScope, LoadingService){
        function link(scope, ele, attr, ctrl) {

            scope.status = 'loading';

            scope.$watch('promise.$$state.status', function (newValue, oldValue) {
                if (newValue !== undefined){
                    if (newValue === 0){
                        LoadingService.showUseElement(ele.parent(), scope.loadingImg);
                    } else {
                        LoadingService.hideUseElement(ele.parent(), scope.loadingImg);
                    }
                }
            });

            // $rootScope.$on('$wsLoading:loadSuccess', function (evt, id) {
            //     scope.status = 'success';
            //     if(ele.attr('id') == id){
            //         ele.remove();
            //     }
            // });
            //
            // $rootScope.$on('$wsLoading:loadError', function (evt, id) {
            //     scope.status = 'error';
            //     if(ele.attr('id') == id){
            //         ele.remove();
            //     }
            // });
            //
            // $rootScope.$on('$wsLoading:loadNoData', function (evt, id) {
            //     scope.status = 'noData';
            //     if(ele.attr('id') == id){
            //         ele.remove();
            //     }
            // });
        }

        return {
            restrict:'EA',
            transclude: true,
            templateUrl:'template/ws-loading.html',
            scope:{
                loadingImg: '@',
                noDataImg: '@',
                loadErrorImg: '@',
                promise: '='
            },
            compile: function (ele, attrs, transclude) {
                $timeout(function () {
                    LoadingService.initSize(ele);
                    ele.css({
                        position: 'absolute',
                        'zIndex': 101,
                        background: '#fff'
                    });
                }, 0);
                return link;
            }
        }
    }])
    .run(['$templateCache', function($templateCache){
        var html = [];
        html.push('<div style="position: relative; display: none"><div style="display:inline-block;position:absolute; top:50%; left:50%; transform: translate(-50%, -50%);" >');
        html.push('<img ng-if="status == \'loading\'" ng-src="{{$parent.loadingImg}}"/>')
        html.push('<img ng-if="status == \'success\'" ng-src="{{$parent.successImg}}"/>')
        html.push('<img ng-if="status == \'error\'" ng-src="{{$parent.errorImg}}"/>')
        html.push('<img ng-if="status == \'noData\'" ng-src="{{$parent.noDataImg}}"/>')
        html.push('</div>')
        html.push('</div>');
        $templateCache.put('template/ws-loading.html', html.join(''));
    }]);