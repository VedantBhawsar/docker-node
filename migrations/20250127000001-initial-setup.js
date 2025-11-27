/**
 * Initial database setup migration
 * Creates indexes and initial collections
 */

module.exports = {
  async up(db, client) {
    // Create items collection with indexes
    await db.createCollection('items');
    await db.collection('items').createIndex({ createdAt: -1 });
    await db.collection('items').createIndex({ updatedAt: -1 });

    // Insert sample data
    await db.collection('items').insertMany([
      {
        name: 'Sample Item 1',
        description: 'This is a sample item',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Sample Item 2',
        description: 'Another sample item',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

    console.log('Initial setup migration completed');
  },

  async down(db, client) {
    // Rollback: drop the items collection
    await db.collection('items').drop();
    console.log('Initial setup migration rolled back');
  },
};
