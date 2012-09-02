var	mongoose	=	require('mongoose');
var	Post		=	require('../models/Post.js');
var	Forum		=	require('../models/Forum.js');
var	User		=	require('../models/User.js');
var	Schema		=	mongoose.Schema;
var	ObjectId	=	Schema.ObjectId;

var	topicSchema = new Schema({
	author: {type: ObjectId, ref: 'User'},
	desc: String,
	title: String,
	slug: String,
	forum: {type: ObjectId, ref: 'Forum'},
	post: {type: ObjectId, ref: 'Post'},
	replies: [{type: ObjectId, ref: 'Post'}],
	views: {type: Number, default: 0},
	createdOn: {type: Date, default: Date.now}
});

module.exports = mongoose.model('Topic', topicSchema);