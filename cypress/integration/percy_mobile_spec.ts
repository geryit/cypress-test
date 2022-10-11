import {v5Pages} from "../../src/components/_common/_constants";
import {getCareSlugs} from "../../src/constants/getCareConstants";
import {CY_DEVICES, mobileHeaders} from "../constants";

describe("percy mobile", () => {
  beforeEach(() => {
    cy.window().then(win => {
      win.sessionStorage.clear();
    });
    cy.clearCookies();
    cy.clearLocalStorage();
    cy.mockGeolocation();

    cy.viewport(CY_DEVICES.mobile.size[0], CY_DEVICES.mobile.size[1]);
  });
  it("percy mobile", () => {
    // ?lng=es
    cy.visit("/es", mobileHeaders);
    cy.percy("/es", CY_DEVICES.mobile);

    // home
    cy.visit("/", mobileHeaders);
    cy.get('h2:contains("Book an appointment")').should("be.visible");
    cy.percy("/", CY_DEVICES.mobile);
    //
    // menu
    cy.dataCy("menu").click();
    cy.percy("/menu", CY_DEVICES.mobile, true);
    //
    // /locations
    cy.dataCy("drawer-parent-link").contains("Find a Location").click();
    cy.contains("Show List").click();
    cy.dataCy("locations-list").find("a").its("length").should("be.gte", 4);
    cy.percy("/locations", CY_DEVICES.mobile);

    // /locations/sf-castro
    cy.dataCy("location-name").contains("Market St").click();
    cy.dataCy("specialties").find("li").its("length").should("be.gte", 2);
    cy.percy("/locations/sf-castro", CY_DEVICES.mobile);

    // /get-care/covid-19-travel-testing
    cy.get("@menu").click();
    cy.get("@drawer-parent-link").contains("COVID-19").as("COVID-19").click();
    cy.dataCy("drawer-child-link").contains("COVID Travel Testing").click();
    cy.percy(v5Pages.covid19TravelClearance, CY_DEVICES.mobile);

    // /covid-testing
    cy.get("@menu").click();
    cy.get("@COVID-19").click();
    cy.get("@drawer-child-link").contains("COVID Care").click();
    cy.percy(`/get-care/${getCareSlugs.covidCare}`, CY_DEVICES.mobile);

    // /get-care/urgent-care
    cy.get("@menu").click();
    cy.dataCy("drawer-parent-link").contains("Get Care").click();
    cy.get("@drawer-child-link").contains("Urgent Care").click();
    cy.percy("/get-care/urgent-care", CY_DEVICES.mobile);

    // /insurance-pricing
    cy.get("@menu").click();
    cy.dataCy("footer-link").contains("Insurance & Pricing").click();
    cy.percy("/insurance-pricing", CY_DEVICES.mobile);

    // /coronavirus
    cy.dataCy("carbon-logo").click();
    cy.wait(5000);
    cy.dataCy("btn").contains("See all COVID-19 Initiatives").click({force: true});
    cy.percy("/coronavirus", CY_DEVICES.mobile);

    // /covid testing modal
    cy.dataCy("carbon-logo").click();
    cy.dataCy("home-widget-link").contains("COVID Testing").click({force: true});
    cy.percy("/home-widget-open1", CY_DEVICES.mobile, true);
    cy.dataCy("home-widget-link-inner").contains("COVID Travel Testing").click();
    cy.percy("/home-widget-open2", CY_DEVICES.mobile, true);

    // /get-care/next-day-rt-pcr
    cy.dataCy("home-widget-link-inner").contains("Next-Day RT-PCR").click();
    cy.percy(`/get-care/${getCareSlugs.nextDayRtPc}`, CY_DEVICES.mobile);

    // /coronavirus/covid-19-testing-centers
    cy.visit("/coronavirus/covid-19-testing-centers", mobileHeaders);
    cy.dataCy("google-maps").invoke("addClass", "dn");
    cy.percy("/coronavirus/covid-19-testing-centers", CY_DEVICES.mobile);
  });
});
