import {EventPayload} from "../../../src/utils/analytics/types";
import {getVisitId, getVisitorId} from "../../../src/utils/browser-storage/visitData";
import {CY_DEVICES} from "../../constants";

describe("visit tracking and feature flags / analytics / localStorage", () => {
  beforeEach(() => {
    cy.window().then(win => {
      win.sessionStorage.clear();
    });
    cy.clearCookies();
    cy.clearLocalStorage();
    cy.viewport(CY_DEVICES.mobile.size[0], CY_DEVICES.mobile.size[1]);
  });

  it("should have visit data loaded when posting events and evaluating feature flags", () => {
    // Visit data should by set when analytics fires with new API
    cy.intercept(/app-analytics/, req => {
      const body = req.body as EventPayload;
      expect(body.user.visitId).to.equal(getVisitId());
      expect(body.user.visitorId).to.equal(getVisitorId());
    });

    // Visit data should be set when analytics fires with old API
    cy.intercept(/event-tracking/, req => {
      expect(req.headers.carbonvisitid).to.equal(getVisitId());
      expect(req.headers.carbonvisitorid).to.equal(getVisitorId());
    });

    // Visit data should be added to feature flag calls
    cy.intercept(/feature-flags/, req => {
      expect(req.headers.carbonvisitid).to.equal(getVisitId());
      expect(req.headers.carbonvisitorid).to.equal(getVisitorId());
    });

    // navigate a little bit
    cy.visit("/");
    cy.contains("Menu").click();
    /*
      Running the cypress `as` (always runs with `dataCy`) method after 
      `get` can allow a bug where the DOM node can detach before you click
      if it re-renders.
      Instead, click element immediately...
    */
    cy.get(`[data-cy=drawer`).contains("Get Care").click();
    cy.get(`[data-cy=drawer`).contains("Urgent Care").click();
  });
});
