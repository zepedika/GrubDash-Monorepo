const path = require("path");

// Use the existing dishes data
const dishes = require(path.resolve("src/data/dishes-data"));

// Use this function to assign ID's when necessary
const nextId = require("../utils/nextId");

// TODO: Implement the /dishes handlers needed to make the tests pass

// add handlers and middleware functions to create, read, update and list dishes. Dishes cannot be deleted

function list(req, res) {
  res.status(200).json({ data: dishes });
}

const { v4: uuidv4 } = require('uuid');

function create(req, res, next) {
  const { data: { name, description, price, image_url } = {} } = req.body;

  if (!name || name.trim() === "") {
    return next({ status: 400, message: "Dish must include a name" });
  }
  if (!description || description.trim() === "") {
    return next({ status: 400, message: "Dish must include a description" });
  }
  if (price === undefined) {
    return next({ status: 400, message: "Dish must include a price" });
  }
  if (price <= 0 || !Number.isInteger(price)) {
    return next({ status: 400, message: "Dish must have a price that is an integer greater than 0" });
  }
  if (!image_url || image_url.trim() === "") {
    return next({ status: 400, message: "Dish must include an image_url" });
  }

  const newDish = {
    id: uuidv4(),
    name,
    description,
    price,
    image_url,
  };

  dishes.push(newDish);
  res.status(201).json({ data: newDish });
}


function read(req, res, next) {
  const { dishId } = req.params
  const foundDish = dishes.find((dish) => dish.id === dishId);
  
  if(foundDish) {
    res.status(200).json({ data: foundDish});
  } else {
    return next({ status: 404, message: `Dish id not found: ${dishId}`})
  }
}

function update(req, res, next) {
  const { dishId } = req.params;
  const foundDish = dishes.find((dish) => dish.id === dishId);
  const { data: { id, name, description, price, image_url } = {} } = req.body;

  if (!foundDish) {
    return next({ status: 404, message: `Dish does not exist: ${dishId}` });
  }
  
  if (id && id !== dishId) {
    return next({ status: 400, message: `Dish id does not match route id. Dish: ${id}, Route: ${dishId}` });
  }
  
  if (!name || name.trim() === "") {
    return next({ status: 400, message: "Dish must include a name" });
  }
  
  if (!description || description.trim() === "") {
    return next({ status: 400, message: "Dish must include a description" });
  }
  
  if (price === undefined) {
    return next({ status: 400, message: "Dish must include a price" });
  }
  
  if (price <= 0 || !Number.isInteger(price)) {
    return next({ status: 400, message: "Dish must have a price that is an integer greater than 0" });
  }
  
  if (!image_url || image_url.trim() === "") {
    return next({ status: 400, message: "Dish must include an image_url" });
  }
  foundDish.name = name;
  foundDish.description = description;
  foundDish.price = price;
  foundDish.image_url = image_url;

  res.json({ data: foundDish });
}

module.exports = {
  list,
  create,
  read, 
  update,
}