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
      maxlength: 100,
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
    maxlength: 50,
    required: false
  },
  Address1: {
    type: String,
    maxlength: 100,
    required: false,
    default: ''
  },
  Address2: {
    type: String,
    maxlength: 100,
    required: false,
    default: ''
  },
  City: {
    type: String,
    maxlength: 100,
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
    validate: {
      validator: function(v) {
        return /^[0-9]{5,9}$/.test(v.toString());
      },
      message: props => `${props.value} is not a valid zipcode!`
    }
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
  if (!credentials.isModified('Password')) return next();
  
  // Create a cipher using AES-256-CBC algorithm with encryption key and IV
  const cipher = crypto.createCipheriv('aes-256-cbc', encryptionKey, initializationVector);
  
  // Encrypt the password
  let encryptedPassword = cipher.update(credentials.Password, 'utf8', 'hex');
  encryptedPassword += cipher.final('hex');
  
  // Update the Password field with the encrypted password
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