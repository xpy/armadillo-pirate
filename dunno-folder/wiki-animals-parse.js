var allData = [];
function getData(el) {
    var $el = $(el).find('a');
    $el.each(function (index, row) {
        var $row = $(row);
        var textString = ('/wiki/' + $row.text()).replace(' ', '_');
        if (textString !== $row.attr('href')) {
            console.log(textString, $row.attr('href'));
        }
        allData.push({name: $row.text(), link: $row.attr('href')});
    })
    ;
}

$('h3').each(function (index, elem) {
    var $next = $(elem).next();
    console.log($next);
    if ($next.is('.div-col')) {
        getData($next);
    }
});

JSON.stringify(allData);


var allData = [];

function getData(el) {
    var el = el.querySelector('a');
    allData.push({name: el.innerHTML});
}

var elements = $0.querySelectorAll('li');
elements.forEach(function (elem) {
        getData(elem);
});

JSON.stringify(allData);
