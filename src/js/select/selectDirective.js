angular.module('ui.website.select.directives', ['ui.bootstrap.position'])
    .directive('wsSelect',['$compile', '$document', '$uibPosition', '$timeout', function($compile, $document, $uibPosition, $timeout){
        return {
            restrict:'EA',
            replace:true,
            templateUrl:'template/wsSelect.html',
            require: ['ngModel'],
            transclude: true,
            // templateUrl: 'uib/template/typeahead/typeahead-popup.html',
            scope:{
                options: '=?',
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
                        $timeout(function(){
                            scope.containerStyle = {
                                width: ele.width() + 'px'
                            }
                        }, 0)

                        ele.append(selectContainer);
                        // var position = $uibPosition.position(ele);
                        // console.log(position);
                        $(ele).bind('click', function(evt){
                            evt.stopPropagation();
                            var li = selectContainer.find('li');
                            if(li){
                                var value = ngModelCtrl.$modelValue;
                                li.removeClass('active');
                                angular.forEach(li, function(obj, i){
                                    if($(obj).attr('value') === value){
                                        $(obj).addClass('active');
                                        scope.currentSelected = ngModelCtrl.$modelValue;
                                    }
                                })
                            }
                            selectContainer.show();
                        });
                        $document.bind('click', function (evt) {
                            selectContainer.hide();
                        });

                        function render() {
                            console.log('ngModel value changed!!!');
                            var value = ngModelCtrl.$modelValue;
                            scope.currentSelected = ngModelCtrl.$modelValue;
                            angular.forEach(scope.options, function(obj){
                                if(obj[scope.config.valueFieldName] === value){
                                    ele.find('div').html(obj[scope.config.displayFieldName]);
                                }
                            })
                            var li = selectContainer.find('li');
                            if(li){
                                li.removeClass('active');
                                angular.forEach(li, function(obj, i){
                                    if($(obj).attr('value') === value){
                                        $(obj).addClass('active');
                                    }
                                })
                            }
                        };

                        ngModelCtrl.$render = render;
                        scope.$watch('options', function(newValue){
                            if(newValue && newValue.length > 0){
                                var value = ngModelCtrl.$modelValue;
                                if(value){
                                    angular.forEach(newValue, function(obj){
                                        if(obj[scope.config.valueFieldName] === value){
                                            ele.find('div').html(obj[scope.config.displayFieldName]);
                                        }
                                    })
                                }
                                $timeout(function(){

                                    var li = selectContainer.find('li');

                                    li.bind('click', onOptionSelected);

                                    function onOptionSelected(evt){
                                        var self_ = this;
                                        scope.$evalAsync(function () {
                                            onOptionSelectedInner(self_, evt);
                                        })
                                    }

                                    var onOptionSelectedInner = function(self_, evt){
                                        evt.stopPropagation();
                                        li.removeClass('active');
                                        $(self_).addClass('active');
                                        selectContainer.hide();
                                        selectContainer.css(
                                            'display', 'none'
                                        );
                                        var display = $(self_).find('a').find('span').html();
                                        ele.find('div').html(display);
                                        var optionValue = $(self_).attr('value');
                                        ngModelCtrl.$setViewValue(optionValue);
                                        scope.currentSelected = optionValue;
                                        scope.onSelected(value, evt);
                                        console.log('changed: ', display, optionValue);
                                    }


                                    scope.clickCallback = function(value, evt){
                                        //TODO 代码要重写
                                        var target = evt.target;
                                        if(target.tagName.toLowerCase() == 'a'){
                                            target = $(target).parent();
                                        }
                                        var li = target, self_ = target;
                                        evt.stopPropagation();
                                        li.removeClass('active');
                                        $(self_).addClass('active');
                                        selectContainer.hide();
                                        selectContainer.css(
                                            'display', 'none'
                                        );
                                        var display = $(self_).find('a').find('span').html();
                                        ele.find('div').html(display);
                                        var optionValue = $(self_).attr('value');
                                        ngModelCtrl.$setViewValue(optionValue);
                                        scope.currentSelected = optionValue;
                                        scope.onSelected(value, evt);
                                        console.log('changed: ', display, optionValue);

                                    }
                                    li.bind('mouseenter', function(evt){
                                        var self_ = this;
                                        li.removeClass('active');
                                        $(self_).addClass('active');
                                    })
                                }, 0)
                            }
                        }, true);

                        if(attrs.options === undefined){
                            var options = ele.find('option');
                            if(options.length == 0){
                                throw new Error('options参数没有设置,并且没有找到option元素!!!')
                            }
                            console.log("use option html, options size:" + options.length);
                            var optionsArr = [];
                            angular.forEach(options, function(optionEle, i){
                                var optionItem = {};
                                optionItem[scope.config.displayFieldName] = $(optionEle).attr("value");
                                optionItem[scope.config.valueFieldName] = $(optionEle).html();
                                optionsArr.push(optionItem);
                            })
                            scope.options = optionsArr;
                        }
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
        html.push('<div style="position: relative;">' +
            // '<input type="text" style="border-radius: 4px" class="form-control" >' +
            '<div style="border-radius: 4px" class="form-control" ></div>' +
            '<i class="fa fa-sort" style="position: absolute;right: 5px;top: 0px;height: 100%;padding-top: 10px; transform: scaleX(0.8)"></i>' +
            '<div role="options" style="display: none" ng-transclude></div>'+
            '</div>');
        $templateCache.put('template/wsSelect.html', html.join(''));

        // ng-click=\"clickCallback(option.value, $event)\"
        $templateCache.put("template/wsSelectContainer.html",
            "<ul class=\"dropdown-menu\" ng-style='containerStyle' style='max-width: 800px;max-height: 400px;overflow-y: scroll;box-shadow: 0 6px 12px rgba(0,0,0,.175);border: 1px solid #ccc;'>\n" +
            "    <li class=\"ws-select-option\" value='{{option[config.valueFieldName]}}' ng-repeat=\"option in options track by $index\"  role=\"option\" >\n" +
            "        <a style='padding-left: 5px'><i style='margin-right: 5px;visibility: {{option[config.valueFieldName] == currentSelected ? \"visible\" : \"hidden\"}}' class='fa fa-check'></i><span>{{option[config.displayFieldName]}}</span></a>" +
            "    </li>\n" +
            "</ul>\n" +
            "");
    }])