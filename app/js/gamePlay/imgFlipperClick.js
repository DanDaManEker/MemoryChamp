
var GameBoard={
    card1:null, //done
    card2:null, //done
    gameBoardhtml:null, //Done
    imagePool:null, //done

    areAllCardsChosenTwice:function(){
        var x = 0;

        while(x < GameBoard.imagePool.length - 1) {
            if(GameBoard.imagePool[x].count!==2){
                return false;
            }
            x++;
        }
        return true;
    },
    validateCardLimit:function(){
        if (!GameBoard.card1 || !GameBoard.card2) { //this is amazing! this function checks to see if the 2 card limit has been made
            return true;
        }
        else return false;
    },
    flip:function(card) {
        if (!this.validateCardLimit()) {//card count = 3
            return false; //if the cards with html values then this function exits
        }
        if (!selectedCards[card.data("card-type")]) {

        }
        if (!card.hasClass("flipped")) { //if the function flip was triggred, and the card clicked does not have the class flipped,
            card.toggleClass('flipped'); // then make it have the class flipped
            gameObject.assignCards(card);
        }

    },
    disableCards:function() {
        console.log('disable Cards');
        this.resetCards();
     },
    flipBack:function() {
        console.log('flip back');
        if (GameBoard.card1 && GameBoard.card2) {
            GameBoard.card1.toggleClass('flipped');
            GameBoard.card2.toggleClass('flipped');
        }
    },
    resetCards:function() {
        GameBoard.card1 = null;
        GameBoard.card2 = null;
    },

    startClock:function() {
        counter = setInterval(this.UpdateTime, 1000);
    },
    UpdateTime:function() {
        countDown--;
        //var container = document.getElementById("timer");

        var $clockContainer = $("#timer");
        $clockContainer.html(countDown);
        if (countDown == 0) {
            this.clearInterval(counter);
            gameObject.roundEnd();
            countDown = GAMETIME;

            if(gameObject.$curPlayer.id == 1) {
                gameObject.$playerOne.hide();
                gameObject.$playerTwo.show();
                gameObject.$curPlayer.id = 2;
            }else{
                gameObject.$playerOne.show();
                gameObject.$playerTwo.hide();
                gameObject.$curPlayer.id = 1;
            }


            $( '#dialog-message' ).dialog( "open" );
        }
    }

};
var gameObject={
    $playerOne:null, //done
    $playerTwo:null, //done
    $curPlayer:null, //done
    finalScore:null, //done
    matchCount:null, //done


    renderCards:function() {

        var gameBoardhtml = document.getElementById("gameBoard");
        GameBoard.gameBoardhtml=gameBoardhtml;
        var currentImgIndex = 0;

        for (i = 0; GameBoard.areAllCardsChosenTwice()==false; i++) {
            if(currentImgIndex == 10){
                currentImgIndex = 0;
            }

            var sectionElem = document.createElement("section");
            sectionElem.className = "cardsContainer";
            gameBoardhtml.appendChild(sectionElem);

            var divElemCard = document.createElement("div");

            var curObject = this.getRandomImagePoolObject();
            divElemCard.setAttribute("data-card-type", curObject.position+"");
            divElemCard.className = "card";
            divElemCard.onclick = function () {
                GameBoard.flip($(this));
            };
            sectionElem.appendChild(divElemCard);

            //create front div
            var divElemCardFront = document.createElement("div");
            divElemCardFront.className = "front";
            divElemCard.appendChild(divElemCardFront);

            //create img elm
            var cardFront = document.createElement("img");
            cardFront.setAttribute("src", cardBackImg);
            divElemCardFront.appendChild(cardFront);

            var divElemCardBack = document.createElement("div");
            divElemCardBack.className = "back";
            divElemCard.appendChild(divElemCardBack);

            //create img elm
            var cardBack = document.createElement("img");
            cardBack.setAttribute("src", curObject.name);
            divElemCardBack.appendChild(cardBack);
            currentImgIndex++;
        }

    },

    getRandomImagePoolObject:function() {

        var random = Math.floor(Math.random() * 10);
        while(GameBoard.imagePool[random].count == 2){
            random = Math.floor(Math.random()* 10)
        }
        GameBoard.imagePool[random].count++;
        return GameBoard.imagePool[random];

    },
    checkMatch:function(choice1, choice2) {
        return choice1 === choice2;
    },
    assignCards:function(card) {
        if (!GameBoard.card1) {

            GameBoard.card1 = $(card);

        } else {
            GameBoard.card2 = $(card);
            var cardType1 = GameBoard.card1.data("card-type");
            var cardType2 = GameBoard.card2.data("card-type");
            if (this.checkMatch(cardType1, cardType2)) {
                this.addPoint();
                gameObject.$curPlayer.tries++;
                $('#clickCounter').html(gameObject.$curPlayer.tries);
                GameBoard.disableCards();
            } else {
                setTimeout(function () {
                        GameBoard.flipBack();
                        GameBoard.resetCards();
                        gameObject.$curPlayer.tries++;
                        $('#clickCounter').html(gameObject.$curPlayer.tries);
                    },
                    1000);//set timer 0.5 sec to flip back
            }
        }

    },
    addPoint:function() {
        gameObject.$curPlayer.points++;
        $('#clickCounter').html(gameObject.$curPlayer.tries); // Add 1 to the counter
        $('#pointCounter').html(gameObject.$curPlayer.points);
    },
    incrementeCurrentMatchNum:function() {
        this.matchCount++;
    //intersting, this is not called anywhere, could this be useless? have I just added matchnum++ instead?

    },
    calculateFinalScore:function() {
        var x = gameObject.$curPlayer.points;
        var y = gameObject.$curPlayer.tries;
        var z = countDown;
        var score = x - y + z;
        return score;
    },
    appendPlayerName:function(player1, player2){
        $('#playerOne').html(player1.name + ' is about to show '+ player2.name +' a devastating finish, or is he?');
        $('#playerTwo').html(player2.name + ' is about to whip '+ player1.name +' an unexpected counter, or will he?');
    },
    getUrlParameter:function(sParam) {
        var sPageURL = decodeURIComponent(window.location.search.substring(1)),
            sURLVariables = sPageURL.split('&'),
            sParameterName,
            i;

        for (i = 0; i < sURLVariables.length; i++) {
            sParameterName = sURLVariables[i].split('=');

            if (sParameterName[0] === sParam) {
                return sParameterName[1] === undefined ? true : sParameterName[1];
            }
        }
    },
    roundEnd:function(){
        gameObject.$curPlayer.tries = 0;
        $('#clickCounter').html(gameObject.$curPlayer.tries);
        if (gameObject.$curPlayer.id == 2) {
            this.endRound2();
        }else{this.endRound1();
        }
    },
     endRound:function() {

    gameObject.finalScore =  gameObject.calculateFinalScore();
    // resetAllCards();

},
 endRound2:function(){

    player2.totalScore =  gameObject.calculateFinalScore()+player2.totalScore;
    player2.points =0;
    this.endRound();
    console.log(player2.totalScore);
    $('#playerOneScore').html("WOW "+player1.name+" Bodacious Score Is: "+player1.totalScore);
    $('#playerTwoScore').html("WOW "+player2.name+" Bodacious Score Is: "+player2.totalScore);
    $("#dialog-message-end").dialog('open');

    //display onscreen winner function
},
 endRound1:function(){
    if (gameObject.$curPlayer.points == 20 || countDown === 0) {
        player1.totalScore =  gameObject.calculateFinalScore()+player1.totalScore;
        player1.points =0;
        console.log(player1.totalScore);
        for(var i = 0;i<GameBoard.imagePool.length;i++){
            GameBoard.imagePool[i].count = 0;
        }
        $("#gameBoard").empty();
        gameObject.renderCards();
        $("#dialog-message").dialog('open');

    }

    }
};

