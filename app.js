const express = require('express');
const multer = require('multer');
const ejs = require('ejs');
const path = require('path');
const bodyParser = require('body-parser');
const fs = require('fs');
let port = 3000;
var flag = 1;

// Set Storage Engine
const storage1 = multer.diskStorage({
    destination : function(req,file,cb){
        
            let folderName =   `./public/uploads/${req.body.first_name}_${req.body.emp_id}`;
            // console.log(folderName);
            if(!fs.existsSync(folderName)){

                fs.mkdirSync(folderName);
            }

            let dest = folderName;  
            cb(null, dest);
        },
    
    filename : function(req, file, cb){
        if(flag === 1){
            flag++;
            cb(null, `${req.body.first_name}_${req.body.emp_id}_1` + path.extname(file.originalname));
        }else {
            cb(null, `${req.body.first_name}_${req.body.emp_id}_2` + path.extname(file.originalname));
        }
        // cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});


//Init Upload variable
const upload_1 = multer({
    storage: storage1,
}).array('profile_picture_1',2);

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
 
 let {first_name, last_name, department, emp_id, email, password} = formData;
//   console.log("emp id "  + formData.emp_id);
//   console.log("first name"+ formData.first_name);
    

if(first_name === '' || last_name === '' || department === '' || emp_id === '' || email === '' || password === ''){
    errors.push({msg: "Please fill in all fields"});
}
if(password.length < 6){
    errors.push({msg: "Password must be minimum 6 characters"});
}

if(errors.length > 0) {
    // console.log(errors);  
    res.render("signup", {errors: errors});
}else {
    let imageerrors = [];
    // console.log('Hello '+ first_name);
    let emp_id = formData.emp_id;
    let first_name = formData.first_name;
    res.render("imageloader", {first_name: first_name, emp_id: emp_id, imageerrors:imageerrors});
    }
});


app.post("/saveImage", (req, res, next)=> {
    let errors = [];
    let flag = true;
    // console.log(req.body.emp_id);
    

    upload_1(req, res, (err)=>{
        if(err){
            if(err.code === 'LIMIT_UNEXPECTED_FILE'){
                errors.push({msg: "Maximum Image uploads is Only 2!"});
            }
            // console.log(err);
            flag = false;
            res.render('imageloader', {first_name: `${req.body.first_name}`, emp_id:`${req.body.emp_id}`, imageerrors:errors});
        }
        else {
            // console.log(req.file);
            flag = true;
            console.log('2 File Uploads  Successfull');
            res.send('<h1>File Uploads Successful!</h1>');
        }
    });   
});


app.listen(port, ()=>{
    console.log(`Server started at port ${3000}`);
});