import {CY_DEVICES, mobileHeaders} from "../constants";

describe("discovery search mobile", () => {
  beforeEach(() => {
    cy.window().then(win => {
      win.sessionStorage.clear();
    });
    cy.clearCookies();
    cy.clearLocalStorage();

    cy.viewport(CY_DEVICES.mobile.size[0], CY_DEVICES.mobile.size[1]);
  });

  it("search", () => {
    // home search
    cy.visit("/", mobileHeaders);

    cy.dataCy("care-discovery-search-modal-trigger").last().click();
    cy.percy("/modal:open", CY_DEVICES.mobile);
    cy.dataCy("discovery-search-input").type("cold");
    cy.percy("/modal:searched", CY_DEVICES.mobile);
    cy.dataCy("discovery-search-input").tab().click();
    cy.url().should("contain", "/get-care/");

    // clinic search
    cy.visit("/locations/berkeley", mobileHeaders);

    cy.dataCy("care-discovery-search-modal-trigger").last().click();
    cy.dataCy("discovery-search-input").type("cold");
    cy.percy("/locations/berkeley(search:searched)", CY_DEVICES.mobile);
  });
});