var player1={
    id:1, //done
    name:null, // done
    points:0, //done
    tries:0,//done
    totalScore:0
};
var player2={
    id:2, //done
    name:null, //done
    points:0,//done
    tries:0, //done
    totalScore:0
};
gameObject.$curPlayer=player1;

GameBoard.imagePool= [
    {name: "../images/bulgaria.jpg", position: 1, count:0},
    {name: "../images/baronIlanYahav.jpg", position: 2, count:0},
    {name: "../images/beverlyHills.jpg", position: 3, count:0},
    {name: "../images/cookie.JPG", position: 4, count:0},
    {name: "../images/feiry.jpg", position: 5, count:0},
    {name: "../images/zack.png", position: 6, count:0},
    {name: "../images/jeanny.jpg", position: 7, count:0},
    {name: "../images/motherFucker.jpg", position: 8, count:0},
    {name: "../images/mrMustache.jpg", position: 9, count:0},
    {name: "../images/sly.jpg", position: 10, count:0}
];
var cardBackImg = "../images/backsideBlue.png";

$('#clickCounter').text(gameObject.$curPlayer.tries);
$('#pointCounter').text(gameObject.$curPlayer.points);
//here i can add the multiplier function

//TODO probably the best place to place the multiplier function so it'll effect #pointCounter
// todo: need to  add this func to rounend()

var selectedCards = [];

$( document ).ready(function() {
    gameObject.renderCards(GameBoard.imagePool);
});
//TODO the scoring system haraa!!! needs to be point - tries + remaining time

$("#dialog-message").dialog({

    modal: true,
    buttons: {
        Ok: function() {
            gameObject.$playerOne = $('#playerOne');
            gameObject.$playerTwo = $('#playerTwo');

            if(gameObject.$curPlayer.id==1){
                gameObject.$curPlayer=player2;
            }else{
                gameObject.$curPlayer=player1;
            }
            startClock(gameObject.$playerOne,gameObject.$playerTwo);
            $( this ).dialog( "close" );
        }
    }
});

$("#dialog-message-end").dialog({
    autoOpen: false,
    modal: true,
    buttons: {
        Ok: function() {
            gameObject.renderCards();
        }
    }
});
//TODO set endGame to be when the time is over || all cards are flipped
