const { default: mongoose, Schema } = require("mongoose");
const Comment = require("../Models/Comment");


const CommentController = {
    store : async (req, res) => {
        try {
            const { comment, author, authorPhoto, postId, userId } = req.body;

            if(!mongoose.Types.ObjectId.isValid(postId)) {
                return res.status(400).json({ msg : 'Invalid post ID'})
            }

            if(!mongoose.Types.ObjectId.isValid(userId)) {
                return res.status(400).json({ msg : 'Invalid user ID'})
            }

            const newComment = new Comment({
                comment,
                author,
                authorPhoto,
                postId,
                userId
            });

            const savedComment = await newComment.save();
            return res.status(200).json(savedComment);
        } catch (e) {
            console.error(e);
            return res.status(500).json({ error: e.message });
        }
    },
    destroy : async (req, res) => {
        try {
            let id = req.params.id;

            if(!mongoose.Types.ObjectId.isValid(id)) {
                return res.status(400).json({ msg : 'not a valid id'});
            }

            let comment = await Comment.findByIdAndDelete(id);

            if(!comment) {
                return res.status(404).json({ msg : "comment not found"});
            }

            return res.status(200).json(comment);
        } catch (e) {
            console.error(e);
            return res.status(500).json({ error: e.message });
        }
    },
    update : async (req, res) => {
       try {
            let id = req.params.id;

            if(!mongoose.Types.ObjectId.isValid(id)) {
                return res.status(400).json({ msg : 'not a valid ID'});
            }

            let comment = await Comment.findByIdAndUpdate(id, 
                { $set : req.body }, 
                { new : true }
            );

            if(!comment) {
                return res.status(404).json({ msg : "comment not found"});
            }

            return res.status(200).json(comment);
        } catch (e) {
            console.error(e);
            return res.status(500).json({ error: e.message });
        }
    },
    getPostComments : async (req, res) => {
        try {
            let postId = req.params.postId;

            if(!mongoose.Types.ObjectId.isValid(postId)) {
                return res.status(400).json({ msg : 'not a valid id'})
            }
            
            const comment = await Comment
            .find({ postId })
            .sort({ createdAt : -1 })

            if(!comment) {
                return res.status(404).json({ msg : 'comment not found'})
            }

            return res.status(200).json(comment);
        } catch (e) {
            console.error(e);
            return res.status(500).json({ error: e.message });
        }
    }
}

module.exports = CommentController;