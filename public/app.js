// Grab the articles as a json
$.getJSON("/articles", function(data) {
  console.log(data);
  // For each one
  for (var i = 0; i < data.length; i++) {
    // Display the apropos information on the page

    //var article = $("<div>");
    $("#articles").append("<p id='titleArt' data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].link + "</p>");
    // $("#articles").append("<form formDataId='" + data[i]._id + "' id='deleteNote' method='post' action='/deleteArticle'><input type='submit' value='Delete Article'></form>");
    $("#articles").append("<button data-id='" + data[i]._id + "' id='viewNotes' class='btn btn-primary'>View Notes</button>");
    // $("#articles").append("<form formDataId='" + data[i]._id + "' id='saveArticle' method='get' action='/saveArticle'><input type='submit' value='Save Article'></form>");
    $("#articles").append("<button data-id='" + data[i]._id + "' id='addNotes' class='btn btn-primary'>Add Notes</button>");

    //$("#articles").append(article);
  }
});



$(document).on("click", "#viewNotes", function() {
    //alert("working");
    $("#notes").empty();
    var thisId = $(this).attr("data-id");
    //alert(thisId);
    $.ajax({
        method: "GET",
        url: "/articles/" + thisId
    }).done(function(data){
        console.log(data.note);
        for (var i = 0; i < data.note.length; i++){
        $("#notes").append("<p note-id='" + data.note[i]._id + "'>" + data.note[i].body + "</p>" );
        $("#notes").append("<button data-id='" + data.note[i]._id + "' id='deleteNotes'>Delete Note</button>");
      }
    });
});


$(document).on("click", "#deleteNotes", function(){

  var thisId = $(this).attr("data-id");
  $("#notes").empty();

  console.log(thisId);

  $.ajax({

    method: "GET",
    url: "/deleteNote/" + thisId

  }).done(function(data){
      // console.log(data);
      // console.log("Data");

      //$("#notes").empty();
  })


});


// Whenever someone clicks a p tag
$(document).on("click", "#addNotes", function() {
  // Empty the notes from the note section
  $("#notes").empty();
  // Save the id from the p tag
  var thisId = $(this).attr("data-id");

  // Now make an ajax call for the Article
  $.ajax({
    method: "GET",
    url: "/articles/" + thisId
  })
    // With that done, add the note information to the page
    .done(function(data) {
      console.log(data);
      // The title of the article
      $("#notes").append("<h2>" + data.title + "</h2>");

      $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
      // A button to submit a new note, with the id of the article saved to it
      $("#notes").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");

      // If there's a note in the article
      if (data.note) {
        // Place the title of the note in the title input
       // $("#titleinput").val(data.note.title);
        // Place the body of the note in the body textarea
        $("#bodyinput").val(data.note.body);
      }
    });
});

// When you click the savenote button
$(document).on("click", "#savenote", function() {
  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("data-id");

  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
      // Value taken from title input
      //title: $("#titleinput").val(),
      // Value taken from note textarea
      body: $("#bodyinput").val()
    }
  })
    // With that done
    .done(function(data) {
      // Log the response
      console.log(data);
      // Empty the notes section
      $("#notes").empty();
    });

  // Also, remove the values entered in the input and textarea for note entry
  $("#titleinput").val("");
  $("#bodyinput").val("");
});
