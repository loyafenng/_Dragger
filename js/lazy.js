//ng懒加载
app.directive('lazy', ['$window', function($window, $document){
    var win = $window,
        $win = angular.element(win),
        uid = 0,
        elements = {};
    function getUid(el){
        return el.__uid || (el.__uid = '' + ++uid);
    }

    function isVisible(e,preload){
        var pos = e.getBoundingClientRect();
        if (pos.top - document.documentElement.scrollTop - (typeof(preload) == "undefined"?600:preload) <= document.documentElement.clientHeight) {
            return true;
        } else {
            return false;
        }
    }

    function refreshImage(){
        Object.keys(elements).forEach(function(key){
            var obj = elements[key],
                preLoad = obj.$scope.preload,
                scope = obj.$scope
            iElement = obj.iElement;
            if(isVisible(iElement,preLoad)){
                updateImg(iElement,scope,obj);
            }
        });
    }

    $win.bind('touchmove', refreshImage);
    $win.bind('scroll', refreshImage);
    function updateImg(imgEl,scope,obj){
        if((obj && !obj.isLoading) || !obj){
            var img = document.createElement('img');
            var uid = getUid(imgEl);
            var myImg = imgEl;
            imgEl = angular.element(imgEl);
            img.src = imgEl.attr('scsrc');
            obj && (obj.isLoading = true);
            img.onload = function() {
                obj && (obj.isLoading = false);
                setState(scope,'sc');
                imgEl.attr('src', img.src);
                
                // if(!(scope.hasAnimate == "false" || scope.hasAnimate == false)){
                //     //懒加载动画效果
                //     $(myImg).css({
                //         'opacity':'0',
                //         // '-webkit-transition':'opacity 50ms ease-out'
                //     });
                //     setTimeout(function(){
                //         $(myImg).css({
                //             'opacity':'1'
                //         });
                //     },0);
                // }else{
                //     imgEl.attr('src', img.src);
                // }
                
                if(elements.hasOwnProperty(uid)){
                    delete elements[uid];
                }
            }
            img.onerror = function() {
                obj && (obj.isLoading = false);
                imgEl.attr('src', imgEl.attr('ersrc'));
                setState(scope,'er');
            }
        }
    }
    function setState(scope,state){
        if(['sc','df','er'].indexOf(state)==-1){
            console.log('state赋值错误');
            return;
        }
        scope.state = state;
        scope['on'+state] && scope['on'+state]();
        try{
            scope.$parent.$digest();
        }catch(e){
        }
    }
    return {
        restrict: 'A',
        scope: {
            lazy:'@',//boolean 是否开启懒加载
            preload:'@',//预先加载的距离 默认距离是600;暂时没有监听ios的惯性移动。此值请根据页面的长度自行设置（最大惯性移动的距离）
            ersrc:'@',//加载失败替换的图片地址error(请确保ersrc是个不会加载失败的图片)
            dfsrc:'@',//加载成功前的默认占位图片default
            scsrc:'@',//加载成功替换的地址success
            onsc:'&',
            oner:'&',
            ondf:'&',
            hasAnimate:'@'
        },
        link: function($scope, iElement){
            $scope.lazy = ($scope.lazy == "false" || $scope.lazy == false)?false:true;
            $scope.hasAnimate = ($scope.hasAnimate == "false" || $scope.hasAnimate == false)?false:true;
            iElement = iElement[0];
            var uid = getUid(iElement);
            //初始化全部设置为默认图片
            iElement.src = $scope.dfsrc;
            setState($scope,'df');
            $scope.preload = $scope.preload?Number($scope.preload):600;
            var watchid = [];
            watchid[0] = $scope.$watch('dfsrc', function(){
                //当前显示的是默认图片
                if($scope.state == "df"){
                    iElement.src = $scope.dfsrc;
                }else{//当前显示的不是错误图片

                }
            });

            watchid[1] = $scope.$watch('ersrc', function(){
                //当前显示的是错误图片
                if($scope.state == "er"){
                    iElement.src = $scope.ersrc;
                }else{//当前显示的不是错误图片

                }
            });

            watchid[2] = $scope.$watch('scsrc', function(){
                iElement.src = $scope.dfsrc;
                setState($scope,'df');
                if($scope.lazy && !isVisible(iElement,$scope.preload)){//此部分暂时隐藏在可视区域外-->不加载新图片,替换成默认图片

                    //加入touchmove用于检测需要懒加载的数据
                    elements[uid] = {
                        iElement: iElement,
                        $scope: $scope
                    };
                }else{
                    //替换顺序：默认图片->成功图片/失败图片
                    updateImg(iElement,$scope);
                }
            });
            $scope.$on('$destroy', function(){
                if(elements.hasOwnProperty(uid)){
                    delete elements[uid];
                }
                watchid.forEach(function(watch){
                    watch();
                });
            });
        }
    };
}]);