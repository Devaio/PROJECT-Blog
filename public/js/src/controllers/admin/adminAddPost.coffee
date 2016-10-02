angular.module 'BlogApp'
	.controller 'adminAddPost', [
		'$scope',
		'$location', 
		'$http',
		'$sce',
		'$timeout', 
		'authService', 
		'Upload', 
		($scope, $location, $http, $sce, $timeout, authService, Upload) ->
		
			$scope.navheight = 'small'
			$scope.loading = false
			$scope.newPost = {
				tags : []
				createdAt : new Date()
			}
			$scope.$sce = $sce
			$scope.resizeCheck = (file, width, height) ->
				# console.log 'resize!', width > 1600 or height > 1200
				return width > 1600 or height > 1200
			
			$scope.tinymceOptions = {
				onChange: (e) ->
					# put logic here for keypress and cut/paste changes
				inline : false,
				plugins : 'advlist autolink hr link image lists charmap print preview fontselect fontsizeselect',
				skin: 'lightgray'
				theme : 'modern'
				browser_spellcheck : true
				paste_as_text: true
				height : 800
				browser_spellcheck : true
				fontsize_formats : "8pt 9pt 10pt 11pt 12pt 14pt 18pt 26pt 36pt"
				default_link_target : "_blank"
				toolbar1 : 'core'
				toolbar2: "undo redo pastetext | styleselect | fontselect | fontsizeselect | bold italic |  alignleft aligncenter alignright alignjustify |  bullist numlist outdent indent blockquote hr | link image "
				width : 740
				# toolbar3 : 'emoticons textcolor'
			}
			$scope.submit = () ->
				uploader = Upload.upload {
					url : '/api/media'
					data : {
						files : $scope.files
					}
				}
				uploader.then (returnData) ->
					returnData.data.data.forEach (file, index) ->
						$scope.files[index].url = file.url
				
			$scope.copyText = (event) ->
				event.target.select()
				document.execCommand 'copy'

			authService (stuff) ->
				
				$scope.submitPost = () ->	
					$scope.postError = ''
					
					if $scope.newPost?.content?.length and $scope.newPost?.preview and $scope.newPost?.coverImg and $scope.newPost?.tags?.length
					
						$scope.loading = true
						console.log $scope.newPost
						$scope.newPost.createdAt = $scope.newPost.createdAt.getTime()
						$http.post('/api/posts', $scope.newPost)
							.then (returnData) ->
								console.log returnData
								$scope.loading = false
								if returnData.data._id
									$timeout () ->
										$location.url('/posts/' + returnData.data._id)
								else
									$scope.postError = returnData.data
								
					else
						$scope.postError = 'Make sure everything is filled out!'
				
				$scope.submitDraft = () ->	
					$scope.loading = true
					console.log $scope.newPost
					$scope.newPost.deleted = true
					$scope.newPost.createdAt = $scope.newPost.createdAt.getTime()
					$http.post('/api/posts', $scope.newPost)
						.then (returnData) ->
							console.log returnData
							$scope.loading = false
							if returnData.data._id
								alert('Draft Saved!')
							else
								alert('Bad things happened!' + returnData.data)
		]