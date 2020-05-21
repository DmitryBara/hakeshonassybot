// hours timestamp search = 1589133600
const { statFunctions, stats } = require('../src/stats');
const { describeDBSetupTeardown } = require('./lib/dbHelper');
const { dbClient } = require('../src/dbClient');
const messagesByHour = require('./__fixtures__/messagesByHourFixtures/correctData.json');
const messagesByDay = require('./__fixtures__/messagesByDayFixtures/correctData.json');
const messagesWorklessUser = require('./__fixtures__/messagesWorklessUser/correctData.json');

describeDBSetupTeardown();

describe('stats', () => {
  const addMessages = async (messages) => {
    await dbClient.queryMessages((col) => col.insertMany(messages));
  };

  describe('statByHour', () => {
    test('statByHour', async () => {
      await addMessages(messagesByHour);
      const data = await statFunctions.statByHour({ chatId: 1, messageTimestamp: 1589133600 });
      expect(data).toEqual({
        data: [
          {
            _id: 2,
            count: 3,
            first_name: 'test2',
            last_name: 'test2',
            username: 'test2',
          },
          {
            _id: 1,
            count: 2,
            first_name: 'test1',
            last_name: 'test1',
            username: 'test1',
          },
        ],
        name: stats.HOUR_MESSAGE_COUNT,
      });
    });

    test('empty data', async () => {
      const data = await statFunctions.statByHour({ chatId: 1, messageTimestamp: 1589133600 });
      expect(data).toEqual({
        data: [], name: stats.HOUR_MESSAGE_COUNT,
      });
    });
  });

  describe('statByDay', () => {
    test('statByDay', async () => {
      await addMessages(messagesByDay);
      const data = await statFunctions.statByDay({ chatId: 1, messageTimestamp: 1589155200 });
      expect(data).toEqual({
        data: [
          {
            _id: 2,
            count: 3,
            first_name: 'test2',
            last_name: 'test2',
            username: 'test2',
          },
          {
            _id: 1,
            count: 2,
            first_name: 'test1',
            last_name: 'test1',
            username: 'test1',
          },
        ],
        name: stats.TODAY_MESSAGE_COUNT,
      });
    });

    test('empty data', async () => {
      const data = await statFunctions.statByDay({ chatId: 1, messageTimestamp: 1589155200 });
      expect(data).toEqual({
        data: [], name: stats.TODAY_MESSAGE_COUNT,
      });
    });
  });

  describe('worklessUser', () => {
    test('worklessUser', async () => {
      await addMessages(messagesWorklessUser);
      const data = await statFunctions.worklessUser({ chatId: 1, messageTimestamp: 1588982400 });
      expect(data).toEqual({
        data:
            [{
              _id: 2,
              count: 3,
              first_name: 'test2',
              last_name: 'test2',
              username: 'test2',
            }],
        name: stats.WORKLESS_USER,
      });
    });

    test('empty data', async () => {
      const data = await statFunctions.worklessUser({ chatId: 1, messageTimestamp: 1588982400 });
      expect(data).toEqual({
        data: [],
        name: stats.WORKLESS_USER,
      });
    });
  });
});
