/*

App functions
1. Allows user to train card counting with varies amount decks and speeds
2. User can choose how many decks they want to use and how fast between each deal or deal the cards themselves
3.It will keep track of the count and when player want to check count, they can enter their count to check

*/

//possible combo of a card
const suits = ['Heart', 'Diamond', 'Spades', 'Clubs'];
const values = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
let deckCollection = [];
let numOfDecks,
  speedOfDeal = 0,
  userCount,
  currCard,
  currCardPic,
  currCount = 0,
  autoPlay;

//creat a card class
class Card {
  constructor(suits, values) {
    this.suit = suits;
    this.value = values;
    this.countValue = null;
  }
}

//creat a deck class
class Deck {
  constructor() {
    this.deck = [];
  }

  //create a shuffled deck
  createDeck(suits, values) {
    for (let suit of suits) {
      for (let value of values) {
        this.deck.push(new Card(suit, value));
      }
    }

    //shuffle alg
    let counter = this.deck.length,
      temp,
      i;

    while (counter) {
      i = Math.floor(Math.random() * counter--);
      temp = this.deck[counter];
      this.deck[counter] = this.deck[i];
      this.deck[i] = temp;
    }

    //add count value to cards
    this.deck.map((item) => {
      switch (item.value) {
        case 1:
          item.countValue = -1;
          break;
        case 2:
        case 3:
        case 4:
        case 5:
        case 6:
          item.countValue = 1;
          break;
        case 7:
        case 8:
        case 9:
          item.countValue = 0;
          break;
        case 10:
        case 11:
        case 12:
        case 13:
          item.countValue = -1;
          break;
        default:
          return null;
      }
    });
  }

  //get cards
  getCards() {
    return this.deck;
  }
}

//init
let newGame = () => {
  //reset everything
  deckCollection = [];
  currCount = 0;
  document.querySelector('#current-card').style.display = 'none';
  document.querySelector('#result').style.display = 'none';
  document.querySelector('#actual-count').style.display = 'none';
  document.getElementById('decks-left').textContent = 0;
  document.getElementById('count').value = null;
  document.getElementById('amount-of-decks').value = null;
  document.getElementById('deal-speed').value = null;

  //clear autoplay
  clearInterval(autoPlay);

  //remove event listener
  document.getElementById('next-card').removeEventListener('click', dealCard);
  document
    .getElementById('submit-stop')
    .removeEventListener('click', checkCount);

  //add event listener
  document.getElementById('start-game').addEventListener('click', startGame);
};

//set auto play
let autoDeal = () => {
  autoPlay = setInterval(dealCard, speedOfDeal);
};

//stop auto play
let stopDeal = () => {
  //clear autoplay
  clearInterval(autoPlay);

  //change stop button to stop button
  document.getElementById('submit-stop').textContent = 'Submit';
  document.getElementById('submit-stop').addEventListener('click', checkCount);
};

//dealCard
let dealCard = () => {
  //check how many cards left
  if (deckCollection.length <= 0) {
    document.querySelector('#next-card').style.display = 'none';
  } else {
    //deal a card
    currCard = deckCollection.pop();

    //keep track of count
    currCount += currCard.countValue;

    //display the card
    currCardPic = document.getElementById('current-card');
    document.querySelector('#current-card').style.display = 'block';
    currCardPic.src = 'cards/' + currCard.value + currCard.suit[0] + '.jpg';

    //display and update decks left
    document.getElementById('decks-left').textContent = Math.floor(
      deckCollection.length / 52
    );

    console.log(currCount);
  }
};

//check count
let checkCount = () => {
  //grab input
  userCount = document.getElementById('count').value;
  //check input
  if (userCount == currCount) {
    document.querySelector('#result').textContent = 'Correct!';
    document.querySelector('#actual-count').textContent =
      'Actual Count: ' + currCount;
  } else {
    document.querySelector('#result').textContent = 'Wrong!';
    document.querySelector('#actual-count').textContent =
      'Actual Count: ' + currCount;
  }
  //display result
  document.querySelector('#result').style.display = 'block';
  document.querySelector('#actual-count').style.display = 'block';

  //remove event
  document.getElementById('next-card').removeEventListener('click', dealCard);
  document
    .getElementById('submit-stop')
    .removeEventListener('click', checkCount);
};

//start game
let startGame = () => {
  //grab the amount of decks
  numOfDecks = document.getElementById('amount-of-decks').value;

  //create the deck
  for (let i = 0; i < numOfDecks; i++) {
    let deck = new Deck();
    deck.createDeck(suits, values);
    deckCollection.push(...deck.getCards());
  }

  //display decks left
  document.getElementById('decks-left').textContent = Math.floor(
    deckCollection.length / 52
  );

  //remove event listener
  document.getElementById('start-game').removeEventListener('click', startGame);

  //grab the speed of the deal
  speedOfDeal = document.getElementById('deal-speed').value * 1000;
  if (speedOfDeal > 0) {
    autoDeal();
    document.getElementById('submit-stop').textContent = 'Stop';
    document.getElementById('submit-stop').addEventListener('click', stopDeal);
  } else {
    //click only
    document.getElementById('next-card').addEventListener('click', dealCard);
    document
      .getElementById('submit-stop')
      .addEventListener('click', checkCount);
  }
};

newGame();
document.getElementById('new-game').addEventListener('click', newGame);
