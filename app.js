var express = require('express');
var mysql = require('mysql');
var bodyParser = require('body-parser')
var app = express();
var con = mysql.createConnection({
    host:"localhost",
    user:'root',
    password:"",
    database:"studentresult"
})

con.connect();

app.use(bodyParser.urlencoded({ extended: false }))
app.set("view engine",'ejs');

// ---------------- Main-Page ------------------- //
app.get('/',(req,res)=>{
    res.render('Main-Page');    
})


// ---------------- School-Login ------------------- //
app.get('/School-Login',(req,res)=>{
    res.render('School-Login');
})

app.post("/School-Login", (req, res) => {

    var email = req.body.email;
    var password = req.body.password;
    var query = "SELECT * FROM school WHERE email = '" + email + "' AND password = '" + password + "'";
    con.query(query, (err, result) => {
        if (err) throw err;
        if (result.length > 0) {
            res.redirect("/School-Page");
        } else {
            res.render("School-Login");
        }
    })
});

// ---------------- School-Logout ------------------- //
app.get('/Logout-School',(req,res)=>{
    res.redirect('School-Login');
})

// ---------------- Staff-Login ------------------- //
var email_login;
app.get('/Staff-Login',(req,res)=>{
    res.render('Staff-Login');
})

app.post("/Staff-Login", (req, res) => {

    var email = req.body.email;
    var password = req.body.password;
    var query = "SELECT * FROM staff WHERE email = '" + email + "' AND password = '" + password + "'";
    con.query(query, (err, result) => {
        if (err) throw err;
        if (result.length >= 1) {
            email_login = result[0].email; 
            res.redirect("/Staff-Page");
        } else {
            res.render("Staff-Login");
        }
    })
})

// ---------------- Student-Logout ------------------- //
app.get('/Logout-Staff',(req,res)=>{
    res.redirect('Staff-Login');
})


// ---------------- Student-Login ------------------- //
var student_email;
app.get('/Student-Login',(req,res)=>{
    res.render('Staff-Login');
})

app.post("/Student-Login", (req, res) => {

    var email = req.body.email;
    var password = req.body.password;
    var query = "SELECT * FROM student WHERE email = '" + email + "' AND password = '" + password + "'";
    con.query(query, (err, result) => {
        if (err) throw err;
        if (result.length >= 1) {
            student_email=result[0].email;
            res.redirect("/Student-Page");
        } else {
            res.render("Student-Login");
        }
    })
})

// ---------------- Student-Logout ------------------- //
app.get('/Logout-Student',(req,res)=>{
    res.redirect('Student-Login');
})

// ---------------- School-Page ------------------- //
app.get('/School-Page',(req,res)=>{
    res.render('School-Page');
})

// ---------------- Staff-Page ------------------- //
app.get('/Staff-Page',(req,res)=>{
    res.render('Staff-Page');
})

// ---------------- Student-Page ------------------- //
app.get('/Student-Page',(req,res)=>{
    res.render('Student-Page');
})

// ---------------- School-Page [Add-Std]------------------- //
app.get('/Add-Std',(req,res)=>{
    res.render('Add-Std');
})

app.post("/Add-Std", (req, res) => {
    var std = req.body.std;
    var query = "insert into standard (std) VALUES ('" + std + "')";
    con.query(query, (error, result,index) => {
        if (error) throw error;
        res.redirect("/School-Page");
    })
})

// ---------------- School-Page [Add-Std-Div]------------------- //
app.get('/Add-Std-Div',(req, res) => {
    var query = "SELECT * FROM standard";
    con.query(query, (err, result) => {
        if (err) throw err;
        if (result.length > 0) {
            res.render('Add-Std-Div', {result });
        }
    })
})

app.post("/Add-Std-Div", (req, res) => {
    var std = req.body.std;
    var div = req.body.div;
    var query = "insert into std_div (std, divi) VALUES ('" + std + "', '" + div + "')";
    con.query(query, (error, result,index) => {
        if (error) throw error;
        res.redirect("/School-Page");
    })
})

// ---------------- School-Page [View-Std-Div]------------------- //
app.get('/View-Std-Div',(req, res) => {
    var query = "SELECT * FROM std_div";
    con.query(query, (err, result) => {
        if (err) throw err;
        if (result.length >= 1) {
            res.render('View-Std-Div', {result });
        }
    })
})

