/**
 * obj.time = '0.00'
 *  obj.currentPlayDuration = 0;
 *  author:Benjamin
 */
angular.module("website.ui.player",[])
    .controller("MusicPlayerCtrl",['$scope',function($scope){
      $scope.mode = 'order';
      var currentIndex = $scope.currentIndex = 0;
      $scope.volume = 100;
      $scope.autoplay = true;
      $scope.isPlaying = true;
      $scope.list = (function(){return $scope.list;})();
      if(!angular.isArray($scope.list)||$scope.list.length == 0){
        var obj = {};
        obj.url = "";
        obj.title = "";
        obj.artist = '';
        obj.special = '';
        $scope.currentMusic = obj;
      }else{
        $scope.currentMusic = $scope.list[currentIndex];
      }
    }])
    .directive('musicplayer',['$document','MusicPlayerService',function($document,MusicPlayerService){
      var imageRotateInterval;
      var initalRotate = 0;
      function imageRotation(ele){
        //图片转动角度
        imageRotateInterval = setInterval(function(){
          initalRotate += 2;
          if(initalRotate >= 360)
            initalRotate = 0;
          ele.style.cssText = '-webkit-transform:rotate('+initalRotate+'deg);' +
              '-moz-transform:rotate('+initalRotate+'deg);' +
              '-o-transform:rotate('+initalRotate+'deg);' +
              'transform:rotate('+initalRotate+'deg)';
        },50);
      }
      var link = function(scope,ele,attrs,controller){
        var audio = new Audio(scope.currentMusic.url);
        ele.append(audio);
//            audio.src = scope.currentMusic.url;
        //播放进度条
        var duration_progress = $document[0].getElementById('duration');
        //音量
        var volume_progress = $document[0].getElementById('volume');
        //下一首
        var nextSongBtn = $document[0].getElementById('nextSong');
        //播放,暂停
        var playBtn = $document[0].getElementsByName('play');
        //光盘,转动div
        var music_img = $document[0].getElementById('music_img');
        //
        var length = duration_progress.offsetWidth;
        /**
         * 音量进度条绑定事件
         */
        angular.element(volume_progress).on('click',function(evt){
          console.log(evt.offsetX);
          audio.volume = evt.offsetX/this.offsetWidth;
          scope.$apply(function(){
            scope.volume = Math.round(this.volume * 100);
          }.bind(audio));
        });
        /**
         * 下一首
         */
        angular.element(nextSongBtn).on('click',function(evt){
          scope.$apply(function(){
            scope.currentMusic = MusicPlayerService.getNext(scope);
          });
//          scope.currentIndex ++;
        });
        scope.$watch('currentMusic',function(newVaule,oldValue){
          audio.src = newVaule.url;
        });
        /**
         * 播放暂停
         */
        angular.forEach(playBtn,function(ele,i){
          angular.element(ele).on('click',function(evt){
            var isPlaying = true;
            if(audio.paused){
              audio.play();
              imageRotation(music_img);
              isPlaying = true;
            }else{
              audio.pause();
              if(imageRotateInterval){
                clearInterval(imageRotateInterval);
                imageRotateInterval = null;
              }
              isPlaying = false;
            }
            scope.$apply(function(){
              scope.isPlaying = isPlaying;
            })
          });
        });

        /**
         * 音乐加载完毕
         * @param e
         */
        var canPlayThroughHandler = function(e){
          var self_ = this;
          scope.loaded = true;
          var time = this.duration;
          var minute = Math.floor(time/60);
          var second = Math.ceil(time - minute * 60);
          var format_time = minute +':' + second;
          if(typeof scope.volume === 'number'){
            this.volume = scope.volume/100;
          }
          scope.$apply(function(){
            if(typeof scope.volume !== 'number'){
              scope.volume = Math.round(Math.random()*100);
            }
//            scope.currentMusic.time = format_time;
          }.bind(this));
          /**
           * 播放进度条绑定事件
           */
          angular.element(duration_progress).on('click',function(evt){
            console.log(evt.offsetX);
            var x = Math.ceil(evt.offsetX/length*100);
            var duration = time*(evt.offsetX/length);
            self_.currentTime = duration;
            scope.$apply(function(){
              scope.currentMusic.currentPlayDuration = x;
            });
          });

          var timeUpdateHandler = function(e){
            var currentTime = this.currentTime;
            var minute = Math.floor(currentTime/60);
            var second = Math.ceil(currentTime - minute * 60);
            if(second == 60){
              minute ++;
              second = 0;
            }
            var format_time = minute +':' + (second < 10 ? '0' + second : second);
            var time = this.duration;
            var format_currentTime = Math.ceil(currentTime/time*100);
            //如果不加 setTimeout 会报一个error($apply already in progress error)
            setTimeout(function(){
              scope.$apply(function(){
                scope.currentMusic.currentPlayDuration = format_currentTime;
                scope.currentMusic.time = format_time;
              });
            },0);
          };
          /**
           *
           */
          audio.addEventListener('timeupdate',timeUpdateHandler,true);
          var isPlaying = true;
          if(scope.autoplay){
            audio.play();
            isPlaying = true;
            if(!imageRotateInterval){
              imageRotation(music_img);
            }
          }else{
            isPlaying = false
          }
          scope.$apply(function(){
            scope.isPlaying = isPlaying;
          });
          audio.addEventListener('ended',function(){
            scope.$apply(function(){
              scope.currentMusic = MusicPlayerService.getNext(scope);
            });
//            scope.currentIndex ++;
          },true);
        };
        audio.addEventListener('canplaythrough',canPlayThroughHandler,true);
      };

      return {
        'restrict':'E',
        'scope':{
          'list':'='
        },
        controller:'MusicPlayerCtrl',
        compile:function(tElement,tAttrs,translude){
          return link;
        },
        templateUrl: 'template/musicplayer.html',
        replace:true
      }
    }])
    .factory('MusicPlayerService',function(){
        return {
          getNext : function(scope){
            var list = scope.list;
            var mode = scope.mode;
            if(!angular.isArray(list)||list.length == 0){
              return null;
            }
            if(list.length == 1)
              return list[0];
            var length = list.length;
            switch (mode.toLowerCase().trim()){
              case 'random':
                scope.currentIndex = Math.ceil(Math.random()*length) - 1;
                break;
              case 'order':
                scope.currentIndex ++;
                if(scope.currentIndex >=length){
                  scope.currentIndex = 0;
                }
                break;
            }
            return list[scope.currentIndex];
          }
        }
    }).run(['$templateCache',function($templateCache){
      $templateCache.put('template/musicplayer.html','<div class="container" >'+
          '<div class="player-panel">'+
          '<div class="row">'+
            '<div class="col-md-4">'+
              '<div class="music-img" id = "music_img"></div>'+
              '<div ng-class="isPlaying ? \'pause-ab ctrl\' : \'play-ab ctrl\'" name="play"></div></div>'+

            '<div class="col-md-8">'+
              '<div class="">标题:{{currentMusic.title}}</div>'+
              '<div><div class=" ">歌手:{{currentMusic.artist}}</div>'+
                '<div class=" ">专辑:{{currentMusic.special}}</div></div>'+
              '<div><div class="progress duration" id="duration">'+
                  '<div class="progress-bar progress-bar-success" role="progressbar" aria-valuenow="50" aria-valuemin="0" aria-valuemax="100" style="width: {{currentMusic.currentPlayDuration}}%"></div></div>'+
                '<div style="float: left;margin-left:5px;">{{currentMusic.time}}</div>'+
                '<ul style="clear:both;">'+
                  '<li ng-class="isPlaying ? \'pause ctrl\' : \'play ctrl\'" name="play"></li>'+
                  '<li class="ctrl next" id="nextSong"></li>'+
                  '<li class="ctrl ctrl-sm volume"></li>'+
                  '<li>'+
                    '<div class="progress volume-bar" id="volume">'+
                      '<div class="progress-bar progress-bar-success" role="progressbar" aria-valuenow="50" aria-valuemin="0" aria-valuemax="100" style="width: {{volume}}%">'+
                      '</div>'+
                    '</div>'+
                  '</li>'+
                  '<li style="margin-top: 6px;margin-left: 5px;">{{volume}}%</li>'+
                '</ul>'+
              '</div>'+
            '</div>'+
          '</div>'+
          '</div>'+
      '</div>');
    }]);