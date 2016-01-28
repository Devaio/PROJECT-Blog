async = require 'async'
moment = require 'moment'
if global.process.env.AMAZON_KEY
	s3 = require 's3'
	s3Client = s3.createClient
		s3Options :
			accessKeyId : global.process.env.AMAZON_KEY
			secretAccessKey : global.process.env.AMAZON_SECRET
			
			
module.exports = {
	uploadFiles : (req, res) ->
		# req.files
		console.log 'upload!', req.files.files
		files = req.files.files
		tasks = []
		
		for file in files
			do (file) ->
				tasks.push (cb) ->
					filename = moment().format('X') + file.name
					headers = 
						'Content-Type' : file.type
						'x-amz-acl'    : 'public-read'
					
					uploader = s3Client.uploadFile {
						localFile : file.path

						s3Params :
							Bucket : global.process.env.AMAZON_BUCKET
							Key : filename
							ACL : 'public-read'
					}
					uploader.on 'progress', () ->
						console.log("progress", uploader.progressAmount, uploader.progressTotal)
					uploader.on 'end', () ->
						url = s3.getPublicUrlHttp global.process.env.AMAZON_BUCKET, filename
						console.log 'URL', url
						file.url = url
						cb()
		async.series tasks, () ->
			
			res.send {data : files}
}