app.post("/View-Std-Div", (req, res) => {
    var std = req.body.std;
    var div = req.body.div;
    var query = "SELECT * FROM student WHERE std = '" + std + "' AND divi = '" + div + "'";
    con.query(query, (err, result) => {
        if (err) throw err;
        if (result.length > 0) {
            res.render('View-Student', {result });
        }
        else
        {
            res.redirect('/View-Std-Div');
        }
    })
})


// ---------------- School-Page [Add-Staff]------------------- //
app.get('/Add-Staff',(req,res)=>{
    var query ="select * from std_div";
    con.query(query,(err,result)=>{
        if(err) throw err;
        if(result.length>0){
            res.render('Add-Staff',{result});
        }
    })
})

app.post("/Add-Staff", (req, res) => {
    var name = req.body.name;
    var email = req.body.email;
    var password = req.body.password;
    var std = req.body.std;
    var div = req.body.div;
    var query = "insert into staff (name, email, password, std, divi) VALUES ('" + name + "', '" + email + "', '" + password + "', '" + std + "', '" + div + "')";
    con.query(query, (error, result,index) => {
        if (error) throw error;
        res.redirect("/School-Page");
    })
})

// ---------------- School-Page [Add-Student]------------------- //
app.get('/Add-Student',(req,res)=>{
    var query ="select * from std_div";
    con.query(query,(err,result)=>{
        if(err) throw err;
        if(result.length>0){
            res.render('Add-Student',{result});
        }
    });
})

app.post("/Add-Student", (req, res) => {
    var name = req.body.name;
    var email = req.body.email;
    var std = req.body.std;
    var div = req.body.div;
    var password = req.body.password;
    var query = "insert into student (name, email, std,password, divi) VALUES ('" + name + "', '" + email + "', '" + std + "','" + password + "', '" + div + "')";
    con.query(query, (error, result,index) => {
        if (error) throw error;
        res.redirect("/School-Page");
    })
})

// ---------------- School-Page [View-Staff]------------------- //
app.get('/View-Staff',(req,res)=>{
    var query = "SELECT * FROM staff";
    con.query(query, (err, result) => {
        if (err) throw err;
        res.render("View-Staff",{result});
    })
})

// ---------------- School-Page [Manage-Staff]------------------- //
app.get('/Manage-Staff',(req,res)=>{
    var query = "SELECT * FROM staff";
    con.query(query, (err, result) => {
        if (err) throw err;
        res.render("Manage-Staff",{result});
    })
})

// ---------------- School-Page [Delete-Staff]------------------- //
app.get('/Delete-Staff/:id',(req,res)=>{
    var id = req.params.id;
    var query = "DELETE FROM staff WHERE id = '" + id + "'";
    con.query(query, (err, result) => {
        if (err) throw err;
        res.redirect("/Manage-Staff");
    })
})

// ---------------- School-Page [Update-Staff]------------------- //
app.get('/Update-Staff/:id',(req,res)=>{
    var id = req.params.id;
    var query = "SELECT * FROM staff WHERE id ="+id;
    con.query(query, (err, result) => {
        if (err) throw err;
        res.render("Update-Staff",{result});
    })
})

app.post("/Update-Staff/:id", (req, res) => {
    var id = req.params.id;
    var name = req.body.name;
    var email = req.body.email;
    var password = req.body.password;
    var std = req.body.std;
    var div = req.body.div;
    var query = "UPDATE staff SET name=?, email=?, password=?, std=?, divi=? WHERE id=?";

    con.query(query,[name, email, password, std, div, id], (error, result,index) => {
        if (error) throw error;
        res.redirect("/Manage-Staff");
    })
})

// ---------------- School-Page [Top3-Result]------------------- //
app.get('/Top3-Result',(req,res)=>{
    var query = "SELECT * FROM std_div";
    con.query(query, (err, result) => {
        if (err) throw err;
        if (result.length >= 1) {
            res.render('Top3-Result', {result });
        }
    })
})

