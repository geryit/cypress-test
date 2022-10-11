import {v5Pages} from "../../../src/components/_common/_constants";
import {CY_DEVICES} from "../../constants";

describe("flows", () => {
  beforeEach(() => {
    cy.window().then(win => {
      win.sessionStorage.clear();
    });
    cy.clearCookies();
    cy.clearLocalStorage();
    cy.viewport(CY_DEVICES.desktop.size[0], CY_DEVICES.desktop.size[1]);
  });

  it("homepage/urgent care", () => {
    cy.visit("/");
    cy.dataCy("home-widget-link").contains("Urgent Care").click();
    cy.dataCy("location-name").contains("Market St").click();
    cy.dataCy("specialty").contains("Urgent Care").click();
    cy.get(`[data-testid=apptReasonItem]`, {timeout: 20000}).should("be.visible");
  });

  it("covid-testing/same day naat", () => {
    cy.visit(v5Pages.covidTesting, {
      qs: {
        GROWTH_DISCOVERY_APPT_REASON_PAGE_AVAILABILITY_ENABLED: true,
      },
    });
    cy.dataCy("home-widget-link-inner").contains("Same-Day NAAT").click();
    cy.dataCy("get-care-location-link").first().click();
    cy.get(`[data-testid=slotSelectionListTestId]`, {timeout: 20000}).should("be.visible");
  });

  it("covid travel clearance", () => {
    cy.visit(v5Pages.covid19TravelClearance);
    cy.get("h1").contains("COVID Travel Testing").should("be.visible");
  });

  it("tests /coronavirus page", () => {
    cy.visit(v5Pages.coronavirus);
    cy.dataCy("get-tested").click();
    cy.url().should("contain", "/get-care/covid-19-testing");
  });
});
