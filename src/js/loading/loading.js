angular.module('ui.website.loading', [])
    .factory('LoadingService', ['$rootScope', '$document', '$compile', '$timeout', function($rootScope, $document, $compile, $timeout){
        return {
            show: function (elementId, imageSrc) {
                var ele = $document.find('#' + elementId);
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
                    $timeout(function () {
                        loadingEle.find('div').show();
                    }, 0)
                    return loadingEle.attr('id');
                } else {
                    console.error("LoadingService : no element found!!!")
                }
            },
            hide: function (elementId) {
                var ele = $document.find('#' + elementId);
                var loadingEle = ele.find('ws-loading');
                loadingEle.remove();
            }
        }
    }])
    .directive('wsLoading', ['$timeout', '$rootScope', function($timeout, $rootScope){
        function link(scope, ele, attr, ctrl) {
            scope.status = 'loading';
            $rootScope.$on('$wsLoading:loadSuccess', function (evt, id) {
                scope.status = 'success';
                if(ele.attr('id') == id){
                    ele.remove();
                }
            });

            $rootScope.$on('$wsLoading:loadError', function (evt, id) {
                scope.status = 'error';
                if(ele.attr('id') == id){
                    ele.remove();
                }
            });

            $rootScope.$on('$wsLoading:loadNoData', function (evt, id) {
                scope.status = 'noData';
                if(ele.attr('id') == id){
                    ele.remove();
                }
            });
        }

        return {
            restrict:'EA',
            transclude: true,
            templateUrl:'template/ws-loading.html',
            scope:{
                loadingImg: '@',
                noDataImg: '@',
                loadErrorImg: '@'
            },
            compile: function (ele, attrs, transclude) {
                $timeout(function () {
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
                        width: width + 'px',
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