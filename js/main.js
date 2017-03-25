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

function displayEm(choice) {
    $armadillo.html(choice.animal.name);
    $pirate.html(choice.profession.name);
    $goToTheSource
        .attr('href', wikiHref + choice.animal.link)
        .html(`WTF is the ${choice.animal.name} ?`);
    $goGoogleItYouLazySloth.attr('href', googleSearchHref + choice.profession.name)
        .html(`${choice.profession.name}? Seriously ??`);
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
                imageName;
            outer:
                for (let i in pages) {
                    let page = pages[i];
                    for (let image of page.images) {
                        console.log(image.title.toLowerCase());
                        console.log(choice.animal.name.toLowerCase());
                        if (image.title.toLowerCase().search(choice.animal.name.toLowerCase()) > -1) {
                            imageName = image.title;

                            continue outer;
                        }
                    }
                }
            console.log('imageName???', imageName);
            if (imageName !== undefined) {
                let wikiImageSrcLing = wikiImageSrc.replace('IMAGE_NAME', encodeURIComponent(imageName));
                console.log(wikiImageSrcLing);
                $.ajax(
                    {
                        crossDomain: true,
                        dataType: 'jsonp',
                        url: wikiImageSrcLing
                    }
                ).done(function (data) {
                    console.log("FOUND AN IMAGE???", data);
                    let pages = data.query.pages,
                        imageSrc;
                    for (let i in pages) {
                        let page = pages[i];
                        imageSrc = page.imageinfo[0].url;
                    }
                    console.log(imageSrc);
                    $('.the-container-of-the-place-where-you-see-it').css({'background-image': `url("${imageSrc}")`});
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