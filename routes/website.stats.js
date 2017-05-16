var mongo = require("./util.mongo");
var mongoDatabaseUrl = "mongodb://mak:mak@ds137891.mlab.com:37891/sprouts"

	
exports.getUserStats = function(req, res) {
	
	mongo.connect(mongoDatabaseUrl, function(connection){
		users = mongo.collection("users");
		users.count({userRole:"user"},function(err, count){
			if(err) {
				res.send({error:true, errMsg: err})
			} else {
				res.send({success:true, count: count});
			}
		})
	});
}

exports.getModeratorStats = function(req, res) {
	mongo.connect(mongoDatabaseUrl, function(connection){
		users = mongo.collection("users");
		users.count({userRole:"moderators"},function(err, count){
			if(err) {
				res.send({error:true, errMsg: err})
			} else {
				res.send({success:true, count: count});
			}
		})
	})
}