app.post("/Top3-Result", (req, res) => {
    var std = req.body.std;
    var div = req.body.div;
    var query = "SELECT * FROM result WHERE std = '" + std + "' AND divi = '" + div + "' ORDER BY percentage DESC LIMIT 3";
    con.query(query, (err, result) => {
        if (err) throw err;
        if (result.length > 0) {
            res.render('Top3-View', { result });
        } else {
            res.render('Top3-Result');
        }
    });
});


// ---------------- Staff-Page [View-Staff-Student]------------------- //
app.get('/View-Staff-Student',(req,res)=>{
    var query = "SELECT * FROM staff where email = '" + email_login + "';";
    con.query(query, (err, result) => {
        if (err) throw err;
        if(result.length>=1)
        {
            
            var query = "SELECT * FROM student where divi = '" + result[0].divi + "' and std = '" + result[0].std + "'";
            con.query(query, (err, result1) => {
                if (err) throw err;
                console.log(result1);
                res.render("View-Staff-Student",{result1});
            })
        }
        else{
            res.redirect("/Staff-Page");
        }
    })
})

// ---------------- Staff-Page [Add-Student-Result]------------------- //
app.get('/Add-Student-Result',(req,res)=>{
    var query = "SELECT * FROM staff where email = '" + email_login + "';";
    con.query(query, (err, result) => {
        if (err) throw err;
        if(result.length>=1)
        {
            
            var query = "SELECT * FROM student where divi = '" + result[0].divi + "' and std = '" + result[0].std + "'";
            con.query(query, (err, result1) => {
                if (err) throw err;
                console.log(result1);
                res.render("Add-Student-Result",{result1});
            })
        }
        else{
            res.redirect("/Staff-Page");
        }
    })
})

// ---------------- Staff-Page [Add-Result]------------------- //
app.get('/Add-Result/:id',(req,res)=>{
    var id = req.params.id;
    var query = "SELECT * FROM student WHERE id ="+id;

    
    con.query(query, (err, result) => {
        if (err) throw err;
        res.render("Add-Result",{result});
        console.log(result);
    })
})

app.post("/Add-Result/:id", (req, res) => {
    var id = req.params.id;
    var sub1 = req.body.sub1;
    var sub2 = req.body.sub2;
    var sub3 = req.body.sub3;
    var sub4 = req.body.sub4;
    var sub5 = req.body.sub5;
    var total = parseInt(sub1) + parseInt(sub2) + parseInt(sub3) + parseInt(sub4) + parseInt(sub5);
    var percentage = parseInt(total) /5;
    var max = Math.max(sub1,sub2,sub3,sub4,sub5);
    var min = Math.min(sub1,sub2,sub3,sub4,sub5);
    var grade;
    var temp=0;
    var status;
    if(percentage>90){
        grade = "A+";
    }
    else if(percentage>80){
        grade = "A";
    }
    else if(percentage>70){
        grade = "B+";
    }
    else if(percentage>60){
        grade = "B";
    }
    else if(percentage>50){
        grade = "C";
    }
    else if(percentage>40){
        grade="D"
    }
    else{
        grade="***";
    }

    if(sub1>35){
        temp = temp+1;
    }
    if(sub2>35){
        temp = temp+1;
    }
    if(sub3>35){
        temp = temp+1;
    }
    if(sub4>35){
        temp = temp+1;
    }
    if(sub5>35){
        temp = temp+1;
    }

    if(temp==5){
        status = "Pass";
    }
    else if(temp==1 || temp==2){
        status = "Fail";
    }
    else{
        status = "ATKT";
    }

    var query = "SELECT * FROM student WHERE id ="+id;
    con.query(query, (err, result) => {
        if (err) throw err;
        if(result.length>=1)
        {
            var query = "INSERT INTO result (sid, name, email,std,divi, sub1, sub2, sub3, sub4, sub5, total, percentage,min,max,grade,status) VALUES ('"+result[0].id+"','"+result[0].name+"','"+result[0].email+"','"+result[0].std+"','"+result[0].divi+"','"+sub1+"', '"+sub2+"', '"+sub3+"', '"+sub4+"', '"+sub5+"', '"+total+"', '"+percentage+"', '"+min+"', '"+max+"', '"+grade+"', '"+status+"')";

            con.query(query, (err, result) => {
                if (err) throw err;
            })
            res.redirect("/Add-Student-Result");
        }
    })   
})

