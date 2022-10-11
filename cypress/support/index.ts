// ***********************************************************
// This example support/index.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

import "cypress-mouse-position/commands";
import "@percy/cypress";

// Import commands.js using ES2015 syntax:
import "./commands";

import {sfCenterPos} from "../../workers/common/constants";
import {CY_TIMEOUT} from "../constants";
import {queryParamOverrides} from "../query-param-overrides";

import VisitOptions = Cypress.VisitOptions;

const scrollToBottom = require("scroll-to-bottomjs");

// Alternatively you can use CommonJS syntax:
// require('./commands')

// in cypress/support/index.ts
// load type definitions that come with Cypress module
/// <reference types="cypress" />
require("cypress-plugin-tab");

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Custom command to select DOM element by data-cy attribute.
       * @example cy.dataCy('greeting')
       */
      dataCy(
        value: string,
        opts?: Partial<Loggable & Timeoutable & Withinable & Shadow>,
      ): Chainable<Element>;
      percy(
        value: string,
        device: {type: string; size: number[]; useAgent?: string},
        dontScroll?: boolean,
      ): Chainable<Element>;
      mockGeolocation(): Chainable<Element>;
    }
  }
}

Cypress.Commands.add("dataCy", (value, opts) => cy.get(`[data-cy=${value}]`, opts).as(value));

Cypress.Commands.add("percy", (name, device, dontScroll = false) => {
  if (!dontScroll) {
    // ref: https://github.com/Robdel12/scroll-to-bottom/blob/master/examples/cypress/cypress/integration/test.spec.js
    cy.window({timeout: 10000}).then(cyWindow => scrollToBottom({remoteWindow: cyWindow}));
  }
  cy.wait(CY_TIMEOUT);
  return cy.percySnapshot(`${device.type}:${name}`, {widths: [device.size[0]]});
});

Cypress.Commands.add("mockGeolocation", () => {
  cy.window().then($window => {
    $window.localStorage.setItem("latLong", JSON.stringify(sfCenterPos)); // set region to SF
  });
});

Cypress.Commands.overwrite(
  "visit",
  (originalFn, url, {qs = {}, ...options}: Partial<VisitOptions> = {}, latitude, longitude) =>
    originalFn(url, {
      ...fakeLocation(latitude, longitude),
      ...{
        qs: {
          ...queryParamOverrides,
          ...qs,
        },
        ...options,
      },
    }),
);

// Hide fetch/XHR requests
const app = window.top;
if (!app.document.head.querySelector("[data-hide-command-log-request]")) {
  const style = app.document.createElement("style");
  style.innerHTML = ".command-name-request, .command-name-xhr { display: none }";
  style.setAttribute("data-hide-command-log-request", "");

  app.document.head.appendChild(style);
}

export const fakeLocation = (
  latitude = sfCenterPos.x,
  longitude = sfCenterPos.y,
): {onBeforeLoad(win: Window): void} => ({
  onBeforeLoad(win) {
    cy.stub(win.navigator.geolocation, "getCurrentPosition", (cb, err) => {
      if (latitude && longitude) {
        return cb({coords: {latitude, longitude}});
      }
      throw err({code: 1}); // 1: rejected, 2: unable, 3: timeout
    });
  },
});
