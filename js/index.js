var app = angular.module('myApp',[]);
app.controller('searchCtrl',['$scope','$http','$timeout',function($scope,$http,$timeout){

    /*定义search搜索框的绑定的数据
    flag标记用来标记模糊框的显示和隐藏
    timer是用来监听用户输入的间隔时间
    */
    $scope.search = null;
    $scope.flag = true;
    $scope.timer = null;

    //点击li列表的时候显示详情信息
    $scope.detail = function (a){
        $('#search').val(a.address+','+a.suburb+','+ a.city);
        //每次执行的时候先清空这个放详细信息的容器
        $('.detail-container').empty();
        $scope.flag = true;
        console.log(a);
        $http.get('http://47.90.23.150/houselist.php?id='+a._id.$id).success(function (data) {
            console.log(data);
            var data = data[0];
            //console.log(data.school_info == undefined)
            var school = null; 
            //判断数据中是否存在学校，如果不存在则给他一个默认的值，如果存在则显示出来
            if(data.school_info == undefined ){
                school = [{school_name:'no school'}];
            }else{
                school = data.school_info[0];
            }
            //在展示详细的div中显示信息并让这个div显示
            $('.detail-container').append($('<p>address:  '+data.address+'</p><p>bathroom:  '+data.bathroom+'</p><p>bedroom:  '+data.bedroom+'</p><p>building_age:  '+data.building_age+'</p><p>road:  '+data.road+'</p><p>issue_date:  '+ data.issue_date +'</p><p>number_owners:  '+ data.number_owners +'</p><p>school_name:  '+ school.school_name  +'</p><p>spatial_extents_shared:  '+ data.spatial_extents_shared +'</p><p>suburb:  '+ data.suburb +'</p><p>railway_name:  '+ data.railway_info +'</p><p>guarantee_status:  '+ data.guarantee_status +'</p><p>house_no:  '+ data.house_no +'</p><p>estate_description:  '+ data.estate_description +'</p><p>city:  '+ data.city +'</p><p>base_point:  '+ data.base_point[0] +'</p><p>base_point:  '+ data.base_point[1] +'</p><p>spatial_extents_shared:  '+ data.spatial_extents_shared +'</p><p>type:  '+ data.type +'</p>'))
            $('.detail-container').show();
            
            //调用初始化地图 传入的是一个经纬度  arr[1]写在前面
            initMap(data.base_point);
        });
    };    
    
    
    //创建地图函数
    function initMap(arr) {
        var map = new google.maps.Map(document.getElementById('mapDetail'), {
            center: {lat: arr[1] , lng:arr[0]},
            zoom: 18
        });
        var marker = new google.maps.Marker({
            position: {lat:arr[1] , lng:arr[0] },
            map: map,
            //在地图中让标记图标跳动
            animation: google.maps.Animation.BOUNCE
        });
    }
    
    //用户输入东西时执行的函数
    $scope.find = function() {
        $('#loading').css({'display': 'block'});
        //如果有延时计时器 则先清楚  并且在下面重新启动一个延时计时器
        if ($scope.timer) {
            $timeout.cancel($scope.timer);
        };
        //如果搜索到的字段不存在 直接跳出函数
		if(!$scope.search){
	    	$scope.flag = true;
	    	$('#loading').css({ 'display': 'none' });
	    	return;
	   };
        //如果用户两秒没有输入东西，判定他现在要进行搜索了 执行ajax请求
        //模糊查询接口'http://47.90.23.150/fuzzysearch.php?address='+$scope.search
        $scope.timer = $timeout(function () {
            $http.get('http://47.90.23.150/fuzzysearch.php?address='+$scope.search).success(function (data) {
                $scope.flag = false;
                console.log(data);
                $('#loading').css({ 'display': 'none' });
                if ( data.length == 0 ) {
                    $( '.info' ).css({ 'display':'none' });
                    $( '.err' ).css({ 'display':'block' });
                } else {
                    $( '.info' ).css({ 'display':'block' });
                    $( '.err' ).css({ 'display':'none' });
                    $scope.houseData = data;
                };
            });
        }, 2000);
    };
}]);