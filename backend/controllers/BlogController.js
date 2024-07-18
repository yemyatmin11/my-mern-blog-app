const { mongoose } = require("mongoose");
const Blog = require("../Models/Blog");
const removeFile = require("../helpers/removeFile");


const BlogController = {
    index : async (req, res) => {
        try {
            let limit = 6;
            let page = req.query.page || 1;

            let blogs = await Blog
            .find()
            .skip(( page - 1 ) * limit)
            .limit(limit)
            .sort({ createdAt: -1 })
            .populate('userId')


            let totalBlogsCount = await Blog.countDocuments();
            let totalPagesCount = Math.ceil(totalBlogsCount / limit);

            let links = {
                nextPage : totalPagesCount == page ? false : true,
                previousPage : page == 1 ? false : true,
                currentPage : page,
                loopableLinks : []
            }

            // generate loopableLinks array
            for (let index = 0; index < totalPagesCount; index++) {
                let number = index + 1;
                links.loopableLinks.push( { number })
            }

            let response = {
                data : blogs,
                links
            }
            
            return res.json(response);
        } catch (e) {
            return res.status(400).json({ msg : ""})
        }
    },
    show : async (req, res) => {
        try {
            let id  = req.params.id;

            if(!mongoose.Types.ObjectId.isValid(id)) {
                return res.status(400).json({ msg : "not a valid id"});
            }

            let blog = await Blog.findById(id).populate('userId');

            if(!blog) {
                return res.status(404).json({ msg : "Blog not found"});
            }

            return res.json(blog);
        } catch (e) {
            return res.status(500).json({ msg : "internet server error"});
        }
    },
    store : async (req, res) => {
        try {
            const { title, description, categories } = req.body; 

            const blog = await Blog.create({
                title,
                description,
                categories,
                userId : req.user._id
            });

            return res.json(blog);
        } catch (e) {
            return res.status(400).json({ msg : "inval  id fields"});
        }
    },
    destroy : async (req, res) => {
        try {
            let id  = req.params.id;

            if(!mongoose.Types.ObjectId.isValid(id)) {
                return res.status(400).json({ msg : "not a valid id"});
            }

            let blog = await Blog.findByIdAndDelete(id);

            await removeFile( __dirname + '/../public/blogs' + blog.photo);

            if(!blog) {
                return res.status(404).json({ msg : "Blog not found"});
            }

            return res.json(blog);
        } catch (e) {
            return res.status(500).json({ msg : "internet server error"});
        }
    },
    update : async (req, res) => {
        try {
            let id  = req.params.id;

            if(!mongoose.Types.ObjectId.isValid(id)) {
                return res.status(400).json({ msg : "not a valid id"});
            }

            let blog = await Blog.findByIdAndUpdate(id, {
                ...req.body
            });

            await removeFile( __dirname + '/../public/blogs' + blog.photo);

            if(!blog) {
                return res.status(404).json({ msg : "Blog not found"});
            }

            return res.json(blog);
        } catch (e) {
            return res.status(500).json({ msg : "internet server error"});
        }
    },
    upload : async (req, res) => {
        try {
            let id  = req.params.id;

            if(!mongoose.Types.ObjectId.isValid(id)) {
                return res.status(400).json({ msg : "not a valid id"});
            }

            let blog = await Blog.findByIdAndUpdate(id, {
                photo : '/' + req.file.filename
            });

            if(!blog) {
                return res.status(404).json({ msg : "Blog not found"});
            }

            return res.json(blog);
        } catch (e) {
            console.log(e);
            return res.status(500).json({ msg : "internet server error"});
        }
    },
    getUserBlogs : async (req, res) => {
        try {
            let userId = req.params.userId;
            
            let blogs = await Blog
            .find({ userId })
            .sort({ createdAt : -1 })
            .populate('userId');

            return res.json(blogs);
        } catch (e) {
            console.log(e);
            return res.status(500).json({ msg : "internet server error"});
        }
    },
    search : async (req, res) => {
        try {
            const term = req.query.t;
            let blogs = await Blog.find(
                {
                    title : {
                        $regex : term,
                        $options : 'i'
                    }
                }
            )

            return res.status(200).json(blogs);
        } catch (e) {
            console.log(e);
            return res.status(500).json({ msg : "internet server error"});
        }
    }
}

module.exports = BlogController;