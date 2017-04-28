var keys = require("./keys.js");
var Twitter = require("twitter");
var input1 = process.argv[2];
var input2 = process.argv[3];
var spotify = require("spotify");
var request = require("request");
var fs = require("fs");
var data = "";

if (input1 === 'my-tweets') {
    myTweets(input2);
} else if (input1 === 'spotify-this-song') {
    spotifyThisSong(input2);
} else if (input1 === 'movie-this') {
    movieThis(input2);
} else if (input1 === 'do-what-it-says') {
    doWhatItSays()
};

function myTweets() {
    var client = new Twitter(keys.twitterKeys);
    var username = input2 || 'dacanesrock';
    fs.appendFileSync("log.txt", "-----------" + "\n" + "method: " + input1 + "\n" + "-----------");
    client.get('search/tweets', { q: username, count: '20' }, function(err, tweets, response) {
        for (var i = 0; i < tweets.statuses.length; i++) {
        	data = "Tweet " + (i + 1) +": " + tweets.statuses[i].text + "\n" +
        	'Date Created: ' + tweets.statuses[i].created_at + "\n" + 
        	"----------------------------";
        	console.log(data);
        	fs.appendFileSync("log.txt", "\n" + data + "\n");
        }
    });
};

function spotifyThisSong(input2) {
    var songInput = process.argv;
    var song = "";
    for (var i = 3; i < songInput.length; i++) {
        song += songInput[i] + "+";
    };
    if (song === "") { song = input2 || "the sign ace of base" };
    spotify.search({ type: 'track', query: song, limit: '1' }, function(err, data) {
        if (err) {
            console.log('Error occurred: ' + err);
            return;
        };
        data = 
        "----------------" + "\n" +
        "ARTIST: " + data.tracks.items[0].artists[0].name + "\n" +
        "TRACK NAME: " + data.tracks.items[0].name + "\n" +
        "PREVIEW LINK: " + data.tracks.items[0].preview_url + "\n" +
        "ALBUM: " + data.tracks.items[0].album.name + "\n" +
        "----------------";
        console.log(data);
        fs.appendFileSync("log.txt", "-----------" + "\n" + "method: " + input1 + "\n" + data + "\n" + "-----------");
    });
};

function movieThis(input2) {
    var titleInput = process.argv;
    var title = "";
    for (var i = 3; i < titleInput.length; i++) {
        title += titleInput[i] + "+";
    };
    if (title === "") { title = input2 || "mr nobody" };
    request({
        method: "GET",
        url: "http://www.omdbapi.com/?t=" + title,
    }, function(err, response, data) {
        if (err) {
            console.log('Error occurred: ' + err);
            return;
        };
        data = 
        "----------------" + "\n" + 
        "TITLE: " + JSON.parse(data).Title + "\n" +
        "YEAR RELEASED: " + JSON.parse(data).Year + "\n" +
        "IMDB RATING: " + JSON.parse(data).imdbRating + "\n" +
        "COUNTRY PRODUCED: " + JSON.parse(data).Country + "\n" +
        "LANGUAGE: " + JSON.parse(data).Language + "\n" +
        "PLOT: " + JSON.parse(data).Plot + "\n" +
        "ACTORS: " + JSON.parse(data).Actors + "\n" +
        // this breaks if your search pulls up a tv series
        // eg. 'twin peaks'
        "ROTTEN TOMATOES RATING: " + JSON.parse(data).Ratings[1].Value + "\n" +
        "METASCORE: " + JSON.parse(data).Metascore + "\n" +
        "----------------";
        console.log(data);
        fs.appendFileSync("log.txt", "-----------" + "\n" + "method: " + input1 + "\n" + data + "\n" + "-----------");
    });

};

function doWhatItSays() {
    fs.readFile('./random.txt', 'utf8', (err, data) => {
        fs.appendFileSync("log.txt", "-----------" + "\n" + "method: " + input1 + "\n" + data + "\n" + "-----------");    	
        if (err) throw err;
        var dataArray = data.split(",");
        input1 = dataArray[0];
        input2 = dataArray[1];
        if (input1 === 'my-tweets') {
		    myTweets();
		} else if (input1 === 'spotify-this-song') {
		    spotifyThisSong(input2);
		} else if (input1 === 'movie-this') {
		    movieThis(input2);
		} ;
    })
};
