const jwt = require('jsonwebtoken');
//import user_data from user.js
const user = require('../../model/user_data');
const secret = "secret"
    
module.exports = (app) => {

    app.post("/login", (req, res) => {
        const { body } = req;
        const { username } = body;
        //const { password } = body;
        
       
        
        if(!req.cookies.access_token) {
            const token = jwt.sign({role: "user" }, "YOUR_SECRET_KEY");
        return res
          .cookie("access_token", token, {
            httpOnly: false,
            secure: process.env.NODE_ENV === "production",
          })
          .status(200)
          .json({ message: "Logged in successfully" });
        }  
        else{
            console.log("cookie is not null");
            const token_valid = jwt.sign({role: "admin" }, "YOUR_SECRET_KEY");
            
            jwt.verify(req.cookies.access_token, "YOUR_SECRET_KEY", (err, authorizedData) => {
                if(err || authorizedData.role !== "admin") {
                    //If error send Forbidden (403)
                    console.log('ERROR: Could not connect to the protected route');
                    res.sendStatus(401);
                } else {
                    //If token is successfully verified, we can send the autorized data 
                   return res.json({
                        message: 'Successful log in',
                        authorizedData
                    }).sendStatus(200);
                    console.log('SUCCESS: Connected to protected route');
                }
            });
        }
        
      });
      

    //This is a protected route 
    const authorization = (req, res, next) => {
        const token = req.cookies.access_token;
        if (!token) {
          return res.sendStatus(403);
        }
        try {
          const data = jwt.verify(token, "YOUR_SECRET_KEY");
          req.userId = data.id;
          req.userRole = data.role;
          return next();
        } catch {
          return res.sendStatus(403);
        }
      };
    app.get('/login', checkToken, (req, res) => {
        const token = req.cookies.access_token;
        //verify the JWT token generated for the user
        
        jwt.verify(token, secret, (err, authorizedData) => {
            if(err || !token || authorizedData.role !== 'admin') {
                //If error send Forbidden (403)
                console.log('ERROR: Could not connect to the protected route');
                res.sendStatus(403);
            } else {
                //If token is successfully verified, we can send the autorized data 
                res.json({
                    message: 'Successful log in',
                    authorizedData
                }).sendStatus(200);
                console.log('SUCCESS: Connected to protected route');
            }
        });
    });



        app.get("/logout", authorization, (req, res) => {
            return res
            .clearCookie("access_token")
            .status(200)
            .json({ message: "Successfully logged out " });
        });
       
    }
    
    
//Check to make sure header is not undefined, if so, return Forbidden (403)
const checkToken = (req, res, next) => {
    const header = req.headers['authorization'];

    if(typeof header !== 'undefined') {
        const bearer = header.split(' ');
        const token = bearer[1];

        req.token = token;
        next();
    } else {
        //If header is undefined return Forbidden (403)
        res.sendStatus(403)
    }
}