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

test.skip('Boundary tests for drawing cards', async () => {
    const deckId = "new";
    //draw max amount of cards
    const drawResponse = await apiHelper.drawCards(deckId, 52);

    expect(drawResponse.cards).toHaveLength(52);
    expect(drawResponse.remaining).toBe(0);
    //draw min amount of cards and check remaining cards

    const drawResponse2 = await apiHelper.drawCards(deckId, 1);

    expect(drawResponse2.cards).toHaveLength(1);
    expect(drawResponse2.remaining).toEqual(51);
})

test.skip('Negative for not valid deckId', async () => {
    //define not valid deckId
    const deckId = "newDeckId";
    //try to shuffle deck with non valid id
    const drawResponse1 = await apiHelper.shuffleTheDeck(deckId);
   // check response success attribute to be falsy
    expect(drawResponse1.success).toBeFalsy();
    //try to draw card from a deck with non valid id
    const drawResponse2 = await apiHelper.drawCards(deckId, 52);
    // check response success attribute to be falsy
    expect(drawResponse2.success).toBeFalsy();

})

test.skip('Concurrency test', async () => {
    //define new Id for each new shuffle deck request
    const deckId = "new";
    const shufflePromises = [];
    //make 10 shuffle request promises and push responses to array
    for (let i = 0; i < 10; i++) {
        shufflePromises.push(apiHelper.shuffleTheDeck(deckId));
    }
    //return promise when all promises in array are resolved
    const shuffleResults = await Promise.all(shufflePromises);
    expect(shuffleResults).toHaveLength(10);

})

test.skip('Security test', async () => {
    //define new deckId
    const deckId = "new";
    // Simulate an SQL injection attack
    const maliciousInput = "'; DROP TABLE decks; --";
    const drawResponse =  await apiHelper.drawCardsWithInjection(deckId, maliciousInput);
    //expected 400 bad request but we have 500 here would raise a defect
    expect(drawResponse.status).toEqual(400);
})

test.skip('Serialization - Json Response', async () => {
    //define new deckId
    const deckId = "new";
    // Ensure the response is valid JSON
    const drawResponse = await apiHelper.drawCards(deckId,1);
    //error in parsing json could be a bug
    expect(JSON.parse(drawResponse)).toBeDefined();
})

test.skip('Compatiability - different user agents in headers', async () => {
    //define new deckId
    const deckId = "new";
    //Use get request with different user agents in headers
    const drawResponse = await apiHelper.drawCardsWithHeader(deckId,1);
    expect(drawResponse.status).toEqual(200);
})

test.skip('Performance - measure response time', async () => {
    //define new deckId
    const deckId = "new";
    const startTime = Date.now();
    await apiHelper.drawCards(deckId, 1);
    const endTime = Date.now();
    const responseTime = endTime - startTime;
    //fails response is 423 could be a bug
    expect(responseTime).toBeLessThan(100); // Response should be fast
})





