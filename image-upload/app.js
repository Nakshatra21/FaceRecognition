const express = require('express');
const multer = require('multer');
const ejs = require('ejs');
const path = require('path');
const bodyParser = require('body-parser');
let port = 3000;
// var profile_pic_name = 'hello';

// Set Storage Engine
const storage = multer.diskStorage({
    destination : './public/uploads',
    filename : function(req, file, cb){
        cb(null, `${req.body.first_name}` + path.extname(file.originalname));
            // cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

//Init Upload variable
const upload = multer({
    storage: storage,
}).single('profile_picture');


//Init App
const app = express();

// EJS
app.set('view engine', 'ejs');
app.use(express.static('./public'));

// Body Parser
app.use(bodyParser.urlencoded({extended:false}));

// Routing
app.get('/', (req, res, next)=>{
    let errors = [];
    res.render('signup', {errors:errors})
});

app.post("/validate", (req, res, next)=> {

    let errors = [];
 let formData = req.body;
 let {first_name, last_name, department, designation, email, password} = formData;
   

if(first_name === '' || last_name === '' || department === '' || designation === '' || email === '' || password === ''){
    errors.push({msg: "Please fill in all fields"});
}
if(password.length < 6){
    errors.push({msg: "Password must be minimum 6 characters"});
}

if(errors.length > 0) {
    console.log(errors);  
    res.render("signup", {errors: errors});
}else {
    let imageerrors = [];
    // console.log('Hello '+ first_name);
    res.render("imageloader", {first_name: first_name, imageerrors:imageerrors});
    }
});


app.post("/saveImage", (req, res, next)=> {
    let errors = [];
    console.log(req.body.first_name);
    upload(req, res, (err)=>{
        if(err){
            errors.push({msg: err});
            res.render('imageloader', {first_name: `${req.body.first_name}`,imageerrors:errors});
        }
        else {
            console.log(req.file);
            res.send('<h1>Profile Picture - Upload Successful !!</h1>');
        }
    });

});

 


app.listen(port, ()=>{
    console.log(`Server started at port ${3000}`);
});