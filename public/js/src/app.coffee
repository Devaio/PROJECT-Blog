angular.module('BlogApp', ['ngMaterial', 'ui.tinymce', 'ui.router', 'ngResource', 'ngSanitize'])

#  'ngQuill'
angular.module('BlogApp')
	.config ($mdThemingProvider) ->
		$mdThemingProvider.theme('default')
			.primaryPalette('blue-grey')
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
require './controllers/main/about'
require './controllers/main/post'
require './controllers/main/tag'
require './controllers/admin/adminLogin'
require './controllers/admin/adminDashboard'
require './controllers/admin/adminAddPost'




# Include Routes
require './routes'

