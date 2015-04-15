website-ui [![Build Status](https://travis-ci.org/shangmin1990/website-ui.svg?branch=master)](https://travis-ci.org/shangmin1990/website-ui)
================
angular.module('moduleName',['ui.website'])

DialogService
   method:
   //TODO toast(content, [,title])未实现
   alert(content [,title]) content为要展现的内容,title默认值为警告.
   confirm(content, successCallback [,title]); content为要展现的内容,title默认值为请确认.
   prompt(callback [,title]) callback会有一个参数(input)代表输入框的值,自己实现判断逻辑并返回true或false title默认为请输入

directive:
  <musicplayer list="abc"></musicplayer> abc为scope上的一个属性,代表播放器的播放列表,内容格式如下
  [{
  title:'xxx',
  artist:"筷子兄弟";
  url: 'http://cc.stream.qqmusic.qq.com/C1000035GveV3i9dBM.m4a?fromtag=52';
  special: 'xxx主题曲';
  },...]
