const siteURL = 'https://deckofcardsapi.com/';
const newDeckEndpoint = 'https://deckofcardsapi.com/api/deck/new/';
const shuffleTheDeckEndpoint = (deckId) => `https://deckofcardsapi.com/api/deck/${deckId}/shuffle/`;
const drawCardsEndpoint = (deckId, amount) => `https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=${amount}`;
const header = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36',
};

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

async function drawCardsWithInjection(deckId, injection) {
    const drawResponse = await fetch(drawCardsEndpoint(deckId, injection), {method: 'GET', headers: header});

    return drawResponse;
}

async function drawCardsWithHeader(deckId, count) {
    const drawResponse = await fetch(drawCardsEndpoint(deckId, count), {method: 'GET', headers: header});

    return drawResponse;
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
    drawCardsWithInjection,
    drawCardsWithHeader,
};