const mongoose = require('mongoose');
const crypto = require('crypto');

// Generate a random encryption key (256-bit)
const encryptionKey = crypto.randomBytes(32);
// Generate a random initialization vector (IV)
const initializationVector = crypto.randomBytes(16);

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
  },
});

// Middleware to encrypt password before saving
Credentials.pre('save', function(next) {
  const credentials = this;
  // Check if password has been modified or it's a new document
  if (!credentials.isModified('EncryptedPassword')) return next();
  
  // Create a cipher using AES-256-CBC algorithm with encryption key and IV
  const cipher = crypto.createCipheriv('aes-256-cbc', encryptionKey, initializationVector);
  
  // Encrypt the password
  let encryptedPassword = cipher.update(credentials.Password, 'utf8', 'hex');
  encryptedPassword += cipher.final('hex');
  
  // Update the EncryptedPassword field with the encrypted password
  credentials.Password = encryptedPassword;
  next();
});

module.exports = {
  Subscriber: mongoose.model('Subscriber', subscriberSchema),
  Credentials: mongoose.model('Credentials', Credentials),
  PreviousEntries: mongoose.model('PreviousEntries', previousEntriesSchema),
  encryptionKey,
  initializationVector
};



