describe("Redirections for locations", () => {
  it("returns a 200 with a correct url", () => {
    cy.request({
      url: "/locations/boston-ma-downtown-boston",
      followRedirect: false,
    }).then(resp => {
      expect(resp.status).to.eq(200);
      expect(resp.redirectedToUrl).to.be.undefined;
    });
  });

  it("redirects to lowercase version", () => {
    cy.request({
      url: "/locations/boston-ma-downtown-bostoN",
      followRedirect: false,
    }).then(resp => {
      expect(resp.status).to.eq(308);
      expect(resp.redirectedToUrl).to.eq(`${Cypress.config().baseUrl}/locations/boston-ma-downtown-boston`);
    });
  });
});
