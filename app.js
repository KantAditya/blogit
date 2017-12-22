var app = angular.module('myApp', ['ui.router']);

app.config(function($stateProvider, $urlRouterProvider, $locationProvider){
    Stamplay.init("blogit1997");
    localStorage.removeItem('http://127.0.0.1:8080-jwt');
    $locationProvider.hashPrefix('');
    $stateProvider
        .state('home',{
            url: '/',
            templateUrl : 'templates/home.html',
            controller : "HomeCtrl"
        })
        .state('login',{
            url: '/login',
            templateUrl : 'templates/login.html',
            controller : "LoginCtrl"
        })
        .state('signup',{
            url: '/signup',
            templateUrl : 'templates/signup.html',
            controller : "SignUpCtrl"
        })
        .state('weather',{
            url: '/weather',
            templateUrl : 'templates/weather.html',
            controller : "WeatherCtrl"
        })
        .state('MyBlogs',{
            url: '/myBlogs',
            templateUrl: 'templates/myBlogs.html',
            controller: 'MyBlogCtrl'
        });
        $urlRouterProvider.otherwise("/");
        
});

app.run(function($rootScope){
    Stamplay.User.currentUser()
    .then(function(res){
        if(res.user){
            $rootScope.loggedIn = true;
            console.log($rootScope.loggedIn);
        }
        else{
            $rootScope.loggedIn = false;
            console.log($rootScope.loggedIn);
        }
    }, function(err){
        console.log("An error occured while getting current user!");
        
    });
});

app.controller('HomeCtrl', function($scope){
});
app.controller('LoginCtrl', function($scope, $state, $timeout, $rootScope){
    $scope.login = function(){
        Stamplay.User.currentUser()
        .then(function(res){
            console.log(res);
            if(res.User){
                $rootScope.loggedIn = true;
                $rootScope.displayName=res.user.firstName+" "+res.user.lastName;
                // User already logged in
                $timeout(function(){
                    $state.go('MyBlogs');
                }); 
            }
            else{
                //proceed with login
                Stamplay.User.login($scope.user)
                .then(function(res){
                    console.log(res);
                    $rootScope.loggedIn = true;
                    $rootScope.displayName=res.user.firstName+" "+res.user.lastName;
                    $timeout(function(){
                        $state.go('MyBlogs');
                    });
                },function(err){
                    console.log(err);
                    $rootScope.loggedIn = false;
                }
                );
            }
        }, function(error){
            console.log(error);
        });
    }
});
app.controller('WeatherCtrl', function($scope, $http){
    var API_KEY="6710049c710e9a628bc5f184405eff40";
    $http.get("http://openweathermap.org/find?q=new+delhi&appid:"+API_KEY).then(success, failure);
    function success(responce){
        console.log(response);
        $scope.weatherData=response.data;
    }
    function failure(err){
        console.log(err);
    }
});
app.controller('SignUpCtrl', function($scope){
    $scope.newUser = {};
    $scope.signup = function(){
        if($scope.newUser.firstName && $scope.newUser.lastName && $scope.newUser.email && $scope.newUser.password && $scope.newUser.confirmPassword){
            console.log("All fields are valid");
            if($scope.newUser.password==$scope.newUser.confirmPassword){
                console.log("All good! Let's sign up");
                Stamplay.User.signup($scope.newUser)
                .then(function(responce){
                    console.log(responce);
                }, function(error){
                    console.log(error);
                }
                );
            }
            else{
                console.log("password do not match!");
            }
        }
        else{
            console.log("Some fields are Invalid!");
        }
    }
});
app.controller('MyBlogsCtrl', function($scope){

});
app.controller('MainCtrl', function($scope, $rootScope, $timeout){
    $scope.logout = function(){
        console.log("logout called");
        localStorage.removeItem('http://127.0.0.1:8080-jwt');
        //Stamplay.User.logout(true, function(){
            console.log("logged out!");
            $timeout(function(){
                $rootScope.loggedIn = false;
            })
        //});
    }
})