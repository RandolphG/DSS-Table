const DssDevice = require("../models/Devices");

/**
 *
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
async function index(req, res) {
  try {
    const devices = await DssDevice.find();
    res.json({ devices });
  } catch (e) {
    console.error(e);
    res.status(400).json({ name: e.name, message: e.message });
  }
}

/**
 *
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
async function update(req, res) {
  try {
  } catch (e) {
    console.error(e);
    res.status(400).json({ name: e.name, message: e.message });
  }
}

/**
 *
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
async function create(req, res) {
  try {
    const devices = await DssDevice.create(req.body);
    res.json({ devices });
  } catch (e) {
    console.error(e);
    res.status(400).json({ name: e.name, message: e.message });
  }
}

/**
 *
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
async function remove(req, res) {
  try {
  } catch (e) {
    console.error(e);
    res.status(400).json({ name: e.name, message: e.message });
  }
}

module.exports = { index, update, create, remove };
