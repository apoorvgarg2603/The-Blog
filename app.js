var bodyParser = require("body-parser"),
    expressSanitizer = require("express-sanitizer"),
    mongoose   = require("mongoose"),
    express    = require("express"),
    app        = express(),
    methodOverride = require("method-override");

mongoose.connect("mongodb://localhost/blogApp",{ useNewUrlParser: true, useUnifiedTopology: true});
app.use(bodyParser.urlencoded({extended : true}));
app.use(expressSanitizer());
app.use('/public', express.static('public'))
app.set("view engine", "ejs");
app.use(methodOverride("_method"));
mongoose.set('useFindAndModify', false);

var blogSchema = new mongoose.Schema({
    title : String,
    image : String,
    body : String,
    created : {type: Date, default: Date.now}
});

var Blog = mongoose.model("Blog", blogSchema);

app.get("/",function(req, res){

    res.redirect("/blogs");
});

app.get("/blogs", function(req, res){
    Blog.find({}, function(err, blogs){
        if(err){

            console.log(err);

        }else{
            res.render("index", {blogs : blogs});
        }
    })
});

app.get("/blogs/new", function(req, res){
    res.render("new");
});

app.post("/blogs", function(req, res){
    var title = req.body.title,
        image = req.body.image,
        body = req.body.body;
    var newPost = {title : title, image : image, body : body};
    Blog.create(newPost, function(err, newBlog){
        if(err){
            console.log(err);
            res.render("new");
        }
        else{
            res.redirect("/blogs");
        }
    });
});

app.get("/blogs/:id", function(req, res){
    var id = req.params.id;
    Blog.findById(id, function(err, foundPost){
        if(err){
            console.log(err);
        }else{
            res.render("show", {blog : foundPost});
        }
    });
});

app.get("/blogs/:id/edit", function(req, res){
    Blog.findById(req.params.id, function(err, foundPost){
        if(err){
            res.render("/blogs");
        } else {
            res.render("edit", {blog : foundPost});
        }
    });
});

app.put("/blogs/:id", function(req, res){
    var updatedTitle = req.body.title,
        updatedImage = req.body.image,
        updatedBody = req.body.body;
    var updatedBlog = {title : updatedTitle, image : updatedImage, body : updatedBody};

    Blog.findByIdAndUpdate(req.params.id, updatedBlog, function(err, UpdatedBlog){
        if(err){
            res.redirect("/blogs")
        } else {
            res.redirect("/blogs/" + req.params.id );
        }
    });
});

app.delete("/blogs/:id", function(req, res){
    Blog.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/blogs");
        } else {
            res.redirect("/blogs");
        }
    });
});
app.listen(3000);