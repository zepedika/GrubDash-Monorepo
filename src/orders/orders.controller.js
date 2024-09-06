const path = require("path");

// Use the existing order data
const orders = require(path.resolve("src/data/orders-data"));

// Use this function to assigh ID's when necessary
const nextId = require("../utils/nextId");

// TODO: Implement the /orders handlers needed to make the tests pass


function list(req, res) {
  res.status(200).json({ data: orders });
}

const { v4: uuidv4 } = require('uuid');

  function create(req, res, next) {
    const {data: {deliverTo, mobileNumber, status, dishes, price, quantity} = {}} = req.body;
    
    if (!deliverTo || deliverTo.trim() === "") {
      return next({status: 400, message: "Order must include a deliverTo"})
    } 
    
    if (!mobileNumber || mobileNumber.trim() === "") {
      return next({status: 400, message: "Order must include a mobileNumber"})
    } 
    
    if (!dishes) {
      return next({status: 400, message: "Order must include a dish"})
    } 
    
    if (!Array.isArray(dishes) || dishes.length === 0 ) {
      return next({status: 400, message: "Order must include at least one dish"})
    }  
    
    dishes.forEach((dish, index) => {
      if (!dish.quantity || dish.quantity <= 0 || !Number.isInteger(dish.quantity)) {
       return next({ status: 400, message:`dish ${index} must have a quantity that is an integer greater than 0`})
      
    }})
                   
    const newOrder = {
      id: uuidv4(),
      deliverTo,
      mobileNumber,
      status,
      dishes,
      price,
      quantity
    }
    orders.push(newOrder);
    res.status(201).json({ data: newOrder})
    }
  



function read(req, res, next) {
  const { orderId } = req.params
  const foundOrder = orders.find((order) => order.id === orderId);
  
  if(foundOrder) {
    res.status(200).json({ data: foundOrder})
  } else {
    return next({status: 404, message: `Order id not found: ${orderId}`})
  }
}


function update(req, res, next) {
  const { orderId } = req.params
  const foundOrder = orders.find((order) => order.id === orderId);
  // all of these work the same as above
  // const foundOrder = orders[orders.length - 1];
  // const foundOrder = orders.pop();
  // const foundOrder = orders.shift();
  let {data: {id, deliverTo, mobileNumber, status, dishes} = {}} = req.body;
  if (!foundOrder) {
    return next({ status: 404, message: `Order does not exist: ${orderId}`});
  }

  if (id && id !== orderId) {
    return next({ status: 400, message: `Order id does not match route id. Order: ${orderId}, Route: ${id}` });
  }

  if (!status || status.trim() === "" || !(status === "pending" || status === "preparing" || status === "out-for-delivery" || status === "delivered")) {
    return next({ status: 400, message: "Order must have a status of pending, preparing, out-for-delivery, delivered"});
  }

  if (foundOrder.status === 'delivered') {
    return next({ status: 400, message: "A delivered order cannot be changed"});
  }

  if (!deliverTo || deliverTo.trim() === "") {
    return next({status: 400, message: "Order must include a deliverTo"})
  } 
    
  if (!mobileNumber || mobileNumber.trim() === "") {
    return next({status: 400, message: "Order must include a mobileNumber"})
  } 
    
  if (!dishes) {
    return next({status: 400, message: "Order must include a dish"})
  } 
    
  if (!Array.isArray(dishes) || dishes.length === 0 ) {
      return next({status: 400, message: "Order must include at least one dish"})
  }  
    
  for (let i = 0; i < dishes.length; i++) {
    const dish = dishes[i];
    if (!dish.quantity || !Number.isInteger(dish.quantity) || dish.quantity <= 0) {
      return next({ status: 400, message: `Dish  
 ${i} must have a quantity that is a positive integer` });
    }
  }
  
  foundOrder.deliverTo = deliverTo;
  foundOrder.mobileNumber = mobileNumber;
  foundOrder.status = status; 
  foundOrder.dishes = dishes; 

  res.json({ data: foundOrder });
  
  // make sure it does it for multiple dishes and not just one. 
}


function destroy(req, res, next) {
  const orderId = req.params.orderId;
  const foundOrderIndex = orders.findIndex(order => order.id === orderId);
  const foundOrder = orders[foundOrderIndex];

  if (foundOrderIndex === -1) {
    return next({ status: 404, message: `Order does not exist: ${orderId}`});
  }

  if (foundOrder.status !== "pending") {
    return next({status: 400, message: "An order cannot be deleted unless it is pending"});
  }

  orders.splice(foundOrderIndex, 1);
  res.status(204).send();
}


module.exports = {
  list,
  create,
  read,
  update,
  destroy
}




