angular.module('ui.website.dialog.directives', [])
    .directive('walert',['$timeout', function($timeout){
        return {
            restrict:'EA',
            transclude: true,
//        replace:true,
            templateUrl:'template/alert.html',
            compile: function(ele, attrs, transclude){
                function hide(){
                    ele.children().removeClass('in');
                    //为什么需要timeout 如果直接hide则没有动画效果 保持跟动画的效果一样多的延时
                    //TODO 需要改进
                    $timeout(function(){
                        ele.hide();
                    },150)
                };
                ele.show();
                return {
                    pre: angular.noop ,
                    post: function(scope, ele, attrs, ctrls){
                        ele.find('div.modal-footer').find('button').unbind('click').bind('click', function(evt){
                            hide();
                        });
                        ele.find('button.close').unbind('click').bind('click', function(evt){
                            hide();
                        });
                        //需要改动。
//              ele.children().addClass('in');
                        // 为什么需要timeout 理由同上
                        //TODO 需要改进
                        $timeout(function(){
                            ele.children().addClass('in');
                        },0);

                    }
                }
            }
        }
    }])
    .directive('wconfirm',['$timeout', function($timeout){
        return {
            restrict:'EA',
            transclude: true,
//        replace:true,
            templateUrl:'template/confirm.html',
            compile: function(ele, attrs, transclude){
                function hide(){
                    ele.children().removeClass('in');
                    //为什么需要timeout 如果直接hide则没有动画效果 保持跟动画的效果一样多的延时
                    //TODO 需要改进
                    $timeout(function(){
                        ele.hide();
                    },150)
                };
                ele.show();
                return {
                    pre: angular.noop ,
                    post: function(scope, ele, attrs, ctrls){
                        var children = ele.find('div.modal-footer').find('button');
                        angular.element(children[0])
                            .unbind('click')
                            .bind('click', function(evt){
//                    alert('我是success回调啊');
                                scope.ok();
                                hide();
                            });
                        angular.element(children[1])
                            .unbind('click')
                            .bind('click', function(evt){
                                hide();
                            });
                        ele.find('button.close').unbind('click').bind('click', function(evt){
                            hide();
                        });
                        //需要改动。
//              ele.children().addClass('in');
                        // 为什么需要timeout 理由同上
                        //TODO 需要改进
                        $timeout(function(){
                            ele.children().addClass('in');
                        },0);

                    }
                }
            }
        }
    }])
    .directive('wprompt',['$timeout', function($timeout){
        return {
            restrict:'EA',
            transclude: true,
//        replace:true,
            templateUrl:'template/confirm.html',
            compile: function(ele, attrs, transclude){
                function link(scope, ele, attrs, ctrls){
//        var self_ = this;
                    var children = ele.find('div.modal-footer').find('button');
                    angular.element(children[0])
                        .unbind('click')
                        .bind('click', function(evt){
                            if(!scope.option.ajax){
                                var result = scope.option.callback(ele.find('input').val());
                                if((typeof result === 'boolean' && result) || result === 1){
                                    hide();
                                }else{
                                    ele.find('input').parent().addClass('has-error').addClass('has-feedback');
                                }
                            }else{
                                scope.option.callback(ele.find('input').val(), function(data){
                                    if(scope.option.success){
                                        scope.option.success(data);
                                    }
                                    hide();
                                }, function(status){
                                    if(scope.option.error){
                                        scope.option.error(status);
                                    }
                                });
                            }
//                  hide();
                        });
                    angular.element(children[1])
                        .unbind('click')
                        .bind('click', function(evt){
                            hide();
                        });
                    ele.find('button.close').unbind('click').bind('click', function(evt){
                        hide();
                    });
                    $timeout(function(){
                        ele.children().addClass('in');
                    },0);
                }
                function hide(){
                    ele.children().removeClass('in');
                    //为什么需要timeout 如果直接hide则没有动画效果 保持跟动画的效果一样多的延时
                    //TODO 需要改进
                    $timeout(function(){
                        ele.hide();
                    },150);
                };
                ele.show();
                return link;
            }
        }
    }])
    .directive('dialog', ['$timeout', '$http', function($timeout, $http){
        return {
            restrict:'EA',
            transclude: true,
            templateUrl:'template/dialog.html',
            compile: function(ele, attrs, transclude, ctrls){
                ele.show();
                ele[0].style.display = 'block';
                ele.children().addClass('in');
            }
        }
    }])
    .run(['$templateCache', function($templateCache){
        $templateCache.put('template/alert.html',
            '<div class="modal fade" style="display:block;">'+
            '<div class="modal-dialog modal-sm">'+
            '<div class="modal-content">'+
            '<div class="modal-header">'+
            '<div class="row">'+
            '<div class="col-md-9 col-lg-9">{{title}}</div>'+
            '<div class="col-md-3 col-lg-3">'+
            '<button type="button" class="close">'+
            '<span>×</span>'+
            '</button>'+
            '</div>'+
            '</div>'+
            '</div>'+
            '<div class="modal-body text-center">'+
            '<p>'+
            '<div ng-transclude></div>'+
            '</p>'+
            '</div>'+
            '<div class="modal-footer">'+
            '<button type="button" class="btn btn-primary">确定</button>'+
            '</div>'+
            '</div>'+
            '</div>'+
            '</div>'+
            '<div class="modal-backdrop fade"></div>'
        );
        $templateCache.put('template/confirm.html',
            '<div class="modal fade" style="display:block;">'+
            '<div class="modal-dialog modal-sm">'+
            '<div class="modal-content">'+
            '<div class="modal-header">'+
            '<div class="row">'+
            '<div class="col-md-9 col-lg-9">{{title}}</div>'+
            '<div class="col-md-3 col-lg-3">'+
            '<button type="button" class="close">'+
            '<span>×</span>'+
            '</button>'+
            '</div>'+
            '</div>'+
            '</div>'+
            '<div class="modal-body text-center">'+
            '<p>'+
            '<div ng-transclude></div>'+
            '</p>'+
            '</div>'+
            '<div class="modal-footer">'+
            ' <button type="button" class="btn btn-primary">是</button>'+
            ' <button type="button" class="btn btn-danger" >否</button>'+
            '</div>'+
            '</div>'+
            '</div>'+
            '</div>'+
            '<div class="modal-backdrop fade"></div>');

        $templateCache.put('template/dialog.html',
            '<div class="modal fade" style="display:block;">'+
            '<div class="modal-dialog" style="width:100px; padding:0 50px">'+
            '<div class="modal-content">'+
            '<div ng-transclude></div>'+
            // '<div class="modal-header">'+
            // '<div class="row">'+
            // '<div class="col-md-9 col-lg-9">{{title}}</div>'+
            // '<div class="col-md-3 col-lg-3">'+
            // '<button type="button" class="close">'+
            // '<span>×</span>'+
            // '</button>'+
            // '</div>'+
            // '</div>'+
            // '</div>'+
            // '<div class="modal-body text-center">'+
            // '<p>'+
            // '<div ng-transclude></div>'+
            // '</p>'+
            // '</div>'+
            // '<div class="modal-footer">'+
            // '<button type="button" class="btn btn-primary">确定</button>'+
            // '</div>'+
            '</div>'+
            '</div>'+
            '</div>'+
            '<div class="modal-backdrop fade"></div>'
        );
//      $templateCache.put('template/prompt.html',
//              '<div class="modal fade" style="display:block;">'+
//              '<div class="modal-dialog modal-sm">'+
//              '<div class="modal-content">'+
//              '<div class="modal-header">'+
//              '<div class="row">'+
//              '<div class="col-md-9 col-lg-9">{{title}}</div>'+
//              '<div class="col-md-3 col-lg-3">'+
//              '<button type="button" class="close">'+
//              '<span>×</span>'+
//              '</button>'+
//              '</div>'+
//              '</div>'+
//              '</div>'+
//              '<div class="modal-body text-center">'+
//              '<p>'+
//              '<div ng-transclude></div>'+
//              '</p>'+
//              '</div>'+
//              '<div class="modal-footer">'+
//              ' <button type="button" class="btn btn-orz">是</button>'+
//              ' <button type="button" class="btn btn-default btn-large" >否</button>'+
//              '</div>'+
//              '</div>'+
//              '</div>'+
//              '</div>'+
//              '<div class="modal-backdrop fade"></div>');
    }]);