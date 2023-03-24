const express = require("express");

//Crear una instancia de la aplicación.
const app = express();

// Middleware para manejar peticiones con datos de formulario.
app.use(express.urlencoded({ extended: false }));

// Middleware para manejar peticiones con datos en formato JSON.
app.use(express.json());

// Cargar variables de entorno desde archivo .env
const dotenv = require("dotenv");
dotenv.config({ path: "./env/.env" });

// Middleware para servir archivos estáticos en la ruta /resources
app.use("/resources", express.static("public"));
app.use("/resources", express.static(__dirname + "public"));

//establecemos el motor de plantilla
app.set("view engine", "ejs");

//invocamos a bcryptjs
const bcryptjs = require("bcryptjs");

//variables de sesion
const sesion = require("express-session");
app.use(
  sesion({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);

//invocamos al modulo de conexion de la bd

const connection = require ('./database/db');
const e = require("express");

      app.get("/", (req, res) => {
        res.render("index",{msg:"Mensaje desde Node"});
      });


      app.get("/login", (req, res) => {
        res.render("login");
      });

      app.get("/register", (req, res) => {
        res.render("register",);
      });
    
//Registracion
app.post('/register', async (req,res) =>{
  const user = req.body.user;
  const name = req.body.name;
  const rol = req.body.rol;
  const pass = req.body.pass;
  const email = req.body.email;
  const nficha = req.body.nficha;
  const nombrePrograma = req.body.nombrePrograma;
  const telefono = req.body.telefono;
  const genero = req.body.genero;


  //Encriptar la password
  let passworHaash = await bcryptjs.hash(pass,8);

  //consulta bd
  connection.query('INSERT INTO users SET ?',{user:user, name:name, rol:rol, pass:passworHaash, email:email, nficha:nficha, nombrePrograma:nombrePrograma, telefono:telefono, genero:genero}, async(error,results)=>{
    if(error){
      console.log(error)
    } else{
      res.render('register',{
        alert:true,
        alertTitle: 'Registration',
        alertMessage:'!Successful Registration',
        alertIcon: 'success',
        showConfirmButton:false,
        timer:1500,
        ruta: ''
      })
    }
  })

})


//Autenticacion
app.post('/auth',async (req,res)=>{
  const user = req.body.user;
  const pass = req.body.pass;
  let passwordHaash = await bcryptjs.hash(pass, 8);
  

  if(user && pass){
    connection.query('SELECT * FROM users  WHERE user = ?',[user],async (error,results)=>{
      if(results.length == 0 || !(await bcryptjs.compare (pass, results[0].pass))){
          res.render('login',{
            alert:true,
            alertTitle:'Error',
            alertMessage:'Usuario y/o password incorrectas',
            alertIcon:'error',
            showConfirmButton: true,
            timer: false,
            ruta:'login'
          });
      }else{
        req.session.name= results[0].name
        res.render('login',{
          alert:true,
          alertTitle:'Conexion Exitosa',
          alertMessage:'Login Correcto!',
          alertIcon:'success',
          showConfirmButton: true,
          timer: 1500,
          ruta:''
        });
      }
    })
  }
})

app.listen(3000, (req, res) => {
  console.log("Servidor Corriendo En http://localhost:3000");
});
