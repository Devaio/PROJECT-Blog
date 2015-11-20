(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
angular.module('BlogApp', ['ngMaterial', 'ui.tinymce', 'ui.router', 'ngResource', 'ngSanitize']);

angular.module('BlogApp').config(function($mdThemingProvider) {
  return $mdThemingProvider.theme('default').primaryPalette('blue-grey').accentPalette('deep-purple').warnPalette('light-green');
});

require('./services/authService');

require('./directives/nav');

require('./factories/post-tag');

require('./controllers/main/home');

require('./controllers/main/about');

require('./controllers/main/post');

require('./controllers/main/tag');

require('./controllers/admin/adminLogin');

require('./controllers/admin/adminDashboard');

require('./controllers/admin/adminAddPost');

require('./routes');


},{"./controllers/admin/adminAddPost":2,"./controllers/admin/adminDashboard":3,"./controllers/admin/adminLogin":4,"./controllers/main/about":5,"./controllers/main/home":6,"./controllers/main/post":7,"./controllers/main/tag":8,"./directives/nav":9,"./factories/post-tag":10,"./routes":11,"./services/authService":12}],2:[function(require,module,exports){
angular.module('BlogApp').controller('adminAddPost', [
  '$scope', '$location', '$http', '$timeout', 'authService', function($scope, $location, $http, $timeout, authService) {
    $scope.navheight = 'small';
    $scope.loading = false;
    $scope.newPost = {
      tags: []
    };
    $scope.tinymceOptions = {
      onChange: function(e) {},
      inline: false,
      plugins: 'advlist autolink hr link image lists charmap print preview fontselect fontsizeselect',
      skin: 'lightgray',
      theme: 'modern',
      browser_spellcheck: true,
      height: 800,
      browser_spellcheck: true,
      fontsize_formats: "8pt 9pt 10pt 11pt 12pt 14pt 18pt 26pt 36pt",
      default_link_target: "_blank",
      toolbar1: 'core',
      toolbar2: "undo redo pastetext | styleselect | fontselect | fontsizeselect | bold italic |  alignleft aligncenter alignright alignjustify |  bullist numlist outdent indent blockquote hr | link image "
    };
    return authService(function(stuff) {
      console.log('!', stuff);
      return $scope.submitPost = function() {
        var _ref, _ref1;
        console.log($scope.newPost);
        if ((_ref = $scope.newPost) != null ? (_ref1 = _ref.content) != null ? _ref1.length : void 0 : void 0) {
          $scope.loading = true;
          console.log($scope.newPost);
          return $http.post('/api/posts', $scope.newPost).then(function(returnData) {
            console.log(returnData);
            $scope.loading = false;
            return $timeout(function() {
              return $location.url('/posts/' + returnData.data._id);
            });
          });
        }
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
angular.module('BlogApp').controller('aboutCont', [
  '$scope', function($scope) {
    return $scope.navheight = 'small';
  }
]);


},{}],6:[function(require,module,exports){
angular.module('BlogApp').controller('homeCont', [
  '$scope', '$sce', 'postTagFactory', '$stateParams', '$location', function($scope, $sce, postTagFactory, $stateParams, $location) {
    $scope.navheight = 'large';
    $scope.posts = postTagFactory.posts($stateParams.pageNum);
    $scope.nextPage = parseInt($stateParams.pageNum || 1) + 1;
    $scope.showNextPage = true;
    if (parseInt($stateParams.pageNum || 1) <= 1) {
      $location.url('/');
    }
    $scope.$watch('posts.length', function() {
      if ($scope.posts.length < 10) {
        $scope.showNextPage = null;
      } else {
        $scope.nextPage = parseInt($stateParams.pageNum || 1) + 1;
        $scope.showNextPage = true;
      }
      return console.log($scope);
    });
    $scope.$sce = $sce;
    return $scope.something = function() {};
  }
]);


},{}],7:[function(require,module,exports){
angular.module('BlogApp').controller('postCont', [
  '$scope', '$sce', '$stateParams', 'postTagFactory', function($scope, $sce, $stateParams, postTagFactory) {
    $scope.navheight = 'small';
    console.log($stateParams);
    $scope.post = postTagFactory.postModel.get({
      id: $stateParams.id
    });
    return $scope.$sce = $sce;
  }
]);


},{}],8:[function(require,module,exports){
angular.module('BlogApp').controller('tagCont', [
  '$scope', '$sce', '$stateParams', 'postTagFactory', '$location', function($scope, $sce, $stateParams, postTagFactory, $location) {
    $scope.navheight = 'small';
    console.log('State', $stateParams);
    $scope.tag = postTagFactory.tagModel.get({
      name: $stateParams.name
    });
    $scope.$sce = $sce;
    $scope.posts = postTagFactory.postModel.query({
      tag: $stateParams.name,
      page: $stateParams.pageNum
    });
    $scope.nextPage = parseInt($stateParams.pageNum || 1) + 1;
    $scope.showNextPage = true;
    if (parseInt($stateParams.pageNum) <= 1) {
      $location.url("/tags/" + $stateParams.name);
    }
    $scope.$watch('posts.length', function() {
      if ($scope.posts.length < 10) {
        return $scope.showNextPage = null;
      } else {
        $scope.nextPage = parseInt($stateParams.pageNum || 1) + 1;
        return $scope.showNextPage = true;
      }
    });
    return console.log('LENGTH', $scope.posts.length);
  }
]);


},{}],9:[function(require,module,exports){
angular.module('BlogApp').directive('nav', function() {
  return {
    restrict: 'E',
    templateUrl: '/public/templates/directives/nav.html',
    scope: {
      navheight: '='
    },
    controller: function($scope, $mdSidenav) {
      return $scope.toggleNav = function() {
        return $mdSidenav('right').toggle();
      };
    }
  };
});


},{}],10:[function(require,module,exports){
angular.module('BlogApp').factory('postTagFactory', [
  '$resource', '$stateParams', function($resource, $stateParams) {
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
      posts: function(page) {
        return postModel.query({
          page: page
        });
      }
    };
  }
]);


},{}],11:[function(require,module,exports){
angular.module('BlogApp').config([
  '$stateProvider', '$urlRouterProvider', '$locationProvider', function($stateProvider, $urlRouterProvider, $locationProvider) {
    $locationProvider.html5Mode(true);
    $urlRouterProvider.otherwise('/');
    return $stateProvider.state('home', {
      url: '/',
      controller: 'homeCont',
      templateUrl: '/public/templates/main/home.html'
    }).state('pages', {
      url: '/page/:pageNum',
      controller: 'homeCont',
      templateUrl: '/public/templates/main/home.html'
    }).state('about', {
      url: '/about',
      controller: 'aboutCont',
      templateUrl: '/public/templates/main/about.html'
    }).state('post', {
      url: '/posts/:id',
      controller: 'postCont',
      templateUrl: '/public/templates/main/post.html'
    }).state('tag', {
      url: '/tags/:name',
      controller: 'tagCont',
      templateUrl: '/public/templates/main/tag.html'
    }).state('tagPage', {
      url: '/tags/:name/:pageNum',
      controller: 'tagCont',
      templateUrl: '/public/templates/main/tag.html'
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


},{}],12:[function(require,module,exports){
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