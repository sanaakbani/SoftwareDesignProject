const express = require('express');
const router = express.Router();
const { Subscriber, Credentials, PreviousEntries, encryptionKey, initializationVector } = require('../models/subscribers');
const crypto = require('crypto');

// Middleware to get subscriber by username
async function getSubscriberByUsername(req, res, next) {
  const username = req.params.username;
  try {
    const subscriber = await Subscriber.findOne({ Username: username });
    if (!subscriber) {
      return res.status(404).json({ message: 'Subscriber not found' });
    }
    res.subscriber = subscriber;
    next();
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

// Middleware to get subscriber credentials by username
async function getCredentialsByUsername(req, res, next) {
  const username = req.params.username;
  try {
    const credentials = await Credentials.findOne({ Username: username });
    if (!credentials) {
      return res.status(404).json({ message: 'Credentials not found' });
    }
    res.credentials = credentials;
    next();
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

// Getting all subscribers
router.get('/', async (req, res) => {
  try {
    const subscribers = await Subscriber.find();
    res.json(subscribers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Getting subscriber by username
router.get('/username/:username', getSubscriberByUsername, (req, res) => {
  res.json(res.subscriber);
});

// Getting previous history by username
router.get('/username/:username/history', getSubscriberByUsername, async (req, res) => {
  try {
    const previousEntries = await PreviousEntries.find({ Username: req.params.username });
    res.json(previousEntries);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Route to fetch address by username
router.get('/username/:username/address1', async (req, res) => {
  const { username } = req.params;
  try {
    // Find the subscriber by username
    const subscriber = await Subscriber.findOne({ Username: username });
    if (!subscriber) {
      return res.status(404).json({ message: 'Subscriber not found' });
    }
    // Respond with the address
    res.json({ Address1: subscriber.Address1 });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PATCH request to update subscriber by username
router.patch('/username/:username', getSubscriberByUsername, async (req, res) => {
  try {
    
    const subscriber = res.subscriber;
    const updatedFields = { ...req.body };
    if(updatedFields.name.length >50){
      res.status(400).json({ message: "Name too long" });
    }
    if(updatedFields.Address1.length >50){
      res.status(400).json({ message: "Address1 too long" });
    }
    if(updatedFields.Address2.length >50){
      res.status(400).json({ message: "Address2 too long" });
    }
    if(updatedFields.City.length >50){
      res.status(400).json({ message: "City too long" });
    }
    if(updatedFields.Zipcode.length >9 || updatedFields.Zipcode.length <5){
      res.status(400).json({ message: "ZipCode must be between 5 or 9" });
    }
    

    delete updatedFields.Username; // Prevent updating the username
    await Subscriber.updateOne({ Username: subscriber.Username }, { $set: updatedFields });
    res.json({ message: 'Subscriber updated successfully' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Deleting subscriber by username
router.delete('/username/:username', getSubscriberByUsername, async (req, res) => {
  try {
    await Subscriber.deleteOne({ Username: req.params.username });
    await Credentials.deleteOne({ Username: req.params.username }); // Also delete credentials
    await PreviousEntries.deleteMany({ Username: req.params.username }); // Also delete previous entries
    res.json({ message: 'Deleted Subscriber and associated data' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Validate subscriber credentials (username and password)
router.post('/validate', async (req, res) => {
  const { Username, Password } = req.body;
  try {
    const credentials = await Credentials.findOne({ Username });
    if (!credentials) {
      return res.status(401).json({ message: 'Invalid credentials 1' });
    }

    try {
      // Decrypt the stored password using the encryption key and IV
      const decipher = crypto.createDecipheriv('aes-256-cbc', encryptionKey, initializationVector);
      let decryptedPassword = decipher.update(credentials.Password, 'hex', 'utf8');
      decryptedPassword += decipher.final('utf8');
    
      // Compare the plaintext password with the decrypted stored password
      if (Password === decryptedPassword) {
        res.json({ message: 'Credentials valid' });
      } else {
        res.status(401).json({ message: 'Invalid credentials 2' });
      }
    } catch (err) {
      console.error('Decryption error:', err);
      res.status(500).json({ message: 'Decryption error' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// Register a new subscriber
router.post('/register', async (req, res) => {
  const { Username, Password } = req.body;
  try {
    const existingSubscriber = await Subscriber.findOne({ Username });
    if (existingSubscriber) {
      return res.status(400).json({ message: 'Username already exists. Please choose a unique one.' });
    }

    // Encrypt the password using the encryption key and IV
    const cipher = crypto.createCipheriv('aes-256-cbc', encryptionKey, initializationVector);
    let encryptedPassword = cipher.update(Password, 'utf8', 'hex');
    encryptedPassword += cipher.final('hex');

    // Store the encrypted password in the database
    await Credentials.create({ Username, Password: encryptedPassword });
    await Subscriber.create({ Username });
    await PreviousEntries.create({ Username });
    
    res.status(201).json({ message: 'Subscriber registered successfully.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});



// Route to receive client information, calculate suggested price and total amount, save data, and respond to client
router.post('/calculate/:username', async (req, res) => {
  try {
    const { gallonsRequested, deliveryAddress, deliveryDate } = req.body;
    const { username } = req.params;
    const state = await Subscriber.findOne({ Username: username });
    const history = await PreviousEntries.findOne({ Username: username });

    const suggestedPricePerGallon = calculateSuggestedPrice(gallonsRequested, state.State, deliveryDate, history.entries);
    const totalAmountDue = calculateTotalAmount(gallonsRequested, suggestedPricePerGallon);

    // Create the entry object
    const entry = {
      gallonsRequested: gallonsRequested,
      deliveryAddress: deliveryAddress,
      deliveryDate: deliveryDate,
      suggestedPricePerGallon: suggestedPricePerGallon,
      totalAmountDue: totalAmountDue
    };

    // Find the previous entries document for the given username
    let previousEntries = await PreviousEntries.findOne({ Username: username });

    // If no previous entries document exists, create a new one
    if (!previousEntries) {
      previousEntries = await PreviousEntries.create({
        Username: username,
        entries: [entry] // Create an array with the new entry
      });
    } else {
      // If previous entries exist, push the new entry to the entries array
      previousEntries.entries.push(entry);
      // Save the updated document
      await previousEntries.save();
    }

    // Respond with suggested price and total amount
    res.json({ suggestedPricePerGallon, totalAmountDue });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// Function to calculate suggested price per gallon based on client data
function calculateSuggestedPrice(gallonsRequested, deliveryAddress, deliveryDate, history) {
  const currentPricePerGallon = 1.50; // Constant
  const locationFactor = deliveryAddress.includes('TX') ? 0.02 : 0.04;
  const rateHistoryFactor = history.length > 0 ? 0.01 : 0;
  const gallonsRequestedFactor = gallonsRequested > 1000 ? 0.02 : 0.03;
  const companyProfitFactor = 0.10;

  const margin = currentPricePerGallon * (locationFactor - rateHistoryFactor + gallonsRequestedFactor + companyProfitFactor);
  const suggestedPricePerGallon = currentPricePerGallon + margin;
  return suggestedPricePerGallon.toFixed(2);
}

// Function to calculate total amount due based on client data
function calculateTotalAmount(gallonsRequested, suggestedPricePerGallon) {
  const totalAmount = gallonsRequested * suggestedPricePerGallon;
  return totalAmount.toFixed(2);
}

module.exports = router;