var config = {
  apiKey: "AIzaSyBDkNLmn020tGpGaP5zhSuAscQMCeo6Saw",
  authDomain: "train-scheduler-ff41e.firebaseapp.com",
  databaseURL: "https://train-scheduler-ff41e.firebaseio.com",
  projectId: "train-scheduler-ff41e",
  storageBucket: "train-scheduler-ff41e.appspot.com",
  messagingSenderId: "757882666760"
};

firebase.initializeApp(config);

var database = firebase.database();
// Initial Values
var trainName = "";
var destination = "";
var firstTrainTime = "";
var frequency = 0;

// Button for adding trains
$("#add-train").on("click", function (event) {
    
    event.preventDefault();

    // Logic for storing and retrieving the most recent user.
    trainName = $("#trainName").val().trim();
    destination = $("#destination").val().trim();
    // Grabbing the value and displaying it in 24-hr format moment(randomdate, randomformat)
    firstTrainTime = moment($("#firstTime").val(), "HH:mm").format("HH:mm");
    frequency = $("#frequency").val();
    
    // Code for the push to the database
    database.ref().push({

        trainName: trainName,
        destination: destination,
        firstTime: firstTime,
        frequency: frequency,
        dateAdded: firebase.database.ServerValue.TIMESTAMP
    });

    // Clears all text boxes
    $("#trainName").val("");
    $("#destination").val("");
    $("#firstTime").val("");
    $("#frequency").val("");
});

// Firebase event for adding trains to the database and row in the html when user adds an entry
database.ref().on("child_added", function (childSnapshot) {

    console.log(childSnapshot.val());

    // Store everything into a variable.
    var sv = childSnapshot.val();

    // console log the last user's data
    console.log(sv.trainName);
    console.log(sv.destination);
    console.log(sv.firstTime);
    console.log(sv.frequency);

    //sec from 1970 till firstTime
    var firstTimeConverted = moment(sv.firstTime, "HH:mm");
    //alert("firstTimeconverted " + firstTimeConverted);

    //minutes from first train
    var trMinutesFromFirst = moment().diff(moment(firstTimeConverted), "minutes");
    //alert("minutes from first train: " + trMinutesFromFirst);

    //minutes till next train
    var trMinutesLeft = sv.frequency - (trMinutesFromFirst % sv.frequency);
    //alert("Minutes till next train: " + trMinutesLeft);

    var nextArrival = moment().add(trMinutesLeft, "minutes").format("HH:mm");
    // alert("Next arrival " + nextArrival);
    
    var newRow = $("<tr>").append(
        $("<td>").text(sv.trainName),
        $("<td>").text(sv.destination),
        $("<td>").text(sv.frequency),
        $("<td>").text(nextArrival),
        $("<td>").text(trMinutesLeft),
    );

    // Append the new row to the table
    $("#trainTable > tbody").append(newRow);
    
    // function (errorObject) {
    //     console.log("Errors handled: " + errorObject.code);
    // };

});
    