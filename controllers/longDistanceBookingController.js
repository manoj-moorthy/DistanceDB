const asyncHandler = require("express-async-handler");
const longDistanceOrder = require("../models/longDistanceModel");
const oneSignal = require('@onesignal/node-onesignal');
const longDistanceModel = require("../models/longDistanceModel");
const longDistanceModel = require("../models/longDistanceModel");


//notification 
const adminAppConfig = oneSignal.createConfiguration({
  appKey: '277ba336-f81d-4a1e-b7cb-4913fceb9ebf',
  restApiKey: 'MWMzODc2YzctOTg3Yy00MjcyLTk0YjYtYzAwZmU2MTYxN2M1',
});

const oneSignalAdminClient = new oneSignal.DefaultApi(adminAppConfig);

async function createAdminAppNotification(name, headings, content, metaData) {
  //the notification

  const notification = new oneSignal.Notification();
  notification.app_id = '277ba336-f81d-4a1e-b7cb-4913fceb9ebf';


  notification.name = name;
  notification.contents = {
      en: content
  }
  notification.headings = {
      en: headings
  }

  notification.data = metaData;
  
  notification.included_segments = ["All"];
  await oneSignalAdminClient.createNotification(notification);
}


const getlongDistanceOrder = asyncHandler(async (req, res) => {
  const longDistanceOrder = await longDistanceModel.find({user_id:req.user.id});
  res.status(200).json(longDistanceOrder
    
  );
});

const createlongDistanceOrderOrder = asyncHandler(async (req, res) => {
  console.log("The request body is :", req.body);
  const name = req.body.name;
  const phone = req.body.phone;
  const recieveAddress = req.body.recieveAddress;
  const itemsToShip = req.body.itemsToShip;
  const totalItems = req.body.totalItems;

  if (!name || !phone || !recieveAddress || !itemsToShip || !totalItems) {
    console.log('Error');
    res.status(400);
  }

  try {
 
    const regex = new RegExp(`^${recieveAddress.startingDistrict.slice(0, 3)}.${recieveAddress.destinationDistrict.slice(0, 3)}$`);
    const results = await longDistanceOrder.find({ orderId: { $regex: regex } });

    var count = 0;

    results.forEach((element) => {
      count++;
    });

    
    const countString = count.toString().padStart(4, "0");
    
    var order = {
      'user_id': req.user.id,
      'orderId': `${recieveAddress.startingDistrict.slice(0, 3)}${countString}${recieveAddress.destinationDistrict.slice(0, 3)}`,
      'name': name,
      'phone': phone,
      'recieveAddress': recieveAddress,
      'itemsToShip': itemsToShip,
      'totalItems': totalItems,
      'viewed': false,
    };

    const  longDistanceBooking = await  longDistanceBooking.create(order);

    console.log(longDistanceBooking);

    createAdminAppNotification('Manage order', `Order ID : ${recieveAddress.startingDistrict.slice(0, 3)}${countString}${recieveAddress.destinationDistrict.slice(0, 3)}`, 'New packing and moving order', {notificationType: 'newOrder', orderData: order});
    
    res.status(200).json(longDistanceBooking);
    res.end();
  } catch (error) {
    console.log(error);
  }
});


const getlongDistanceBooking = asyncHandler(async (req, res) => {
  const order = longDistanceModel.find({orderId: {regex: new RegExp(`^${req.params.id}`)}});
  if (!order)
    res.status(204).json({message: 'no data'});

  else 
    res.status(200).json({results: order});
});


const updatePackingAndMovingOrder = asyncHandler(async (req, res) => {
  res.status(200).json({message:`update PackingAndMovingOrder for ${req.params.id}`});
});


const deletePackingAndMovingOrder = asyncHandler(async (req, res) => {
  res.status(200).json({message:`delete PackingAndMovingOrder for ${req.params.id}`});
});

module.exports = {
  getlongDistanceBooking,
  createlongDistanceBooking,
  updatelongDistanceBooking,
  deletelongDistanceBooking,
  getlongDistanceBooking,
};