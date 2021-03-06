moment = require 'moment'

angular.module 'BlogApp'
	.controller 'adminUpdatePost', [
		'$scope',
		'$location', 
		'$http',
		'$sce',
		'$timeout', 
		'authService', 
		'$stateParams', 
		'postTagFactory', 
		'Upload', 
		($scope, $location, $http, $sce, $timeout, authService, $stateParams, postTagFactory, Upload) ->

			# Tiny MCE Custom Link plugins
			tinymce.PluginManager.add 'htmllink', (editor, url) ->
				editor.addButton 'htmllinkbtn',
					text: 'HTML Link'
					icon: false
					onclick: ->
						editor.windowManager.open
							title: 'Please input text'
							body: [ {
								type: 'textbox'
								name: 'link'
								label: 'Paste Link'
							} ]
							onsubmit: (e) ->
								# Insert content when the window form is submitted
								editor.insertContent e.data.link

			$scope.navheight = 'small'
			$scope.loading = false
			postTagFactory.postModel.query {all : 10000, deleted : true}, (data)->
				$scope.posts = data
				$scope.posts.forEach (post) ->
					post.tags = post.tags || [];
					# post.date = post.createdAt;
			$scope.$sce = $sce
			# $scope.files = []		
			console.log($scope)
			$scope.transformDate = () ->
				# console.log $scope
				$scope.selectedPost.createdAt = new Date($scope.selectedPost.createdAt)
			
			$scope.resizeCheck = (file, width, height) ->
				# console.log 'resize!', width > 1600 or height > 1200
				return width > 1600 or height > 1200
			
			$scope.submit = () ->
				#  console.log 'scopey scope', $scope
				uploader = Upload.upload {
					url : '/api/media'
					data : {
						files : $scope.files
					}
				}
				uploader.then (returnData) ->
					returnData.data.data.forEach (file, index) ->
						$scope.files[index].url = file.url
			
			$scope.tinymceOptions = {
				onChange: (e) ->
					# put logic here for keypress and cut/paste changes
				inline: false,
				plugins : 'advlist autolink hr link image lists charmap print preview fontselect fontsizeselect htmllink',
				skin: 'lightgray',
				theme : 'modern',
				browser_spellcheck : true
				paste_as_text: true
				height : 600
				browser_spellcheck : true
				font_formats : "GeoSans=GeoSans"
				fontsize_formats: "8pt 9pt 10pt 11pt 12pt 14pt 18pt 26pt 36pt"
				default_link_target: "_blank"
				toolbar1 : 'core'
				toolbar2: "undo redo pastetext | styleselect | fontselect | fontsizeselect | bold italic |  alignleft aligncenter alignright alignjustify |  bullist numlist outdent indent blockquote hr | link image | htmllinkbtn"
				# toolbar3 : 'emoticons textcolor'
				width : 740

			}
			$scope.copyText = (event) ->
				event.target.select()
				document.execCommand 'copy'
			authService (stuff) ->
				# console.log '!', stuff
				# console.log '--', $scope.post
				$scope.updatePost = () ->	
					# console.log $scope.selectedPost
					if $scope.selectedPost?.content?.length
						$scope.loading = true
						# $scope.selectedPost.createdAt = $scope.selectedPost.createdAt.getTime()
						
						$scope.selectedPost.$save () ->
							# $scope.selectPost.createdAt = moment.unix($scope.selectPost.createdAt).toDate()
							$scope.loading = false
							window.alert('Done!')
							window.location.reload()
							return true
						# $http.post('/api/posts/' + $scope.selectedPost._id, $scope.post)
						# 	.then (returnData) ->
						# 		console.log returnData
						# 		$scope.loading = false
						# 		$timeout () ->
						# 			$location.url('/posts/' + returnData.data._id)
								
						
	]