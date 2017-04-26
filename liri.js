var keys = require("./keys.js");
var Twitter = require("twitter");
var input1 = process.argv[2];
var input2 = process.argv[3];
var spotify = require("spotify");
var request = require("request");
var fs = require("fs");

if (input1 === 'my-tweets') {
    myTweets();
} else if (input1 === 'spotify-this-song') {
    spotifyThisSong();
} else if (input1 === 'movie-this') {
    movieThis();
} else if (input1 === 'do-what-it-says') {
    doWhatItSays()
};

function myTweets() {
    var client = new Twitter(keys.twitterKeys);
    client.get('search/tweets', { q: 'dacanesrock', count: '20' }, function(err, tweets, response) {
        for (var i = 0; i < tweets.statuses.length; i++) {
            console.log('Tweet: ' + tweets.statuses[i].text);
            console.log('Date Created: ' + tweets.statuses[i].created_at);
            console.log("----------------------------")
        }
    });
};

function spotifyThisSong(input, song) {
    var songInput = process.argv;
    var song = "";
    for (var i = 3; i < songInput.length; i++) {
        song += songInput[i] + " ";
    };
    if (song === "") { song = "the sign ace of base" };
    spotify.search({ type: 'track', query: song, limit: '1' }, function(err, data) {
        if (err) {
            console.log('Error occurred: ' + err);
            return;
        };
        console.log("----------------")
        console.log("ARTIST: " + data.tracks.items[0].artists[0].name);
        console.log("TRACK NAME: " + data.tracks.items[0].name);
        console.log("PREVIEW LINK: " + data.tracks.items[0].preview_url);
        console.log("ALBUM: " + data.tracks.items[0].album.name);
        console.log("----------------")
    });
};

function movieThis() {
    var titleInput = process.argv;
    var title = "";
    for (var i = 3; i < titleInput.length; i++) {
        title += titleInput[i] + " ";
    };
    if (title === "") { title = "mr nobody" };
    request({
        method: "GET",
        url: "http://www.omdbapi.com/?t=" + title,
    }, function(err, response, data) {
        if (err) {
            console.log('Error occurred: ' + err);
            return;
        };
        console.log("----------------")
        console.log("TITLE: " + JSON.parse(data).Title);
        console.log("YEAR RELEASED: " + JSON.parse(data).Year);
        console.log("IMDB RATING: " + JSON.parse(data).Ratings[0].Value);
        console.log("COUNTRY PRODUCED: " + JSON.parse(data).Country);
        console.log("LANGUAGE: " + JSON.parse(data).Language);
        console.log("PLOT: " + JSON.parse(data).Plot);
        console.log("ACTORS: " + JSON.parse(data).Actors);
        console.log("ROTTEN TOMATOES RATING: " + JSON.parse(data).Ratings[1].Value);
        console.log("METASCORE: " + JSON.parse(data).Metascore);
        console.log("----------------")
    });
};

// //////////////////////
// this is a mess, i know
function doWhatItSays() {
    fs.readFile('./random.txt', 'utf8', (err, data) => {
        if (err) throw err;
        var dataArray = data.split(",");
        input1 = dataArray[0];
        input2 = dataArray[1];
        if (input1 === 'my-tweets') {
            myTweets();
        } else if (input1 === 'spotify-this-song') {
            function spotifyThisSong() {
            	var song = input2;
            	console.log(song);
                spotify.search({ type: 'track', query: song, limit: '1' }, function(err, data) {
                    if (err) {
                        console.log('Error occurred: ' + err);
                        return;
                    };
                    console.log("----------------")
                    console.log("ARTIST: " + data.tracks.items[0].artists[0].name);
                    console.log("TRACK NAME: " + data.tracks.items[0].name);
                    console.log("PREVIEW LINK: " + data.tracks.items[0].preview_url);
                    console.log("ALBUM: " + data.tracks.items[0].album.name);
                    console.log("----------------")
                });
            };
            spotifyThisSong();
        } else if (input1 === 'movie-this') {
            movieThis();
        };
    })
};