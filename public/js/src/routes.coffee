angular.module 'BlogApp'
	.config ['$stateProvider', '$urlRouterProvider', '$locationProvider', '$compileProvider',
	($stateProvider, $urlRouterProvider, $locationProvider, $compileProvider)->
		$compileProvider.debugInfoEnabled(false);
		$locationProvider.html5Mode(true);

		#For any unmatched url, redirect to /state1
		$urlRouterProvider.otherwise('/');

		$stateProvider
			.state 'home', {
				url: '/',
				controller: 'homeCont',
				templateUrl: '/public/templates/main/home.html'
			}
			.state 'pages', {
				url: '/page/:pageNum',
				controller: 'homeCont',
				templateUrl: '/public/templates/main/home.html'
			}
			.state 'about', {
				url: '/about',
				controller: 'aboutCont',
				templateUrl: '/public/templates/main/about.html'
			}
			.state 'post', {
				url: '/posts/:id',
				controller: 'postCont',
				# templateUrl: '/public/templates/main/post.html'
			}
			.state 'tag', {
				url: '/tags/:name',
				controller: 'tagCont',
				templateUrl: '/public/templates/main/tag.html'
			}
			.state 'tagPage', {
				url: '/tags/:name/:pageNum',
				controller: 'tagCont',
				templateUrl: '/public/templates/main/tag.html',
				# resolve : {
				# 	posts : () ->
				# 		return postTagFactory.postModel.query({tag : $stateParams.name, page : $stateParams.pageNum})
				# }
			}
			.state 'adminLogin', {
				url: '/admin/login',
				controller: 'adminLogin',
				templateUrl:'/public/templates/admin/login.html'
			}
			.state 'adminDashboard', {
				url: '/admin/dashboard',
				controller: 'adminDashboard',
				templateUrl:'/public/templates/admin/dashboard.html'
			}
			.state 'adminAddPost', {
				url: '/admin/addpost',
				controller: 'adminAddPost',
				templateUrl:'/public/templates/admin/addpost.html'
			}
            .state 'adminUpdatePost', {
				url: '/admin/updatepost',
				controller: 'adminUpdatePost',
				templateUrl:'/public/templates/admin/updatepost.html'
			}
			.state 'adminModerateComments', {
				url : '/admin/moderatecomments',
				controller : 'adminModerateComments',
				templateUrl : '/public/templates/admin/moderateComments.html'
			}

		
			
	]

	.run [
		'$rootScope', 
		($rootScope)->
			$rootScope.$on '$stateChangeSuccess', (event, toState, toParams, fromState, fromParams)->
				# Used to fix routing issue with post
				if toParams.id and fromState.name
					location.reload();
	]