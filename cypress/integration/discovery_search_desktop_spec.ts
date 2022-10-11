import {CY_DEVICES} from "../constants";

describe("discovery search desktop", () => {
  beforeEach(() => {
    cy.window().then(win => {
      win.sessionStorage.clear();
    });
    cy.clearCookies();
    cy.clearLocalStorage();
    cy.viewport(CY_DEVICES.desktop.size[0], CY_DEVICES.desktop.size[1]);
  });

  it("search", () => {
    // home search
    cy.visit("/");
    cy.dataCy("care-discovery-search-modal-trigger").first().click();
    cy.percy("/modal:open", CY_DEVICES.desktop);
    cy.dataCy("discovery-search-input").type("cold");
    cy.percy("/modal:searched", CY_DEVICES.desktop);
    cy.dataCy("discovery-search-input").tab().click();
    cy.url().should("contain", "/get-care/");

    // clinic search
    cy.visit("/locations/berkeley");
    cy.dataCy("care-discovery-search-modal-trigger").first().click();
    cy.dataCy("discovery-search-input").type("cold");
    cy.percy("/locations/berkeley(search:searched)", CY_DEVICES.desktop);
  });
});
