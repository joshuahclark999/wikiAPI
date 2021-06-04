const express = require("express");
const mongoose = require("mongoose");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");

dotenv.config();
const app = express();

mongoose.connect('mongodb+srv://'+process.env.MONGO_USER+':'+process.env.MONGO_PASSWORD+'@'+process.env.MONGO_CLUSTER+'?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true});

app.set('view engine', 'ejs');
process.env
app.use(express.urlencoded({
  extended: true
}));
app.use(express.static("public"));

const articleSchmea = new mongoose.Schema({
  title: String,
  content: String,
});
const Article = mongoose.model("Article",articleSchmea);
////////////For any title////////////////
app.route("/articles")
  .get((req, res) => {
    Article.find({},(err, articles)=>{
      if(err) return console.error(err);
      res.send(articles);
    });
  })
  .post((req,res)=>{
    const newArticle = new Article({
      title: req.body.title,
      content: req.body.content
    });
    newArticle.save((err)=>{
      if(err) return res.send(err);
      res.send("Success")
    });
  })
  .delete((req,res)=>{
    Article.deleteMany({},(err)=>{
      if(err) return res.send(err);
      res.send("Success");
    });
  });
/////////////////////Getting specific title///////////////////
app.route("/articles/:articleTitle")
  .get((req,res)=>{
    Article.findOne({title: req.params.articleTitle},(err,article)=>{
      if(err) return res.send(err);
      res.send(article);
    });
  })
  .put((req,res)=>{
    Article.updateOne(
      {title: req.params.articleTitle},
      {title: req.body.title, content: req.body.content},
      //Set to false by default through mongoose.
      {overwrite: true},
      (err)=>{
        if(err) return res.send(err);
        res.send("successfully updated");
      }
    )
  })
  .patch((req,res)=>{
    Article.updateOne(
      {title: req.params.articleTitle},
      {$set: req.body},
      (err)=>{
        if(err) return res.send(err);
        res.send("Successfully updated");
      });
  })
  .delete((req,res)=>{
    Article.deleteOne({title: req.params.articleTitle},(err)=>{
      if(err) return res.send(err);
      res.send("Successfully deleted")
    })
  });

app.listen(3000, () => {
  console.log(`Server started on port 3000`)
})
