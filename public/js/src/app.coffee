angular.module('BlogApp', ['ngMaterial', 'ui.router', 'ngResource'])


# Include Services
require './services/authService'

# Include Controllers
require './controllers/main/home'
require './controllers/admin/adminLogin'
require './controllers/admin/adminDashboard'



# Include Routes
require './routes'

