// Import dependencies
const express = require('express');
const mongoose = require('mongoose');
const ejs = require('ejs');

// Create Express app
const app = express();

// Set the view engine to EJS
app.set('view engine', 'ejs');

// Set public directories
app.use('*/css',express.static('public/css'));
app.use('*/img',express.static('public/img'));

// Parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB using Mongoose
mongoose.connect('mongodb://127.0.0.1:27017/wikiDB', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB', err);
  });

// Create a basic schema and model using Mongoose
const articleSchema =  new mongoose.Schema({
    title: String,
    content: String,
});

//test

const Article = mongoose.model('Article', articleSchema);

// Route requesting all articles
app.route('/articles')
    .get((req, res) => {
        Article.find()
        .then((response) => {
            res.send(response);
        })
        .catch((err) => {
            res.send(err)
        });
    })
    .post((req, res) => {
        const title = req.body.title;
        const content = req.body.content;
    
        const newArticle = new Article({
            title: title,
            content: content
        })
    
        newArticle.save()
        .then(()=>{
            console.log("New article successfully added.");
        })
    })
    .delete((req, res) => {
        Article.deleteMany()
        .then(() => {
            console.log("Successfully deleted all the articles.");
            res.send("Successfully deleted all the articles.");
        })
        .catch((err) => {
            console.log(err);
            res.send(err);
        })
    })

// Route requesting a specific route
app.route('/articles/:articleTitle')
    .get((req, res) => {
        Article.findOne({title: req.params.articleTitle})
        .then((foundArticle) => {
            if (!foundArticle){
                res.send("Article not found")
            } else {
                res.send(foundArticle);
            }
        })
    })
    .put((req, res) => {
        Article.replaceOne(
            {title: req.params.articleTitle},
            req.body
        ).then(() => {
            res.send("Successfully put.")
        })
    })
    .patch((req, res) => {
        Article.updateOne(
            {title: req.params.articleTitle},
            req.body
        ).then(() => {
            res.send("Successfully patched.")
        })
    })
    .delete((req, res) => {
        Article.deleteOne({title: req.params.articleTitle})
        .then(()=> {
            res.send("Article successfully deleted.")
        })
    })






// Start the server
app.listen(3000, () => {
  console.log('Server started on port 3000');
});
