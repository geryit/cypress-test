import {CY_DEVICES, mobileHeaders} from "../../constants";

describe("flows", () => {
  beforeEach(() => {
    cy.window().then(win => {
      win.sessionStorage.clear();
    });
    cy.clearCookies();
    cy.clearLocalStorage();
    cy.viewport(CY_DEVICES.mobile.size[0], CY_DEVICES.mobile.size[1]);
  });

  it("virtual care / list search results for keyword: cold", () => {
    cy.visit("/", mobileHeaders);
    cy.dataCy("home-widget-link").last().contains("Virtual Urgent Care").click();

    cy.url().should("contain", "/schedule");

    // without `should`, we find a single item
    // ref here: https://filiphric.com/waiting-in-cypress-and-how-to-avoid-it
    cy.get("[data-testid=apptReasonItem]").should(items => {
      // but no worries, we will retry until these pass or until timeout
      expect(items).to.have.length.of.at.least(4);
    });

    cy.get('input[placeholder="Search for your symptoms"]').as("searchBox").type("cold");

    cy.get(`[data-testid=apptReasonItem]`).its("length").should("be.gte", 4);
    cy.get("@searchBox").tab().click();

    cy.get("[data-testid=slot0-0-0]").should("be.visible");
    cy.get("[data-testid=STATE_PICKER_TEST_ID]").click();

    cy.get("select").select("CA");
    cy.get("div").contains(/^Set$/).click();

    cy.get(`[data-testid=slot0-0-0]`).should("be.visible");
  });
});
