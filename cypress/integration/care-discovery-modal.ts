import {FeatureFlag} from "../../src/_services/featureFlagConstants";
import {CY_DEVICES, mobileHeaders} from "../constants";

describe("care discovery search modal", () => {
  beforeEach(() => {
    cy.window().then(win => {
      win.sessionStorage.clear();
    });
    cy.clearCookies();
    cy.clearLocalStorage();

    cy.viewport(CY_DEVICES.mobile.size[0], CY_DEVICES.mobile.size[1]);
  });

  it("[feature-on] should expand and close topics and nested topics", () => {
    cy.visit("/", {
      qs: {
        [FeatureFlag.GROWTH_DISCOVERY_REMOVING_SPECIALTY_TRIAGE_HOMEPAGE_1]: true,
        [FeatureFlag.GROWTH_DISCOVERY_SEARCH_AVAILABILITY_ENABLED]: true,
        [FeatureFlag.CARE_DISCOVERY_TOPICS_SEARCH_ENABLED]: true,
      },
      ...mobileHeaders,
    });

    // If the `href` property exists, it should link to that page. Only certain cares should expand on homepage.
    cy.dataCy("default-results-urgent-care")
      .last()
      .invoke("attr", "href")
      .should("eq", "/get-care/urgent-care");
    cy.wait(20);
    cy.dataCy("default-results-covid-care").last().click();
    cy.dataCy("topic-expansion-covid-care").last().should("be.visible");
    cy.dataCy("care-discovery-modal-description").should("not.exist");

    cy.dataCy("topic-expansion-results-covid-care-covid-19-testing").click();
    cy.dataCy("topic-expansion-covid-care").should("not.exist");
    cy.dataCy("care-discovery-dialog-title").should("contain", "Which COVID test do you need?");

    cy.dataCy("topic-expansion-results-covid-19-testing-covid-19-travel-testing").click();
    cy.dataCy("topic-expansion-covid-19-testing").should("not.exist");
    cy.dataCy("care-discovery-dialog-title").should("contain", "Which travel test do you need?");
    cy.dataCy("care-discovery-modal-description").should("be.visible");

    cy.dataCy("close-topic-expansion").click();
    cy.dataCy("close-topic-expansion").click();
    cy.dataCy("close-topic-expansion").click();
    cy.dataCy("discovery-search-input").should("be.visible");
    cy.dataCy("close-search-dialog").click();
    cy.dataCy("care-discovery-dialog-title").should("not.exist");
  });

  it("[feature-off] topics should not expand on the homepage when the flag is false", () => {
    cy.visit("/", {
      qs: {
        [FeatureFlag.GROWTH_DISCOVERY_REMOVING_SPECIALTY_TRIAGE_HOMEPAGE_1]: false,
        [FeatureFlag.GROWTH_DISCOVERY_SEARCH_AVAILABILITY_ENABLED]: false,
        [FeatureFlag.CARE_DISCOVERY_TOPICS_SEARCH_ENABLED]: true,
      },
      ...mobileHeaders,
    });

    cy.dataCy("care-discovery-search-modal-trigger").last().click();
    cy.dataCy("default-results-covid-care").should("not.exist");
    cy.dataCy("discovery-search-input").type("covid care");
    cy.dataCy("search-results-covid-care")
      .invoke("attr", "href")
      .should("eq", "/get-care/covid-care");
  });

  it("[feature-off] topics should only expand once on clinic pages when the flag is false", () => {
    cy.visit("/locations/berkeley", {
      qs: {
        [FeatureFlag.GROWTH_DISCOVERY_REMOVING_SPECIALTY_TRIAGE_HOMEPAGE_1]: false,
        [FeatureFlag.GROWTH_DISCOVERY_REMOVING_SPECIALTY_TRIAGE_CLINIC_DETAILS_1]: false,
        [FeatureFlag.GROWTH_DISCOVERY_SEARCH_AVAILABILITY_ENABLED]: false,
        [FeatureFlag.CARE_DISCOVERY_TOPICS_SEARCH_ENABLED]: true,
      },
      ...mobileHeaders,
    });

    cy.dataCy("care-discovery-search-modal-trigger").last().click();
    cy.dataCy("default-results-covid-care").should("not.exist");
    cy.dataCy("discovery-search-input").type("covid care");
    cy.dataCy("search-results-covid-care").click();
    cy.dataCy("topic-expansion-results-covid-care-covid-19-travel-testing")
      .invoke("attr", "href")
      .should("eq", "/get-care/covid-19-travel-testing");
  });

  it("[feature-on] should expand all topics on /locations/[slug] and cares should link to patient app", () => {
    cy.visit("/locations/berkeley", {
      qs: {
        [FeatureFlag.GROWTH_DISCOVERY_REMOVING_SPECIALTY_TRIAGE_CLINIC_DETAILS_1]: true,
        [FeatureFlag.GROWTH_DISCOVERY_SEARCH_AVAILABILITY_ENABLED]: true,
        [FeatureFlag.CARE_DISCOVERY_TOPICS_SEARCH_ENABLED]: true,
      },
      ...mobileHeaders,
    });

    cy.dataCy("default-results-urgent-care").click();
    cy.dataCy("topic-expansion-urgent-care").should("be.visible");
    cy.wait(100);
    cy.dataCy("topic-expansion-results-urgent-care-rash")
      .invoke("attr", "href")
      .should("match", /(patient\.carbonhealth\.com|carbonhealth\.com\/patients)/g);
  });

  it("[feature-on] should allow users to search while a topic is expanded if the topic has more than 8 related cares", () => {
    cy.visit("/locations/berkeley", {
      qs: {
        [FeatureFlag.GROWTH_DISCOVERY_REMOVING_SPECIALTY_TRIAGE_CLINIC_DETAILS_1]: true,
        [FeatureFlag.GROWTH_DISCOVERY_SEARCH_AVAILABILITY_ENABLED]: false,
        [FeatureFlag.CARE_DISCOVERY_TOPICS_SEARCH_ENABLED]: true,
      },
      ...mobileHeaders,
    });
    cy.dataCy("care-discovery-search-modal-trigger").last().click();
    cy.dataCy("discovery-search-input").type("womens health");
    cy.dataCy("search-results-womens-health").click();
    cy.dataCy("topic-expansion-womens-health-discovery-search-input").type("gynecology");
    cy.dataCy("topic-expansion-results-womens-health-gynecological-consultation").should(
      "be.visible",
    );
    cy.dataCy("close-topic-expansion").click();
    cy.dataCy("discovery-search-input").invoke("attr", "value").should("eq", "");
  });
});
