let globals = {
    sources: {
        animalsSrc: './data/animals.json',
        professionsSrc: './data/professions.json'
    },
    data: {}
};


let validProfessions = 'validProfessions';
let invalidProfessions = 'invalidProfessions';
let db = new Db("armadillo-pirate", [validProfessions, invalidProfessions]);
let setIt = function () {
};
db.init();

// let store;
// let transaction;

$.ajax(globals.sources.animalsSrc).done(function (data) {
    globals.data.animals = data;
});

$.ajax(globals.sources.professionsSrc).done(function (data) {
    globals.data.professions = data;

    setIt = (function (professions) {
        let index = 0;
        return function () {
            console.log(`At Index: ${index} ${professions.length - index} Remaining!`);
            let rnd = (Math.random() * 3000) + 2000,
                profession = professions[index++];
            console.log('In Random:' + (rnd));
            fetchIt(profession);
            debugger;
            window.setTimeout(setIt, rnd);
        }

    })(globals.data.professions);

});

let $doIt = $('.do-it');

let wikiHref = 'https://en.wikipedia.org';
let googleSearchHref = 'https://www.google.nl/search?q=';
let wikiDescription = 'https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exintro=&explaintext=&titles=';


function fetchIt(choice) {

    $.ajax(
        {
            crossDomain: true,
            dataType: 'jsonp',
            url: wikiDescription + encodeURIComponent(choice.name)
        }
    ).done(
        function (data) {
            let pages = data.query.pages;
            let validResults = [];
            let invalidResults = [];
            for (let pageIndex in pages) {
                let page = pages[pageIndex];
                if (page.missing !== undefined) {
                    invalidResults.push(page)
                } else {
                    validResults.push(page)
                }
            }

            if (validResults.length > 1) {
                console.log("WE HAVE A WINNER!", validResults);
            }

            if (validResults.length) {
                console.log("YAY!");
                let validResult = validResults.pop();
                db.add(validProfessions, validResult);
            }
            else {
                let invalidResult = invalidResults.pop();
                db.add(invalidProfessions, invalidResult);

                console.log('FU');
            }
            console.log(data);
        }
    )
}


function doIt() {

    setIt();

}

$doIt.on('click', doIt);