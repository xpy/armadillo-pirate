let globals = {
    sources: {
        animalsSrc: './data/animals.json',
        professionsSrc: './data/professions.json'
    },
    data: {}
};


let validProfessions = 'validProfessions';
let invalidProfessions = 'invalidProfessions';

// let store;
// let transaction;

$.ajax(globals.sources.animalsSrc).done(function (data) {
    globals.data.animals = data;
});

$.ajax(globals.sources.professionsSrc).done(function (data) {
    globals.data.professions = data;
});

let $doIt = $('.do-it');
let $armadillo = $('.armadillo');
let $pirate = $('.pirate');
let $theContainerOfThePlaceWhereYouSeeIt = $('.the-container-of-the-place-where-you-see-it');
let $goToTheSource = $('.go-to-the-source');
let $goGoogleItYouLazySloth = $('.go-google-it-you-lazy-sloth');
let wikiHref = 'https://en.wikipedia.org';
let googleSearchHref = 'https://www.google.nl/search?q=';

let wikiDescription = 'https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exintro=&explaintext=&titles=';
let wikiImageName = 'https://en.wikipedia.org/w/api.php?format=json&action=query&prop=images&titles=';
let wikiImageSrc = 'https://en.wikipedia.org/w/api.php?format=json&action=query&titles=IMAGE_NAME&prop=imageinfo&iiprop=url';


function findEm() {
    let animalsLength = globals.data.animals.length;
    let professionsLength = globals.data.professions.length;

    let randomNumberToFindRandomAnimal = Math.floor(Math.random() * animalsLength);
    let randomNumberToFindRandomProfession = Math.floor(Math.random() * professionsLength);

    let randomAnimal = globals.data.animals[randomNumberToFindRandomAnimal];
    let randomProfession = globals.data.professions[randomNumberToFindRandomProfession];
    return {
        choice: {
            animal: randomAnimal, profession: randomProfession
        },
        indexes: {
            animalIndex: randomNumberToFindRandomAnimal,
            professionIndex: randomNumberToFindRandomProfession
        }
    }
}

function getQuestion(thing) {
    let indefiniteArticle = ['a', 'e', 'o', 'i', 'u'].includes(thing[0]) ? 'an' : 'a',
        phrases = [
            `WTF is ${indefiniteArticle} ${thing}?`,
            `${thing}, seriously?`,
            `${thing}? Give me a break!`,
            `${thing}? Is that even a thing?`,
            `I've never heard of ${indefiniteArticle} ${thing} in my life!`,
            `Who did you call ${indefiniteArticle} ${thing}?`
        ]

    return phrases[Math.floor(Math.random() * phrases.length)]

}

function displayEm(choice) {
    $theContainerOfThePlaceWhereYouSeeIt.empty();
    $armadillo.html(choice.animal.name);
    $pirate.html(choice.profession.name);

    $goToTheSource
        .attr('href', wikiHref + choice.animal.link)
        .html(getQuestion(choice.animal.name));
    $goGoogleItYouLazySloth.attr('href', googleSearchHref + choice.profession.name + ' profession')
        .html(getQuestion(choice.profession.name));
    $.ajax(
        {
            crossDomain: true,
            dataType: 'jsonp',
            url: wikiImageName + encodeURIComponent(choice.animal.name)
        }
    ).done(
        function (data) {
            console.log(data);
            let pages = data.query.pages,
                images = [];
            for (let i in pages) {
                let page = pages[i];
                for (let image of page.images || []) {
                    if (image.title.toLowerCase().search(choice.animal.name.toLowerCase()) > -1) {
                        images.push(image.title);
                    }
                }
            }
            for (let image of images) {
                let wikiImageSrcLing = wikiImageSrc.replace('IMAGE_NAME', encodeURIComponent(image));
                $.ajax(
                    {
                        crossDomain: true,
                        dataType: 'jsonp',
                        url: wikiImageSrcLing
                    }
                ).done(function (data) {
                    let pages = data.query.pages,
                        imageSrc;
                    for (let i in pages) {
                        let page = pages[i];
                        imageSrc = page.imageinfo[0].url;
                    }
                    if (imageSrc.search(/\.(webm|ogv|ogg)$/) >= 0) {
                        $theContainerOfThePlaceWhereYouSeeIt.append($('<div>').append(`<video autoplay controls width="250"><source src="${imageSrc}"></video>`));
                    } else {
                        $theContainerOfThePlaceWhereYouSeeIt.append($('<div>').append(`<img src="${imageSrc}"/>`));
                    }
                })
            }
        }
    );
    if (false) {
        $.ajax(
            {
                crossDomain: true,
                dataType: 'jsonp',
                url: wikiDescription + encodeURIComponent(choice.profession.name)
            }
        ).done(
            function (data) {
                let pages = data.query.pages;
                console.log(pages);
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
                }
                else {
                    console.log('FU');
                }
                console.log(data);
            }
        )
    }
}

function doIt() {
    let result = findEm();
    displayEm(result.choice);

}

$doIt.on('click', doIt);