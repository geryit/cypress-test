describe("get-care page", () => {
  it("redirects from old slug to new slug", () => {
    cy.request({
      url: "/get-care/urinary-tract-infection-uti-symptoms",
      followRedirect: false,
    }).then(resp => {
      expect(resp.status).to.eq(301);
      expect(resp.redirectedToUrl).to.eq(
        `${Cypress.config().baseUrl}/get-care/urinary-tract-infection`,
      );
    });
  });

  it("redirects from the old slug to the new slug with the old route", () => {
    cy.request({
      url: "/r/urinary-tract-infection-uti-symptoms",
      followRedirect: false,
    }).then(resp => {
      expect(resp.status).to.eq(301);
      expect(resp.redirectedToUrl).to.eq(
        `${Cypress.config().baseUrl}/get-care/urinary-tract-infection`,
      );
    });
  });

  it("does not redirect a get-care url with a new slug", () => {
    cy.request({
      url: "/get-care/urinary-tract-infection",
      followRedirect: false,
    }).then(resp => {
      expect(resp.status).to.eq(200);
      expect(resp.redirectedToUrl).to.be.undefined;
    });
  });

  it("tests the covid-19 vax slug", () => {
    cy.request({
      url: "/get-care/covid-19-vaccination-first-dose",
      followRedirect: false,
    }).then(resp => {
      expect(resp.status).to.eq(200);
    });
  });

  it("redirects non-discoverable reasons", () => {
    cy.request({
      url: "/appointment-reasons/tdap-tetanus-diphtheria-whooping-cough-vaccine",
      followRedirect: true,
    }).then(resp => expect(resp.redirects.length).to.eq(1));

    cy.request({
      url: "/appointment-reasons/tdap-tetanus-diphtheria-whooping-cough-vaccine",
      followRedirect: false,
    }).then(resp => {
      expect(resp.status).to.eq(302);
      expect(resp.redirectedToUrl).to.eq(`${Cypress.config().baseUrl}/get-care`);
    });
  });
});
