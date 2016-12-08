angular.module('starter.controllers', [])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

.controller("IndexCtrl", function($scope, $state) {})

.controller("LoginCtrl", function($scope, $cordovaOauth, $state, $ionicPlatform) {
  
    $ionicPlatform.ready(function() {
      $scope.facebookKey = window.localStorage.getItem("facebookKey") || null;
      if ($scope.facebookKey) { $state.go("app.profile") };
    })

    $scope.login = function() {
        $cordovaOauth.facebook("1122832721099676", ["email", "user_posts", "user_photos", "user_website", "user_location", "user_relationships", "pages_show_list"]).then(function(result) {
            window.localStorage.setItem("facebookKey", result.access_token);
            $state.go("app.profile");
        }, 
        function(error) { console.log(error) });
    };
})

.controller("ProfileCtrl", function($scope, $http, $state, $ionicPlatform) {

    $scope.init = function() {
      if ($scope.facebookKey) {
        $http.get("https://graph.facebook.com/v2.8/me", { params: { access_token: $scope.facebookKey, fields: "id,name,gender,location,website,picture,relationship_status", format: "json" }}).then(function(result) {
            $scope.profileData = result.data;
        }, 
        function(error) { console.log(error) });

        $http.get("https://graph.facebook.com/v2.8/me/feed", { params: { access_token: $scope.facebookKey, format: "json" }}).then(function(result) {
            $scope.feedData = result.data.data;
            $http.get("https://graph.facebook.com/v2.8/me", { params: { access_token: $scope.facebookKey, fields: "picture", format: "json" }}).then(function(result) {
                $scope.feedData.myPicture = result.data.picture.data.url;
            });
        }, 
        function(error) { console.log(error) });

        $http.get("https://graph.facebook.com/v2.8/me/photos", { params: { access_token: $scope.facebookKey, fields: "source", format: "json" }}).then(function(result) {
            $scope.photos = result.data.data;
        }, 
        function(error) { console.log(error) });
      } 
      else {
        console.log("Not signed in");
        $state.go("app.login");
      }
    };

    $ionicPlatform.ready(function() {
      $scope.facebookKey = window.localStorage.getItem("facebookKey") || null;
      $scope.init();
    })

    $scope.doRefresh = function() {
      $scope.init();
      $scope.$broadcast('scroll.refreshComplete');
    };

    $scope.logout = function() {
      window.localStorage.setItem("facebookKey", null);
      $state.go("app.login");
    };
});
