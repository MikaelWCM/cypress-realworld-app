describe("Sign Up Page Tests", () => {
  beforeEach(() => {
    cy.visit("/signup");
  });

  it('validate sign up page title', () => {
    cy.get('h1').should('have.text', 'Sign Up');
  });

    it('validate successful sign up with valid credentials', () => {
        cy.intercept('POST', '/users').as('signupRequest');
        cy.get("[name='firstName']").type("John");
        cy.get("[name='lastName']").type("Doe");
        cy.get("[name='username']").type("Johndoe123");
        cy.get("[name='password']").type("Password123!");
        cy.get("[name='confirmPassword']").type("Password123!");
        cy.getBySel("signup-submit").click();
        cy.wait('@signupRequest').then((interception) => {
            expect(interception.response.statusCode).to.eq(201);
            const {user} = interception.response.body;
            expect(user).to.have.property('id');
            expect(user).to.have.property('firstName', 'John');
            expect(user).to.have.property('lastName', 'Doe');
            expect(user).to.have.property('username', 'Johndoe123');
        });
        cy.url().should('include', '/signin');
    });

    it('validate page elements are displayed', () => {
        cy.get("[name='firstName']").should("be.visible");
        cy.get("[name='lastName']").should("be.visible");
        cy.get("[name='username']").should("be.visible");
        cy.get("[name='password']").should("be.visible");
        cy.get("[name='confirmPassword']").should("be.visible");
        cy.getBySel("signup-submit").should("be.visible");
        cy.get('a[href="/signin"]').should("be.visible");
    });

    it('validate sign up button is disabled until all fields are filled', () => {
        cy.getBySel("signup-submit").click();
        cy.getBySel("signup-submit").should("be.disabled");
        cy.get("[name='firstName']").type("John");
        cy.get("[name='lastName']").type("Doe");
        cy.get("[name='username']").type("Johndoe123");
        cy.get("[name='password']").type("Password123!");
        cy.get("[name='confirmPassword']").type("Password123!");
        cy.getBySel("signup-submit").should("be.enabled");
    });

    it('validate error message for invalid password', () => {
        cy.get("[name='password']").type("a!");
        cy.get("[id='password-helper-text']").should("be.visible");
        cy.get("[id='password-helper-text']").should("contain.text", "Password must contain at least 4 characters");
    });

    it('validate error message for mismatched confirm password', () => {
        cy.get("[name='password']").type("Password123!");
        cy.get("[name='confirmPassword']").type("Password123");
        cy.get("[id='confirmPassword-helper-text']").should("be.visible");
        cy.get("[id='confirmPassword-helper-text']").should("contain.text", "Password does not match");
    });

    it('validate sign in link redirects to sign in page', () => {
        cy.get('a[href="/signin"]').click();
        cy.url().should('include', '/signin');
    });

    it('validate first name is required', () => {
        cy.getBySel("signup-submit").click();
        cy.get("[id='firstName-helper-text']").should("contain.text", "First Name is required");
    });

    it('validate last name is required', () => {
        cy.get('[id="lastName"]').type('Doe');
        cy.get('[id="lastName"]').clear();
        cy.get('[id="firstName"]').click();
        cy.get("[id='lastName-helper-text']").should("contain.text", "Last Name is required");
    });

    it('validate username is required', () => {
        cy.get('[id="username"]').type('username');
        cy.get('[id="username"]').clear();
        cy.get('[id="firstName"]').click();
        cy.get("[id='username-helper-text']").should("contain.text", "Username is required");
    });

    it('validate password is required', () => {
        cy.get('[id="password"]').type('Password123!');
        cy.get('[id="password"]').clear();
        cy.get('[id="firstName"]').click();
        cy.get("[id='password-helper-text']").should("contain.text", "Enter your password");
    });

    it('validate confirm password is required', () => {
        cy.get('[id="confirmPassword"]').type('Password123!');
        cy.get('[id="confirmPassword"]').clear();
        cy.get('[id="firstName"]').click();
        cy.get("[id='confirmPassword-helper-text']").should("contain.text", "Confirm your password");
    });

    it('validate password and confirm password mask input type is password', () => {
        cy.get("[name='password']").should("have.attr", "type", "password");
        cy.get("[name='confirmPassword']").should("have.attr", "type", "password");
    });

})