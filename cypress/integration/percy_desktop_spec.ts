import {v5Pages} from "../../src/components/_common/_constants";
import {getCareSlugs} from "../../src/constants/getCareConstants";
import {CY_DEVICES} from "../constants";

describe("percy desktop", () => {
  beforeEach(() => {
    cy.window().then(win => {
      win.sessionStorage.clear();
    });
    cy.clearCookies();
    cy.clearLocalStorage();
    cy.mockGeolocation();

    cy.viewport(CY_DEVICES.desktop.size[0], CY_DEVICES.desktop.size[1]);
  });
  it("percy desktop", () => {
    // /es
    cy.visit("/es");
    cy.percy("/es", CY_DEVICES.desktop);

    // home
    cy.visit("/");
    cy.get('h2:contains("Book an appointment")').should("be.visible");
    cy.percy("/", CY_DEVICES.desktop);

    // locations
    cy.dataCy("menu-parent").contains("Locations").click();
    cy.percy("/locations", CY_DEVICES.desktop);

    // /locations/sf-castro
    cy.dataCy("location-name").contains("Market St").click({force: true});
    cy.dataCy("specialties").find("li").its("length").should("be.gte", 2);
    cy.percy("/locations/sf-castro", CY_DEVICES.desktop);

    // urgent-care
    cy.dataCy("menu-parent").contains("Get Care").as("Get Care").trigger("mouseover");
    cy.dataCy("menu-child").contains("Urgent Care").click();
    cy.percy("/urgent-care", CY_DEVICES.desktop);

    // covid-care
    cy.dataCy("menu-parent").contains("Get Care").as("Get Care").trigger("mouseover");
    cy.dataCy("menu-child").contains("COVID Care").click();
    cy.percy(`/get-care/${getCareSlugs.urgentCare}`, CY_DEVICES.desktop);

    // insurance-pricing
    cy.dataCy("menu-parent").contains("Insurance & Pricing").click();
    cy.percy("/insurance-pricing", CY_DEVICES.desktop);

    // /get-care/covid-care
    cy.dataCy("footer-link").contains("COVID Care").click();
    cy.percy(`/get-care/${getCareSlugs.covidCare}`, CY_DEVICES.desktop);

    // /get-care/covid-19-travel-testing
    cy.dataCy("footer-link").contains("COVID Travel Testing").click();
    cy.percy(v5Pages.covid19TravelClearance, CY_DEVICES.desktop);

    // /get-care
    cy.dataCy("footer-link").contains("Get Care").click();
    cy.percy(v5Pages.getCareRoot, CY_DEVICES.desktop);

    // /covid testing modal
    cy.dataCy("carbon-logo").click();
    cy.dataCy("home-widget-link").contains("COVID Testing").click({force: true});
    cy.percy("/home-widget-open1", CY_DEVICES.desktop, true);
    cy.dataCy("home-widget-link-inner").contains("COVID Travel Testing").click();
    cy.percy("/home-widget-open2", CY_DEVICES.desktop, true);

    // /get-care/next-day-rt-pcr
    cy.dataCy("home-widget-link-inner").contains("Next-Day RT-PCR").click();
    cy.percy(`/get-care/${getCareSlugs.nextDayRtPc}`, CY_DEVICES.desktop);

    // /coronavirus/covid-19-testing-centers
    cy.visit("/coronavirus/covid-19-testing-centers");
    cy.percy("/coronavirus/covid-19-testing-centers", CY_DEVICES.desktop);

    // /locations(server)
    cy.visit("/locations");
    cy.dataCy("location-rows").its("length").should("be.gte", 1);
    cy.percy("/locations(server)", CY_DEVICES.desktop);

    // /locations/berkeley(server)
    cy.visit("/locations/berkeley");
    cy.dataCy("specialties").should("be.visible");
    cy.percy("/locations/berkeley(server)", CY_DEVICES.desktop);
  });
});
