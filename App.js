require("dotenv").config();
var mongoose = require('mongoose');
var express = require("express");
var app = express();
//to read forms
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));
//This needs to be switched
var user = process.env.MONGO_USERID
var pw= process.env.MONGO_PW

//Connection script to db
//remember to switch password after assignment has been graded
var uri = "mongodb+srv://"+user+":"+pw+"@mystuff.4defn.mongodb.net/sample_restaurants?retryWrites=true&w=majority";
//making connection to database
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true});


//making model for data
const Restaurants = mongoose.model(
    'Restaurants',
    {
        name: String,
        cuisine: String,
        borough: String,
        street: String,
        grades: Array
    }, 
);

//The Routes (you have to figure these with postman unless u log)
app.get('/',function(reg, res){
   res.send(`<h1>You Arrived</h1>`);
});

app.get("/api/getall",function(req,res){
    Restaurants.find({},null,{limit:50}, function(err,results){
     if(err){
        res.status(500).json("Oopsie! Something went wrong with search data");
     }else{
        res.status(200).json(results);
        }; 
    });
});

app.get("/api/:id",function(req,res){
    /* Using postman to make query and this piece talks with postman.
    Basically, whatever is fed to "Path variables" section of postman will be used in the code.
    Remebmer to turn "x-www-form-urlencoded" settigng on from postmans "body" tab!
    This way the code is object oriented and not hard coded.
    */
    var id = req.params.id;
    Restaurants.findById(id, function(err,results){
        if(err){
            res.status(500).json("Oopsie! Something went wrong with search data");
         }else{
            res.status(200).json(results);
            }; 
    });
});
//Remember to swith to post side in postman when testing!
app.post("/api/add", function(req, res){
    //making the object that u want to save
    var newRestaurant = new Restaurants({
        name: 'Caritas cusine',
        cuisine: 'Finnish',
        borough: 'Manhattan',
        street: 'The best one',
        grades: [{grade:"A", score: 20}]
    });
    //inserting into database
    newRestaurant.save(function(err,result){
        if(err){
            res.status(500).json("Hmm. Something went wron on saving the data...");
        }else{
            res.status(200).json(result);
        }
    });
});
app.patch("/api/update/:id", function(req,res){
    var id = req.params.id;
    var pisteet= Math.floor(Math.random()*21);
    let arvosana = '';
    if(pisteet>=17){arvosana += 'A';}
    else if(pisteet<=16&&pisteet>=13){arvosana += 'B';}
    else if(pisteet<=12&&pisteet>=9){arvosana += 'C';}
    else if(pisteet<=8&&pisteet>=5){arvosana +='D';}
    else {arvosana += 'E';}

    Restaurants.findOneAndUpdate(id, {grades : [{date:  new Date().toLocaleString() , score: pisteet, grade : arvosana  }]},function(err,result){
        if(err){
            res.status(500).json("Hmm. Something went wron on saving the data...");
        }else{
            res.status(200).json(result);
        }
    
    });
});
app.delete("/api/delete/:id", function(req,res){
    var id = req.params.id;
    Restaurants.findByIdAndDelete(id, function(err,result){
        if(err){
            res.status(500).json("Huh.. Couldn't erase that...");
        }else{
            console.log(result+"Was deleted!");
        }
        });
    });

var PORT= process.env.PORT || 3000;
app.listen(PORT, function(){
    console.log("Listening on port %d", PORT)
});
