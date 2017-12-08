function shuffle(array) { // Fisher-Yates Shuffle algorithm
    let currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}

function generateBoard(){ // generates clear board
	for(let i = 0; i < 16; i++)
		$(".deck").append("<li class='card'><i></i></li>");
}

function startNewGame(){
	$(".moves").text(0);
	$(".stars li").each(function(index){
		if($(this).children().attr("class") != "fa fa-star")
			$(this).children().attr("class", "fa fa-star");
	});
	let uniqueCards = ["diamond", "paper-plane-o", "anchor", "bolt", "cube", "leaf", "bicycle", "bomb"];
	let deck = shuffle(uniqueCards.concat(uniqueCards)); // as an argument we are using deck made of doubled unique cards
	generateBoard();
	$(".card").each(function(index){
		$(this).children().attr('class','fa fa-' + deck[index]);
		// number of card elements and cards in deck are the same so we can use index to distribute cards to HTML
	});
}

function restartGame(){
	$(".deck").empty(); 
	startNewGame();
}

function checkRating(movesNumber){
	if(movesNumber > 13)
		$(".stars li:nth-child(3)").children().attr("class", "fa fa-star-o");
	if(movesNumber > 17)
		$(".stars li:nth-child(2)").children().attr("class", "fa fa-star-o");
	if(movesNumber > 21)
		$(".stars li:nth-child(1)").children().attr("class", "fa fa-star-o");
}

function increaseMove(){
	let movesNumber = Number($(".moves").text());
	$(".moves").text(movesNumber+1);
	checkRating(movesNumber++); // because variable isn't increased on line 42
}

let clock = {
	sec: 55,
	min: 59,
	startTimer:
		setInterval(function(){
		clock.sec = clock.sec + 1;
		if(clock.sec >= 60) {
			clock.min++;
			clock.sec = 0;
		}
		if(clock.min >= 60){
			clearInterval(clock.startTimer);
			restartGame(); /* because this is short memory game
		that lasts few mintues, but not more than hour */
	}
		$(".timer").text(((clock.min < 10) ? "0" + clock.min : clock.min)+ ":" + ((clock.sec < 10) ? "0" + clock.sec : clock.sec));
	}, 1000)
};

clock.startTimer;


startNewGame();

// parameters for recognising when AnimateCSS animation finished
let animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';

let moves = 0;
let success = 0; // one card match is +1 success, 8 is limit because we have 16 cards
let activeCard = [null, null]; /* FORMAT: "index", "content"
I'm using this to remember first clicked card */
$(".deck").on("click", "li", function(){
	// we need to be sure that we don't handle opened or matched card
	if(!$(this).hasClass("open") && !$(this).hasClass("match")){
		if(activeCard[0] == null){ // if it is first card clicked, then make it active
			$(this).addClass("open show");
			activeCard[0] = $(this).index();
			activeCard[1] = $(this).children().attr("class");
		} else {
			$(this).addClass("open show"); 
			$(".deck li").bind('click', function(){ return false; }); // disable clicking on cards until line 41 or 50 unblocks it
			if($(this).children().attr("class") == activeCard[1]){
				$(this).removeClass("open show").addClass("match animated tada");
				$(".card").eq(activeCard[0]).removeClass("open show").addClass("match animated tada").one(animationEnd, function(){
					$(".deck li").unbind('click'); /* when animation is finished we will allow our user to click other cards.
					 I've done this to prevent opening more than 2 cards at the moment */
				});
				success++;
			} else {
				$(".card").eq(activeCard[0]).addClass("animated wobble red wrong").one(animationEnd, function(){
					$(this).removeClass("open show wrong animated wobble"); 
				}); // adding wobble antimation from AnimateCSS library and with .one we can do some action after animation is finished
				$(this).addClass("animated wobble red wrong").one(animationEnd, function(){
					$(this).removeClass("open show wrong animated wobble");
					$(".deck li").unbind('click');
				});
			}
			increaseMove();
			activeCard[0] = null; activeCard[1] = null; // clearing first selected card
		}
	}
});

$(".restart").click(function(){
	restartGame();
})