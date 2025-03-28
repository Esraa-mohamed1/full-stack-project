import mongoose from 'mongoose';

mongoose.connect('mongodb+srv://admin:admin@cluster0.0k7ap.mongodb.net/ecommerce-admin')
  .then(() => console.log('Successfully connected to the database'))
  .catch(err => console.error('Error connecting to the database: ', err));
