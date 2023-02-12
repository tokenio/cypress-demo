Feature: Create Payment Request
    
    # @token-callback @two-step
    Scenario: Verify that token callback requests is sent successfully for mock-redirect

        Given User Sends createPaymentRequest to "mock-redirect" bank id
        When User visits the redirect url
        Then Final url should be "^https://auth\.dev\.token\.io/mock-integration/dumb\?member-id=m:[a-zA-Z0-9]+:[a-zA-Z0-9]+&payment-id=pm2:[a-zA-Z0-9]+:[a-zA-Z0-9]+&state=CallbackState[0-9]+&status=INITIATION_PENDING_REDEMPTION$"
        When Token redeems the payment and gets "INITIATION_PROCESSING" status
        Then User sends getPayment request and gets "INITIATION_PROCESSING" status

    
    # @token-callback @one-step-decoupled
    # Scenario: Verify that token callback requests is sent successfully for Banco Posta

    #     Given User Sends createPaymentRequest to "ngp-cbi-07601-annex" bank id
    #     When User visits the redirect url
    #     Then Final url should be "^https://auth\.dev\.token\.io/mock-integration/dumb\?member-id=m:[a-zA-Z0-9]+:[a-zA-Z0-9]+&payment-id=pm2:[a-zA-Z0-9]+:[a-zA-Z0-9]+&state=CallbackState[0-9]+&status=INITIATION_PENDING_REDEMPTION$"
    #     When Token redeems the payment and gets "INITIATION_PROCESSING" status
    #     Then User sends getPayment request and gets "INITIATION_PROCESSING" status
        
       

    