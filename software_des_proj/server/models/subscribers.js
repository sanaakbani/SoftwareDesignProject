const mongoose = require('mongoose');

// for previous entries
const previousEntriesSchema = new mongoose.Schema({
  Username: {
    type: String,
    required: true,
    unique: true
  },
  entries: [{
    gallonsRequested: {
      type: Number,
      required: true
    },
    deliveryAddress: {
      type: String,
      required: true
    },
    deliveryDate: {
      type: Date,
      required: true
    },
    suggestedPricePerGallon: {
      type: Number,
      required: true
    },
    totalAmountDue: {
      type: Number,
      required: true
    }
  }]
});



//user info
const subscriberSchema = new mongoose.Schema({
  Username: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: false
  },
  Address1: {
    type: String,
    required: false,
    default: ''
  },
  Address2: {
    type: String,
    required: false,
    default: ''
  },
  City: {
    type: String,
    required: false,
    default: ''
  },
  State: {
    type: String,
    required: false,
    default: ''
  },
  Zipcode: {
    type: Number,
    required: false,
    default: 0
  }


});


const Credentials = new mongoose.Schema({
  Username: {
    type: String,
    required: true,
    unique: true
  },
  Password: {
    type: String,
    required: true
  }
});

module.exports = {
  Subscriber: mongoose.model('Subscriber', subscriberSchema),
  Credentials: mongoose.model('Credentials', credentialsSchema),
  PreviousEntries: mongoose.model('PreviousEntries', previousEntriesSchema)
};



