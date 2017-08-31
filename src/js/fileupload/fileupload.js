angular.module('ui.website.fileupload', [])
.directive('fileUpload', ['$http', function ($http) {
    return {
        restrict: 'EA',
        scope: {
            url: '@',
            success: '&',
            multiple: '@',
            failure: '&'
        },
        templateUrl: 'template/fileupload.html',
        link: function(scope, ele, attrs, ctrls){
            var files = ele.find('input')[0].files;
            $http({
                method:'POST',
                url: scope.url,
                headers: {
                    'Content-Type': undefined
                },
                data: files,
                transformRequest: function (data, headersGetter) {
                    var formData = new FormData();
                    angular.forEach(data, function (value, key) {
                        formData.append(key, value);
                    });
                    return formData;
                }
            }).then(function(res){
                if(res.status == 200){
                    var data = res.data.data;
                    // var images = [];
                    // angular.forEach(data, function(value, index, context){
                    //     images.push(value.url);
                    // });
                    // $scope.ad.images = images;
                    // $scope.ad.category_id = $scope.childMenu;
                    // return $http.put('/ad/admin/ad/add1', $scope.ad);
                    scope.success(res.data.data);
                } else {
                    swal('文件上传失败,错误码为:', res.error.error_code + ', 错误原因:'+res.error.errorMsg);
                    scope.failure(error);
                }
            })
        }
    }
}]).run(['$templateCache', function ($templateCache) {
    var html = [];
    html.push('<div>');
    html.push('<input class="form-control" style="width: 250px" type="file"/>')
    // html.push('')
    html.push('</div>');
    $templateCache.put('template/fileupload.html', html.join(''));
}]);