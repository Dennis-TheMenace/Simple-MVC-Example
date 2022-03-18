// pull in our models. This will automatically load the index.js from that folder
const models = require('../models');
const Cat = models.Cat;

// default fake data so that we have something to work with until we make a real Cat
const defaultData = {
  name: 'unknown',
  bedsOwned: 0,
};

let lastAdded = new Cat(defaultData);

const hostIndex = (req, res) => {
  res.render('index', {
    currentName: lastAdded.name,
    title: 'Home',
    pageName: 'Home Page'
  });
};

const hostPage1 = async (req, res) => {
  try
  {
    const docs = await Cat.find({}).lean().exec();

    return res.render('page1', {cats: docs});
  }
  catch (err)
  {
    console.log(err);
    return res.status(500).json({error: 'Failure to retrieve cat data'});
  }
};

const hostPage2 = (req, res) => {
  res.render('page2');
};

const hostPage3 = (req, res) => {
  res.render('page3');
};

const getName = (req, res) => {
  return res.json({name: lastAdded.name});
};

const setName = async (req, res) => {
  if (!req.body.firstname || !req.body.lastname || !req.body.beds) {
    return res.status(400).json({ error: 'firstname,lastname and beds are all required' });
  }
  
  const catData = 
  {
    name: `${req.body.firstname} ${req.body.lastname}`,
    bedsOwned: req.body.beds,
  };

  const newCat = new Cat(catData);

  try
  {
    await newCat.save();

    lastAdded = newCat;
    return res.json(
    {
      name: lastAdded.name,
      beds: lastAdded.bedsOwned,
    });
  }
  catch (err)
  {
    console.log(err);
    return res.status(500).json({error: 'Error'});
  }
};

const searchName = async (req, res) => {
  if (!req.query.name) {
    return res.status(400).json({ error: 'Name is required to perform a search' });
  }

  try
  {
    const doc = await Cat.findOne({name: req.query.name}).select('name bedsOwned').exec();

    if(!doc)
    {
      return res.json({message: 'No cats found'});
    }
    return res.json({name: doc.name, beds: doc.bedsOwned});
  }
  catch (err)
  {
    return res.status(500).json({error: 'Something went wrong!'});
  }
};

const updateLast = (req, res) => {
  lastAdded.bedsOwned++;

  const savePromise = lastAdded.save();
  savePromise.then(() =>
  {
    return res.json({name: lastAdded.name, beds: lastAdded.bedsOwned});
  });

  savePromise.catch((err) =>
  {
    console.log(err);
    return res.status(500).json({error: 'Something went wromg!'});
  });
};

const notFound = (req, res) => {
  res.status(404).render('notFound', {
    page: req.url,
  });
};

module.exports = {
  index: hostIndex,
  page1: hostPage1,
  page2: hostPage2,
  page3: hostPage3,
  getName,
  setName,
  updateLast,
  searchName,
  notFound,
};
