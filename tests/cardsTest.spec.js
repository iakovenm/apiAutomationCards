const {expect, test} = require('@playwright/test');
const apiHelper = require('./helpers/apiHelper.js');


test('Deck of Cards API Test', async () => {
    // Step 1: Check if the site is up
    const siteResponse = await apiHelper.getCardsPage();
    expect(siteResponse).toBe(200);

    // Step 2: Get a new deck
    const deckData = await apiHelper.getNewDeck();

    expect(deckData.success).toBeTruthy();

    const deckId = deckData.deck_id;

    // Step 3: Shuffle the deck
    const shuffleData = await apiHelper.shuffleTheDeck(deckId);

    expect(shuffleData.success).toBeTruthy();

    // Step 4: Deal three cards to each of two players
    const player1Hand = [];
    const player2Hand = [];

    for (let i = 0; i < 3; i++) {
        const drawResponse1 = await apiHelper.drawCards(deckId, 1);

        player1Hand.push(drawResponse1.cards[0].value);

        const drawResponse2 = await apiHelper.drawCards(deckId, 1);

        player2Hand.push(drawResponse2.cards[0].value);
    }

    /* Alternative solution without loop
     // Step 3: Deal three cards to each of two players
  const dealResponse = await fetch(`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=6`, {
    method: 'GET',
  });
  const dealData = await dealResponse.json();

  expect(dealData.success).toBeTruthy();
  const cards = dealData.cards;
  const player1Cards = cards.slice(0, 3);
  const player2Cards = cards.slice(3, 6);

     */

    // Step 5: Check whether either has blackjack

    const player1HasBlackjack = await apiHelper.hasBlackjack(player1Hand);
    const player2HasBlackjack = await apiHelper.hasBlackjack(player2Hand);

    // Step 6: If either has, write out which one does
    if (player1HasBlackjack) {
        console.log('Player 1 has blackjack!');
    } else if (player2HasBlackjack) {
        console.log('Player 2 has blackjack!');
    } else console.log('No player has blackjack!');
});