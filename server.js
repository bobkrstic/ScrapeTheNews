// Dependencies
var express = require("express");
var mongojs = require("mongojs");
// Require request and cheerio. This makes the scraping possible
var request = require("request");
var cheerio = require("cheerio");

// Initialize Express
var app = express();


// set up a static folder (public) for our web app
app.use(express.static("public"));

// Database configuration
var databaseUrl = "newYorkTimes";
var collections = ["scrapedData"];

// Hook mongojs configuration to the db variable
var db = mongojs(databaseUrl, collections);

db.on("error", function(error) {
  console.log("Database Error:", error);
});

// Main route (simple Hello World Message)
app.get("/", function(req, res) {
  res.send("Hello world");
});

// Retrieve data from the db
app.get("/all", function(req, res) {
  // Find all results from the scrapedData collection in the db
  db.scrapedData.find({}, function(error, found) {
    // Throw any errors to the console
    if (error) {
      console.log(error);
    }
    // If there are no errors, send the data to the browser as json
    else {
      res.json(found);
    }
  });
});

// Scrape data from one site and place it into the mongodb db
app.get("/scrape", function(req, res) {
  // Make a request for the news section of ycombinator
  request("https://www.nytimes.com/", function(error, response, html) {
    // Load the html body from request into cheerio
    var $ = cheerio.load(html);
    // For each element with a "title" class
    $("h2.story-heading").each(function(i, element) {


      if (i > 5) {
        return false;
      }

      // Save the text and href of each link enclosed in the current element
      // will go into all children of the "h2.story-heading", and grab the text
      // for this below will grab the attribute "href" of all 'a' tags. 
        var link = $(element).children().attr("href");
        var title = $(element).children().text();

      // If this found element had both a title and a link
      if (title && link) {
        // Insert the data in the scrapedData db
        // here we use insert but we can also use 'save'
        db.scrapedData.insert({
          title: title,
          link: link
        },
        function(err, inserted) {
          if (err) {
            // Log the error if one is encountered during the query
            console.log(err);
          }
          else {
            // Otherwise, log the inserted data
            console.log(inserted);
          }
        });
      }
    });
  });

  // Send a "Scrape Complete" message to the browser
  res.send("Scrape Complete");
});


// Listen on port 3000
app.listen(3000, function() {
  console.log("App running on port 3000!");
});










































// var cheerio = require("cheerio");
// var request = require("request");

// // Make a request call to grab the HTML body from the site
// request("http://www.nytimes.com", function(error, response, html) {

//   // Load the HTML into cheerio and save it to a variable
//   // '$' becomes a shorthand for cheerio's selector commands, much like jQuery's '$'
//   var $ = cheerio.load(html);
//   //console.log(html);

//   // An empty array to save the data that we'll scrape
//   var results = [];

//   // Select each element in the HTML body from which you want information.
//   $("h2.story-heading").each(function(i, element) {

//     console.log(i);

//     if (i>5) {
//       return false;
//     }

//     var link = $(element).children().attr("href");
//     var title = $(element).children().text();

//     // Save these results in an object that we'll push into the results 
//     // array we defined earlier
//     results.push({
//       title: title,
//       link: link
//     });
//   });

//   // Log the results once you've looped through
//   // each of the elements found with cheerio
//   console.log(results);
// });
