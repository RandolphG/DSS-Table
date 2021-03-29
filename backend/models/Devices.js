const mongoose = require("mongoose");
const deviceSchema = new mongoose.Schema({
  device: {
    customer: String,
    description: String,
    macAddress: String,
  },
});

const dssTypeSchema = new mongoose.Schema({
  dssType: {
    device: String,
    dss_type: String,
    key: String,
    label: String,
    value: String,
  },
});

module.exports = mongoose.model("Device", deviceSchema);
module.exports = mongoose.model("DssDevice", dssTypeSchema);
