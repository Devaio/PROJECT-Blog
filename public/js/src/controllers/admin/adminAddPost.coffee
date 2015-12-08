angular.module 'BlogApp'
	.controller 'adminAddPost', ['$scope','$location', '$http','$timeout', 'authService', ($scope, $location, $http, $timeout, authService) ->
		$scope.navheight = 'small'
		$scope.loading = false

		$scope.newPost = {
			tags : []
			createdAt : new Date()
		}
		
		
		$scope.tinymceOptions = {
			onChange: (e) ->
				# put logic here for keypress and cut/paste changes
			inline: false,
			plugins : 'advlist autolink hr link image lists charmap print preview fontselect fontsizeselect',
			skin: 'lightgray',
			theme : 'modern',
			browser_spellcheck : true
			height : 800
			browser_spellcheck : true
			fontsize_formats: "8pt 9pt 10pt 11pt 12pt 14pt 18pt 26pt 36pt"
			default_link_target: "_blank"
			toolbar1 : 'core'
			toolbar2: "undo redo pastetext | styleselect | fontselect | fontsizeselect | bold italic |  alignleft aligncenter alignright alignjustify |  bullist numlist outdent indent blockquote hr | link image "
			# toolbar3 : 'emoticons textcolor'
		}
		
		authService (stuff) ->
			console.log '!', stuff
			
			$scope.submitPost = () ->	
				console.log $scope.newPost
				if $scope.newPost?.content?.length
					$scope.loading = true
					console.log $scope.newPost
					$scope.newPost.createdAt = $scope.newPost.createdAt.getTime()
					$http.post('/api/posts', $scope.newPost)
						.then (returnData) ->
							console.log returnData
							$scope.loading = false
							$timeout () ->
								$location.url('/posts/' + returnData.data._id)
							
					
	]