// ---------------- Staff-Page [View-Result]------------------- //
app.get('/View-Result',(req,res)=>{
    var query = "SELECT * FROM staff where email = '" + email_login + "';";
    con.query(query, (err, result) => {
        if (err) throw err;
        if(result.length>=1)
        {
            
            var query = "SELECT * FROM result where divi = '" + result[0].divi + "' and std = '" + result[0].std + "'";
            con.query(query, (err, result1) => {
                if (err) throw err;
                console.log(result1);
                res.render("View-Result",{result1});
            })
        }
        else{
            res.redirect("/Staff-Page");
        }
    })
})

// ---------------- Staff-Page [Manage-Result]------------------- //
app.get('/Manage-Result',(req,res)=>{
    var query = "SELECT * FROM staff where email = '" + email_login + "';";
    con.query(query, (err, result) => {
        if (err) throw err;
        if(result.length>=1)
        {
            
            var query = "SELECT * FROM result where divi = '" + result[0].divi + "' and std = '" + result[0].std + "'";
            con.query(query, (err, result1) => {
                if (err) throw err;
                console.log(result1);
                res.render("Manage-Result",{result1});
            })
        }
        else{
            res.redirect("/Staff-Page");
        }
    })
})

// ---------------- Staff-Page [Delete-Result]------------------- //
app.get('/Delete-Result/:id',(req,res)=>{
    var id = req.params.id;
    var query = "DELETE FROM result WHERE id = "+id;
    con.query(query, (err, result) => {
        if (err) throw err;
        res.redirect("/Manage-Result");
    })
})

// ---------------- Staff-Page [Update-Result]------------------- //
app.get('/Update-Result/:id',(req,res)=>{
    var id = req.params.id;
    var query = "SELECT * FROM result WHERE id = "+id;
    con.query(query, (err, result) => {
        if (err) throw err;
        res.render("Update-Result",{result});
    })
})

app.post('/Update-Result/:id',(req,res)=>{
    var id = req.params.id;
    var sub1 = req.body.sub1;
    var sub2 = req.body.sub2;
    var sub3 = req.body.sub3;
    var sub4 = req.body.sub4;
    var sub5 = req.body.sub5;
    var total = parseInt(sub1) + parseInt(sub2) + parseInt(sub3) + parseInt(sub4) + parseInt(sub5);
    var percentage = parseInt(total) /5;
    var max = Math.max(sub1,sub2,sub3,sub4,sub5);
    var min = Math.min(sub1,sub2,sub3,sub4,sub5);
    var grade;
    var temp1=0;
    var status;
    if(percentage>90){
        grade = "A+";
    }
    else if(percentage>80){
        grade = "A";
    }
    else if(percentage>70){
        grade = "B+";
    }
    else if(percentage>60){
        grade = "B";
    }
    else if(percentage>50){
        grade = "C";
    }
    else if(percentage>40){
        grade="D"
    }
    else{
        grade="***";
    }

    if(sub1>35){
        temp1 = temp1+1;
    }
    if(sub2>35){
        temp1 = temp1+1;
    }
    if(sub3>35){
        temp1 = temp1+1;
    }
    if(sub4>35){
        temp1 = temp1+1;
    }
    if(sub5>35){
        temp1 = temp1+1;
    }

    if(temp1==3){
        status = "ATKT";
    }
    else if(temp1==1 || temp1==2){
        status = "Fail";
    }
    else{
        status = "PASS";
    }
    var query = "UPDATE result SET sub1 = '"+sub1+"', sub2 = '"+sub2+"', sub3 = '"+sub3+"', sub4 = '"+sub4+"', sub5 = '"+sub5+"', total = '"+total+"', percentage = '"+percentage+"', min = '"+min+"', max = '"+max+"', grade = '"+grade+"', status = '"+status+"' WHERE id = "+id;
    con.query(query, (err, result) => {
        if (err) throw err;
        res.redirect("/Manage-Result");
    })
})

// ---------------- Student-Page [Student-Result]------------------- //
app.get('/Student-Result',(req,res)=>{
    var query = "SELECT * FROM result where email = '" + student_email + "';";
    con.query(query, (err, result) => {
        if (err) throw err;
        res.render("Student-Result",{result});
    })
})

app.listen(3000);