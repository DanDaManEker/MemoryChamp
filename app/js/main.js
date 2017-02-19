$( function() {
    player1.name = getUrlParameter('name1');
    player2.name = getUrlParameter('name2');
    gameObject.appendPlayerName(player1,player2);

    $("#dialog-message" ).dialog({
        modal: true,
        buttons: {
            Ok: function() {
                gameObject.$playerOne = $('#playerOne');
                gameObject.$playerTwo = $('#playerTwo');

                GameBoard.startClock( gameObject.$playerOne, gameObject.$playerTwo);
                $( this ).dialog( "close" );
            }
        }
    });
} );
var getUrlParameter = gameObject.getUrlParameter(sParam);
//weird, why is this an issue if i Try to do player1.name?
