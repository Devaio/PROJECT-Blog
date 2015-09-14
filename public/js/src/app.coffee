angular.module('BlogApp', ['ngMaterial', 'ui.router', 'ngResource'])


angular.module('BlogApp')
	.config ($mdThemingProvider) ->
		$mdThemingProvider.theme('default')
			.primaryPalette('teal')
			.accentPalette('cyan')
			.warnPalette('light-green')


# Include Services
require './services/authService'

# Include Controllers
require './controllers/main/home'
require './controllers/admin/adminLogin'
require './controllers/admin/adminDashboard'



# Include Routes
require './routes'

