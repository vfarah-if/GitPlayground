import dotenv from "dotenv";
import express from "express";
import path from "path";

// initialize configuration
dotenv.config();

const app = express();
const port = process.env.SERVER_PORT; // default port to listen

// Configure Express to use EJS
app.set( "views", path.join( __dirname, "views" ) );
app.set( "view engine", "ejs" );

// define a route handler for the default home page
app.get( "/", ( req, res ) => {
  // render the index template
  res.render( "index" );
} );

// start the express server
app.listen( port, () => {
  // tslint:disable-next-line:no-console
  console.log( `server started at http://localhost:${ port }` );
});
