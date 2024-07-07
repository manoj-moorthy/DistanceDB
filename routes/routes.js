const express = require("express");
const router = express.Router();
const {
  getlongDistanceBooking,
  createlongDistanceBooking,
  updatelongDistanceBooking,
  deletelongDistanceBooking,
  getlongDistanceBooking,
} = require("../controllers/longDistanceBookingController");
const validateToken=require("../middleware/validateTokenHandler");

router.use(validateToken);
router.route("/").get(getlongDistanceBooking).post(createlongDistanceBooking);
router.route("/:id").get(getlongDistanceBooking).put(updatelongDistanceBooking).delete(deletelongDistanceBooking);

module.exports = router;
