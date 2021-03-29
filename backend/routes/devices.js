/* router maps endpoints to code in the backend "BUSINESS LOGIC" */
const router = require("express").Router();
const devicesCtrl = require("../controllers/devices");
const dssDevicesCtrl = require("../controllers/devices");

router.post("/devices", devicesCtrl.create);
router.get("/devices", devicesCtrl.index);
router.put("/devices/:id", devicesCtrl.update);
router.delete("/devices/:id", devicesCtrl.remove);

router.post("/dssDevices", dssDevicesCtrl.create);
router.get("/dssDevices", dssDevicesCtrl.index);
router.put("/dssDevices/:id", dssDevicesCtrl.update);
router.delete("/dssDevices/:id", dssDevicesCtrl.remove);

module.exports = router;
