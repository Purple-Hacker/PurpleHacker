image('https://jeffalo.net/projects/kahoot-answer/funny.jpg', 25)
var results = [];

fetch('https://kahoot.it/rest/challenges/' + document.location.href.split('challenge/')[1] + '/answers')
    .then(response => response.json())
    .then(data => parse(data));


function parse(data) {
    data.challenge.kahoot.questions.forEach(item => {
        //console.log(item.choices)
        let result = item.choices.find(obj => {
            return obj.correct === true
        })
        result.indexed = item.choices.indexOf(result)
        results.push(result)
    })
}

function answer(choice) {
    if(document.querySelector('div[data-functional-selector="answer-' + choice.indexed + '"]')){
        document.querySelector('div[data-functional-selector="answer-' + choice.indexed + '"]').click()
    }
}
var i = 0;
function answerThis() {
    var localChallenge = JSON.parse(localStorage.getItem('kahoot-challenge_session'))
    if (results[localChallenge[document.location.href.split('challenge/')[1]].completedGameBlockIndex] == null) {
        answer(results[results.length - 1])
    } else {
        answer(results[localChallenge[document.location.href.split('challenge/')[1]].completedGameBlockIndex])
    }
    i++
}

document.addEventListener('keypress', e=>{
    if(e.keyCode == 32) answerThis()
})

function image(url, size = 100) {
    var image = new Image();
    image.onload = function () {
        var style = [
            'font-size: 1px;',
            'padding: ' + this.height / 100 * size + 'px ' + this.width / 100 * size + 'px;',
            'background: url(' + url + ') no-repeat;',
            'background-size: contain;'
        ].join(' ');
        console.log('%c ', style);
    };
    image.src = url;
};
