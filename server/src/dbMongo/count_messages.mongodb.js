const mongoose = require('../dbMongo/mongoose');
const Message = require('../models/mongoModels/Message');

async function countMessages () {
  try {
    const result = await Message.aggregate([
      {
        $match: {
          body: { $regex: /паровоз/i },
        },
      },
      {
        $count: 'total',
      },
    ]);

    console.log('Кількість повідомлень:', result.length ? result[0].total : 0);
    mongoose.connection.close();
  } catch (error) {
    console.error('Помилка при виконанні агрегації:', error);
    mongoose.connection.close();
  }
}

countMessages();
