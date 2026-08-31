describe('User setting Page tests', () => {
    beforeEach(() => {
        cy.task("db:seed")
        cy.database("find", "users").then((user) => {
            cy.login(user.username, Cypress.env("defaultPassword"), { rememberUser: true });
        });
        cy.get('a[href="/user/settings"]').click();
    });

    it('validate User Setting page title', () =>{
        cy.get('[class="MuiTypography-root MuiTypography-h6 MuiTypography-gutterBottom css-mpyo7s-MuiTypography-root"').should('contain', 'User Settings')
    })

    it('validate page elements are displayed', () => {
        cy.get('input[id="user-settings-firstName-input"]').should('be.visible');
        cy.get('input[id="user-settings-lastName-input"]').should('be.visible');
        cy.get('input[id="user-settings-email-input"]').should ('be.visible');
        cy.get('input[id="user-settings-phoneNumber-input"]').should('be.visible');
        cy.getBySel('user-settings-submit').should('be.visible');
        
    })

    it('validate current User Setting values', () => {
        cy.database("find", "users").then((user) => {
            cy.get('input[id="user-settings-firstName-input"]').should('have.value', user.firstName);
            cy.get('input[id="user-settings-lastName-input"]').should('have.value', user.lastName);
            cy.get('input[id="user-settings-email-input"]').should ('have.value', user.email);
            cy.get('input[id="user-settings-phoneNumber-input"]').should('have.value', user.phoneNumber)
        });       
    })

    it('validate User Setting update firstName', () => {
        const randomFirstName = `First Name ${(Date.now())}`
        cy.get('input[id="user-settings-firstName-input"]').clear();
        cy.get('input[id="user-settings-firstName-input"]').type(randomFirstName)
        cy.getBySel('user-settings-submit').click();
        cy.reload()
        cy.get('input[id="user-settings-firstName-input"]').should('have.value', randomFirstName)
    })

    it('validate User Setting update lastName', () => {
        const randomLastName = `Last Name ${(Date.now())}`
        cy.get('input[id="user-settings-lastName-input"]').clear();
        cy.get('input[id="user-settings-lastName-input"]').type(randomLastName)
        cy.getBySel('user-settings-submit').click();
        cy.reload()
        cy.get('input[id="user-settings-lastName-input"]').should('have.value', randomLastName)
    })

    it('validate User Setting update email', () => {
        const randomEmail = `email.${(Date.now())}@email.com`
        cy.get('input[id="user-settings-email-input"]').clear();
        cy.get('input[id="user-settings-email-input"]').type(randomEmail)
        cy.getBySel('user-settings-submit').click();
        cy.reload()
        cy.get('input[id="user-settings-email-input"]').should('have.value', randomEmail)
    })

    it('validate User Setting update phoneNumber', () => {
        const randomPhoneNumber = `${(Cypress._.random(100, 999))}-${(Cypress._.random(100, 999))}-${(Cypress._.random(1000, 9999))}`;
        cy.get('input[id="user-settings-phoneNumber-input"]').clear();
        cy.get('input[id="user-settings-phoneNumber-input"]').type(randomPhoneNumber)
        cy.getBySel('user-settings-submit').click();
        cy.reload()
        cy.get('input[id="user-settings-phoneNumber-input"]').should('have.value', randomPhoneNumber)
    })

    it('validate if First Name field is required', () =>{
        cy.get('input[id="user-settings-firstName-input"]').clear();
        cy.get('[id="user-settings-firstName-input-helper-text"]').should('be.visible')
        cy.get('[id="user-settings-firstName-input-helper-text"]').should('contain.text', 'Enter a first name')
        cy.getBySel('user-settings-submit').should('be.disabled')
    })

    it('validate if Last Name field is required', () =>{
        cy.get('input[id="user-settings-lastName-input"]').clear();
        cy.get('[id="user-settings-lastName-input-helper-text"]').should('be.visible')
        cy.get('[id="user-settings-lastName-input-helper-text"]').should('contain.text', 'Enter a last name')
        cy.getBySel('user-settings-submit').should('be.disabled')
    })

    it('validate if Email field is required', () =>{
        cy.get('input[id="user-settings-email-input"]').clear();
        cy.get('[id="user-settings-email-input-helper-text"]').should('be.visible')
        cy.get('[id="user-settings-email-input-helper-text"]').should('contain.text', 'Enter an email address')
        cy.getBySel('user-settings-submit').should('be.disabled')
    })

     it('validate if Email field is required', () =>{
        cy.get('input[id="user-settings-phoneNumber-input"]').clear();
        cy.get('[id="user-settings-phoneNumber-input-helper-text"]').should('be.visible')
        cy.get('[id="user-settings-phoneNumber-input-helper-text"]').should('contain.text', 'Enter a phone number')
        cy.getBySel('user-settings-submit').should('be.disabled')
    })

    it('validate invalid email format message', () => {
        cy.get('input[id="user-settings-email-input"]').clear();
        cy.get('input[id="user-settings-email-input"]').type('invalid@email');
        cy.get('[id="user-settings-email-input-helper-text"]').should('be.visible')
        cy.get('[id="user-settings-email-input-helper-text"]').should('contain.text', 'Must contain a valid email address')
        cy.getBySel('user-settings-submit').should('be.disabled')
    })

    it('validate invalid phone format message', () => {
        cy.get('input[id="user-settings-phoneNumber-input"]').clear();
        cy.get('input[id="user-settings-phoneNumber-input"]').type('abc123-345-9000')
        cy.get('[id="user-settings-phoneNumber-input-helper-text"]').should('be.visible')
        cy.get('[id="user-settings-phoneNumber-input-helper-text"]').should('contain.text', 'Phone number is not valid')
        cy.getBySel('user-settings-submit').should('be.disabled')

    })


})