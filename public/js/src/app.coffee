require 'ng-file-upload'
angular.module('BlogApp', [
	'ngMaterial',
	'ngAnimate', 
	'ui.tinymce', 
	'ui.router',
	'ngResource', 
	'ngSanitize', 
	'ngFileUpload',
	'updateMeta',
	'angular-pinterest'
]).config ($mdThemingProvider, $compileProvider) ->
	$compileProvider.debugInfoEnabled(false)
	$mdThemingProvider.theme('default')
		.primaryPalette('grey', {
			default : '300'
		})
		.accentPalette('deep-purple')
		.warnPalette('light-green')

# angular.module('BlogApp').filter 'htmlToPlaintext', () ->
# 	return (text) -> 
# 		return  if text then String(text).replace(/<[^>]+>/gm, '') else ''
		
    
	
# Include Services
require './services/authService'
	
# Include Directives
require './directives/nav'

# Include Factories
require './factories/post-tag'
require './factories/social'


# Include Controllers
require './controllers/main/home'
require './controllers/main/about'
require './controllers/main/post'
require './controllers/main/tag'
require './controllers/admin/adminLogin'
require './controllers/admin/adminDashboard'
require './controllers/admin/adminAddPost'
require './controllers/admin/adminUpdatePost'
require './controllers/admin/adminModerateComments'






# Include Routes
require './routes'

