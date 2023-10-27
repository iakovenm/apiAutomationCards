const siteURL = 'https://deckofcardsapi.com/';
const newDeckEndpoint = 'https://deckofcardsapi.com/api/deck/new/';
const shuffleTheDeckEndpoint = (deckId) => `https://deckofcardsapi.com/api/deck/${deckId}/shuffle/`;
const drawCardsEndpoint = (deckId, amount) => `https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=${amount}`;

async function getCardsPage() {
    const siteResponse = (await fetch(siteURL, {method: 'GET'}));
    return siteResponse.status;
}

async function getNewDeck() {
    const newDeckResponse = await fetch(newDeckEndpoint, {method: 'GET'});
    const deckData = await newDeckResponse.json();

    return deckData;
}

async function shuffleTheDeck(deckId) {
    const shuffleResponse = await fetch(shuffleTheDeckEndpoint(deckId), {method: 'GET'});
    const shuffleData = await shuffleResponse.json();

    return shuffleData;
}

async function drawCards(deckId, amount) {
    const drawResponse = await fetch(drawCardsEndpoint(deckId, amount), {method: 'GET'});
    const drawData = await drawResponse.json();

    return drawData;
}

async function hasBlackjack(hand) {
    const hasAce = hand.includes('ACE');
    const has10PointCard = hand.includes('10') || hand.includes('JACK') || hand.includes('QUEEN') || hand.includes('KING');

    return hasAce && has10PointCard;
}

module.exports = {
    getCardsPage,
    getNewDeck,
    shuffleTheDeck,
    drawCards,
    hasBlackjack,
};