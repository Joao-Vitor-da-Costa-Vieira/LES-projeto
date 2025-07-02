Cypress.Commands.add('handleAlert', { prevSubject: 'optional' }, (subject, expectedText, options = {}) => {
  const timeout = options.timeout || 4000; // Default timeout of 4 seconds
  const startTime = Date.now();

  return cy.window().then((win) => {
    return new Promise((resolve, reject) => {
      const originalAlert = win.alert;
      let alertTriggered = false;

      // Set up timeout check
      const timeoutCheck = setInterval(() => {
        if (Date.now() - startTime > timeout) {
          cleanup();
          reject(new Error(`Alert not triggered within ${timeout}ms`));
        }
      }, 100);

      const cleanup = () => {
        clearInterval(timeoutCheck);
        win.alert = originalAlert; // Always restore original alert
      };

      win.alert = (text) => {
        cleanup();
        alertTriggered = true;
        
        const success = text.includes(expectedText);
        if (success) {
          cy.log(`✅ Alert verificado: ${text}`);
        } else {
          cy.log(`❌ Alert falhou: Esperado "${expectedText}", Recebido "${text}"`);
        }
        
        resolve(text);
      };

      // If there's a subject, execute the action
      if (subject) {
        cy.wrap(subject).click();
      }

      // For cases where alert might be triggered without subject
      if (!subject && options.trigger) {
        options.trigger();
      }
    });
  });
});