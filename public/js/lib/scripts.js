(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
angular.module('BlogApp', ['ngMaterial', 'ui.router', 'ngResource']);

angular.module('BlogApp').config(function($mdThemingProvider) {
  return $mdThemingProvider.theme('default').primaryPalette('teal').accentPalette('cyan').warnPalette('light-green');
});

require('./services/authService');

require('./controllers/main/home');

require('./controllers/admin/adminLogin');

require('./controllers/admin/adminDashboard');

require('./routes');


},{"./controllers/admin/adminDashboard":2,"./controllers/admin/adminLogin":3,"./controllers/main/home":4,"./routes":5,"./services/authService":6}],2:[function(require,module,exports){
angular.module('BlogApp').controller('adminDashboard', [
  '$scope', 'authService', function($scope, authService) {
    return authService(function(stuff) {
      return console.log('!', stuff);
    });
  }
]);


},{}],3:[function(require,module,exports){
angular.module('BlogApp').controller('adminLogin', [
  '$scope', '$http', '$location', function($scope, $http, $location) {
    console.log('adminLogin!');
    $scope.loginProgress = false;
    return $scope.login = function() {
      $scope.loginProgress = true;
      $scope.loginError = '';
      return $http.post('/admin/login', $scope.adminUser).then(function(returnData) {
        $scope.loginProgress = false;
        if (returnData.data.error) {
          return $scope.loginError = returnData.data.error;
        } else {
          return $location.url('/admin/dashboard');
        }
      });
    };
  }
]);


},{}],4:[function(require,module,exports){
angular.module('BlogApp').controller('homeCont', [
  '$scope', function($scope) {
    $scope.test = 'hello';
    console.log('hello!');
    return $scope.something = function() {};
  }
]);


},{}],5:[function(require,module,exports){
angular.module('BlogApp').config([
  '$stateProvider', '$urlRouterProvider', '$locationProvider', function($stateProvider, $urlRouterProvider, $locationProvider) {
    $locationProvider.html5Mode(true);
    $urlRouterProvider.otherwise('/');
    return $stateProvider.state('home', {
      url: '/',
      controller: 'homeCont',
      templateUrl: '/public/templates/main/home.html'
    }).state('about', {
      url: '/about',
      controller: 'homeCont',
      templateUrl: '/public/templates/main/about.html'
    }).state('adminLogin', {
      url: '/admin/login',
      controller: 'adminLogin',
      templateUrl: '/public/templates/admin/login.html'
    }).state('adminDashboard', {
      url: '/admin/dashboard',
      controller: 'adminDashboard',
      templateUrl: '/public/templates/admin/dashboard.html'
    });
  }
]);


},{}],6:[function(require,module,exports){
angular.module('BlogApp').service('authService', [
  '$http', '$location', function($http, $location) {
    return this.authCheck = function(cb) {
      return $http.get('/api/me').then(function(returnData) {
        console.log('RETURN FROM ME', returnData.data);
        if (returnData.data.user) {
          return cb(returnData.data.user);
        } else {
          return $location.url('/');
        }
      });
    };
  }
]);


},{}]},{},[1])