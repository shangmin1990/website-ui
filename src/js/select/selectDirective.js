angular.module('ui.website.select.directives', ['ui.bootstrap.position'])
    .directive('wsSelect',['$compile', '$document', '$uibPosition', '$timeout', function($compile, $document, $uibPosition, $timeout){
        return {
            restrict:'EA',
            replace:true,
            templateUrl:'template/wsSelect.html',
            require: ['ngModel'],
            // templateUrl: 'uib/template/typeahead/typeahead-popup.html',
            scope:{
                options: '=',
                'onSelected': '&',
                config: '@'
            },
            compile: function(ele, attrs, transclude){
                return {
                    pre: angular.noop ,
                    post: function(scope, ele, attrs, ctrls){
                        var ngModelCtrl = ctrls[0];
                        scope.config = scope.config || {};
                        scope.config.displayFieldName = scope.config.displayFieldName || 'key';
                        scope.config.valueFieldName = scope.config.valueFieldName || 'value';
                        var id = uuid();
                        var unparseEle = angular.element('<div ws-select-container></div>');
                        unparseEle.attr({
                            id: id
                        });
                        var selectContainer = $compile(unparseEle)(scope);
                        ele.append(selectContainer);
                        // var position = $uibPosition.position(ele);
                        // console.log(position);
                        $(ele).bind('click', function(evt){
                            evt.stopPropagation();
                            var li = selectContainer.find('li');
                            if(li){
                                var value = ele.find('div').html();
                                li.removeClass('active');
                                angular.forEach(li, function(obj, i){
                                    if($(obj).find('a').html() === value){
                                        $(obj).addClass('active');
                                    }
                                })
                            }
                            selectContainer.show();
                        });
                        $document.bind('click', function (evt) {
                            selectContainer.hide();
                        });

                        // ngModelCtrl

                        scope.$watch('options', function(newValue){
                            if(newValue && newValue.length > 0){
                                $timeout(function(){
                                    var li = selectContainer.find('li');
                                    li.bind('click', function(evt){
                                        evt.stopPropagation();
                                        var self_ = this;
                                        li.removeClass('active');
                                        $(self_).addClass('active');
                                        selectContainer.hide();
                                        selectContainer.css(
                                            'display', 'none'
                                        );
                                        var value = $(self_).find('a').html();
                                        ele.find('div').html(value);

                                        ngModelCtrl.$setViewValue($(self_).attr('value'))
                                        scope.onSelected(value, evt);
                                    })

                                    li.bind('mouseenter', function(evt){
                                        var self_ = this;
                                        li.removeClass('active');
                                        $(self_).addClass('active');
                                    })
                                }, 0)
                            }
                        }, true)

                    }
                }
            }
        }
    }])
    .directive('wsSelectContainer', [function () {
        return {
            restrict: 'EA',
            replace: true,
            templateUrl: 'template/wsSelectContainer.html',
        }
    }])
    .run(['$templateCache', function ($templateCache) {
        var html = [];
        html.push('<div class="pull-left" style="position: relative;">' +
            // '<input type="text" style="border-radius: 4px" class="form-control" >' +
            '<div style="border-radius: 4px" class="form-control" ></div>' +
            '<i class="fa fa-sort" style="position: absolute;right: 5px;top: 0px;height: 100%;padding-top: 10px; transform: scaleX(0.8)"></i></div>');
        $templateCache.put('template/wsSelect.html', html.join(''));

        $templateCache.put("template/wsSelectContainer.html",
            "<ul class=\"dropdown-menu\" style='min-height:100px;max-width: 400px;max-height: 400px;overflow-y: scroll;box-shadow: 0 6px 12px rgba(0,0,0,.175);border: 1px solid #ccc;'>\n" +
            "    <li class=\"ws-select-option\" value='{{option[config.valueFieldName]}}' ng-repeat=\"option in options track by $index\" ng-click=\"onSelected(option.value, $event)\" role=\"option\" >\n" +
            "        <a >{{option[config.displayFieldName]}}</a>" +
            "    </li>\n" +
            "</ul>\n" +
            "");
    }])