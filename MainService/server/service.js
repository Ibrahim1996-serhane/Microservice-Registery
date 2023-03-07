const express = require("express");
const MainServiceRegistry = require("./lib/MainServiceRegistry");
const service = express();

module.exports = (config) => {
  const log = config.log();
  const mainServiceRegistry = new MainServiceRegistry(log);

  // Add a request logging middleware in development mode.
  if (service.get("env") === "development") {
    service.use((req, res, next) => {
      log.debug(`${req.method}: ${req.url}`);
      return next();
    });
  }
  service.put('/register/:servicename/:serviceversion/:serviceport', (req, res) => {
    const { servicename, serviceversion, serviceport } = req.params;
    const serviceip = req.connection.remoteAddress.includes('::') 
    ? `[${req.connection.remoteAddress}]` 
    : req.connection.remoteAddress;

    const serviceKey = mainServiceRegistry.register(
        servicename,
        serviceversion, 
        serviceip, 
        serviceport
        );
    return res.json({ result: serviceKey });
  });

  service.delete('/register/:servicename/:serviceversion/:serviceport', (req, res) => {

  });

  service.get('/find/:servicename/:serviceversion', (req, res) => {

  });
  return service;
};
