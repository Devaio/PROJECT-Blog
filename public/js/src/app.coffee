angular.module('BlogApp', ['ngMaterial', 'ui.router', 'ngResource', 'ngQuill', 'ngSanitize'])


angular.module('BlogApp')
	.config ($mdThemingProvider) ->
		$mdThemingProvider.theme('default')
			.primaryPalette('teal')
			.accentPalette('deep-purple')
			.warnPalette('light-green')


# Include Services
require './services/authService'
	
# Include Directives
require './directives/nav'

# Include Factories
require './factories/post-tag'

# Include Controllers
require './controllers/main/home'
require './controllers/admin/adminLogin'
require './controllers/admin/adminDashboard'
require './controllers/admin/adminAddPost'




# Include Routes
require './routes'

