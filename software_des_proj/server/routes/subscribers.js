const express = require('express');
const router = express.Router();
const Subscriber = require('../models/subscribers');
const cors = require('cors');




async function getSubscriberByUsername(req, res, next) {
  try {
    const subscriber = await Subscriber.findOne({ Username: req.params.username });
    if (!subscriber) {
      return res.status(404).json({ message: 'Subscriber not found' });
    }
    res.subscriber = subscriber;
    next();
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

async function getSubscriberHistoryByUsername(req, res, next) {
  try {
    const subscriber = await Subscriber.findOne({ Username: req.params.username });
    if (!subscriber) {
      return res.status(404).json({ message: 'Subscriber not found' });
    }
    res.subscriber = subscriber;
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
router.get('/username/:username/history', getSubscriberHistoryByUsername, (req, res) => {
  //console.log(res.subscriber.previousEntries);
  res.json(res.subscriber.previousEntries);
});




// PATCH request to update subscriber by username
router.patch('/username/:username', getSubscriberByUsername, async (req, res) => {
  
  try {
    const subscriber = res.subscriber;
    if (req.body.name != null) {
      subscriber.name = req.body.name;
    }
    if (req.body.Address1 != null) {
      subscriber.Address1 = req.body.Address1;
    }
    if (req.body.Address2 != null) {
      subscriber.Address2 = req.body.Address2;
    }
    if (req.body.City != null) {
      subscriber.City = req.body.City;
    }
    if (req.body.State != null) {
      subscriber.State = req.body.State;
    }
    if (req.body.Zipcode != null) {
      subscriber.Zipcode = req.body.Zipcode;
    }
    const updatedSubscriber = await subscriber.save();
    res.json(updatedSubscriber);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Deleting subscriber by username
router.delete('/username/:username', getSubscriberByUsername, async (req, res) => {
  try {
    await res.subscriber.deleteOne();
    res.json({ message: 'Deleted Subscriber' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Deleting all subscribers
router.delete('/', async (req, res) => {
  try {
    await Subscriber.deleteMany({});
    res.json({ message: 'Deleted all subscribers' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Validate subscriber credentials (username and password)
router.post('/validate', async (req, res) => {
  const { Username, Password } = req.body;
  try {
    const subscriber = await Subscriber.findOne({ Username, Password });
    if (subscriber) {
      res.json({ message: 'Credentials valid' });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Register a new subscriber
router.post('/register', async (req, res) => {
  //console.log("i got a request");
  const { Username, Password } = req.body;
  try {
    // Check if a subscriber with the same username already exists
    const existingSubscriber = await Subscriber.findOne({ Username });
    if (existingSubscriber) {
      return res.status(400).json({ message: 'Username already exists. Please choose a unique one.' });
    }

    // If the username is unique, create a new subscriber
    const newSubscriber = new Subscriber({ Username, Password });
    await newSubscriber.save();
    
    // Respond with success message
    res.status(201).json({ message: 'Subscriber registered successfully.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


async function getSubscriberDetailsByUsername(req, res, next) {
  try {
    const subscriber = await Subscriber.findOne({ Username: req.params.username });
    if (!subscriber) {
      return res.status(404).json({ message: 'Subscriber not found' });
    }
    res.subscriberDetails = {
      name: subscriber.name || null,
      Address1: subscriber.Address1 || null,
      Address2: subscriber.Address2 || null,
      City: subscriber.City || null,
      State: subscriber.State || null,
      Zipcode: subscriber.Zipcode || null
    };
    next();
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

async function getAddress1ByUsername(req, res, next) {
  try {
    const subscriber = await Subscriber.findOne({ Username: req.params.username });
    if (!subscriber) {
      return res.status(404).json({ message: 'Subscriber not found' });
    }
    res.address1 = subscriber.Address1;
    next();
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

// Getting subscriber details by username
router.get('/username/:username/details', getSubscriberDetailsByUsername, (req, res) => {
  res.json(res.subscriberDetails);
});

// Getting Address1 by username
router.get('/username/:username/address1', getAddress1ByUsername, (req, res) => {
 // console.log(res.address1);
  res.json({ Address1: res.address1 || null });
});

module.exports = router;



// Route to receive client information, calculate suggested price and total amount, save data, and respond to client
router.post('/calculate/:username', async (req, res) => {
  try {
    // Receive client information from request body
    const { gallonsRequested, deliveryAddress, deliveryDate } = req.body;
    const { username } = req.params;

    // Perform calculation based on client data
    const suggestedPricePerGallon = calculateSuggestedPrice(gallonsRequested, deliveryAddress, deliveryDate);
    const totalAmountDue = calculateTotalAmount(gallonsRequested, suggestedPricePerGallon);

    // Find the subscriber by username
    const subscriber = await Subscriber.findOne({ Username: username });
    if (!subscriber) {
      return res.status(404).json({ message: 'Subscriber not found' });
    }

    // Save client input data and calculated values to the database
    subscriber.previousEntries.push({
      gallonsRequested: gallonsRequested,
      deliveryAddress: deliveryAddress,
      deliveryDate: deliveryDate,
      suggestedPricePerGallon: suggestedPricePerGallon,
      totalAmountDue: totalAmountDue
    });
    await subscriber.save();

    // Respond to client with suggested price and total amount
   //console.log(totalAmountDue);
    res.json({ suggestedPricePerGallon, totalAmountDue });
  } catch (err) {
    // Handle errors
    res.status(500).json({ message: err.message });
  }
});

// Function to calculate suggested price per gallon based on client data (example calculation)
function calculateSuggestedPrice(gallonsRequested, deliveryAddress, deliveryDate) {
  // Example calculation logic (replace with your actual calculation)
  return gallonsRequested * 1.5; // Just an arbitrary example
}

// Function to calculate total amount due based on client data (example calculation)
function calculateTotalAmount(gallonsRequested, suggestedPricePerGallon) {
  // Example calculation logic (replace with your actual calculation)
  return gallonsRequested * suggestedPricePerGallon; // Just an arbitrary example
}

module.exports = router;
