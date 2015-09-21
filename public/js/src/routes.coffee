angular.module 'BlogApp'
	.config ['$stateProvider', '$urlRouterProvider', '$locationProvider', ($stateProvider, $urlRouterProvider, $locationProvider)->
		$locationProvider.html5Mode(true);

		#For any unmatched url, redirect to /state1
		$urlRouterProvider.otherwise('/');

		$stateProvider
			.state 'home', {
				url: '/',
				controller: 'homeCont',
				templateUrl: '/public/templates/main/home.html'
			}
			.state 'about', {
				url: '/about',
				controller: 'homeCont',
				templateUrl: '/public/templates/main/about.html'
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
			# .state 'adminCMS', {
			# 	url: '/admin/login',
			# 	controller: 'adminLogin',
			# 	templateUrl:'/public/templates/admin/login.html'
			# }
			# .state('about', {
			# 	url: '/about',
			# 	controller: 'mainCtrl',
			# 	templateUrl: '/client/main/views/about.html'
			# })
			# .state('phones', {
			# 	url: '/phones',
			# 	abstract: true,
			# 	controller: 'phoneCtrl',
			# 	templateUrl: '/client/phones/views/phone.html'
			# })
			# .state('phones.phones-list', {
			# 	url: '/phones-list',
			# 	parent: 'phones',
			# 	controller: 'phoneListCtrl',
			# 	templateUrl: '/client/phones/views/phones-list.html'
			# })
			# .state('phones.phones-details', {
			# 	url: '/phones-details',
			# 	parent: 'phones',
			# 	controller: 'phoneDetailCtrl',
			# 	templateUrl: '/client/phones/views/phones-details.html'
			# });



	]