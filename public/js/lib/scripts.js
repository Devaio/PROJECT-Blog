(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
angular.module('BlogApp', ['ngMaterial', 'ui.router', 'ngResource', 'ngQuill', 'ngSanitize']);

angular.module('BlogApp').config(function($mdThemingProvider) {
  return $mdThemingProvider.theme('default').primaryPalette('teal').accentPalette('deep-purple').warnPalette('light-green');
});

require('./services/authService');

require('./directives/nav');

require('./factories/post-tag');

require('./controllers/main/home');

require('./controllers/admin/adminLogin');

require('./controllers/admin/adminDashboard');

require('./controllers/admin/adminAddPost');

require('./routes');


},{"./controllers/admin/adminAddPost":2,"./controllers/admin/adminDashboard":3,"./controllers/admin/adminLogin":4,"./controllers/main/home":5,"./directives/nav":6,"./factories/post-tag":7,"./routes":8,"./services/authService":9}],2:[function(require,module,exports){
angular.module('BlogApp').controller('adminAddPost', [
  '$scope', '$location', '$http', 'authService', function($scope, $location, $http, authService) {
    $scope.navheight = 'small';
    $scope.loading = false;
    $scope.newPost = {
      tags: []
    };
    return authService(function(stuff) {
      console.log('!', stuff);
      return $scope.submitPost = function() {
        return console.log($scope.message);
      };
    });
  }
]);


},{}],3:[function(require,module,exports){
angular.module('BlogApp').controller('adminDashboard', [
  '$scope', '$location', 'authService', function($scope, $location, authService) {
    $scope.navheight = 'small';
    return authService(function(stuff) {
      console.log('!', stuff);
      return $scope.addPost = function() {
        return $location.url('/admin/addpost');
      };
    });
  }
]);


},{}],4:[function(require,module,exports){
angular.module('BlogApp').controller('adminLogin', [
  '$scope', '$http', '$location', function($scope, $http, $location) {
    console.log('adminLogin!');
    $scope.navheight = 'small';
    $scope.loading = false;
    return $scope.login = function() {
      $scope.loading = true;
      $scope.loginError = '';
      return $http.post('/admin/login', $scope.adminUser).then(function(returnData) {
        $scope.loading = false;
        if (returnData.data.error) {
          return $scope.loginError = returnData.data.error;
        } else {
          return $location.url('/admin/dashboard');
        }
      });
    };
  }
]);


},{}],5:[function(require,module,exports){
angular.module('BlogApp').controller('homeCont', [
  '$scope', '$sce', 'postTagFactory', function($scope, $sce, postTagFactory) {
    $scope.navheight = 'large';
    $scope.posts = postTagFactory.posts;
    $scope.$sce = $sce;
    return $scope.something = function() {};
  }
]);


},{}],6:[function(require,module,exports){
angular.module('BlogApp').directive('nav', function() {
  return {
    restrict: 'E',
    templateUrl: '/public/templates/directives/nav.html',
    scope: {
      navheight: '='
    },
    link: function($scope) {}
  };
});


},{}],7:[function(require,module,exports){
angular.module('BlogApp').factory('postTagFactory', [
  '$resource', function($resource) {
    var postModel, tagModel;
    postModel = $resource('/api/posts/:id', {
      id: '@_id'
    });
    tagModel = $resource('/api/tags/:id', {
      id: '@_id'
    });
    return {
      postModel: postModel,
      tagModel: tagModel,
      posts: postModel.query()
    };
  }
]);


},{}],8:[function(require,module,exports){
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
    }).state('adminAddPost', {
      url: '/admin/addpost',
      controller: 'adminAddPost',
      templateUrl: '/public/templates/admin/addpost.html'
    });
  }
]);


},{}],9:[function(require,module,exports){
angular.module('BlogApp').service('authService', [
  '$http', '$location', function($http, $location) {
    return this.authCheck = function(cb) {
      return $http.get('/api/me').then(function(returnData) {
        if (returnData.data.user) {
          return cb(returnData.data.user);
        } else {
          console.log('no user');
          return $location.url('/');
        }
      });
    };
  }
]);


},{}]},{},[1])