const HostawayIntegration = require("./integrations/hostaway/hostawayIntegration");

class PMSIntegrationFactory {
  static createIntegration(type) {
    switch (type) {
      case "hostaway":
        return new HostawayIntegration();

      // more integrations

      // more integrations

      // more integrations

      default:
        throw new Error(`No integration found for type: ${type}`);
    }
  }
}

module.exports = PMSIntegrationFactory;
