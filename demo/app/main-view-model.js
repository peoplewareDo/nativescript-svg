var Observable = require("data/observable").Observable;
var SVG = require("nativescript-svg");
var svgParser = new SVG.ImageSourceSVG();

var path = '~/images/spider-test.svg';


function getMessage(counter) {
    if (counter <= 0) {
        return "Hoorraaay! You unlocked the NativeScript clicker achievement!";
    } else {
        return counter + " taps left";
    }
}

function createViewModel() {

    var loaded = svgParser.fromResource('images/spider-test.svg');
    if(loaded){
        console.log("object loaded");
    } else {
        console.log("error");
    }

    // var loaded = svgParser.loadFromFile(path);
    var viewModel = new Observable();
    viewModel.counter = 42;
    viewModel.message = getMessage(viewModel.counter);

    viewModel.message2 = loaded ? "there is object" : "there isn't object";

    viewModel.onTap = function() {
        this.counter--;
        this.set("message", getMessage(this.counter));
    }

    return viewModel;
}

exports.createViewModel = createViewModel;
