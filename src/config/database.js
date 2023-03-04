const mongoose = require('mongoose');
const config = require('config');

const connect = () => {
  const uri =  config.get('mongoUrl');
  const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // useCreateIndex: true
  };
  mongoose.connect(uri, options);
  mongoose.set('debug', config.get('DB_DEBUG'));
  mongoose.connection.on(
    'error',
    console.error.bind(console, 'connection error:')
  );
  mongoose.connection.once('open', () => {
    console.log('connected');   
  });
}

module.exports = { connect };

