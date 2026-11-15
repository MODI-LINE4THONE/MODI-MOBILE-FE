// Same format as onboarding. Server validation is still required before real linking.
export const isRegistrationCodeComplete = code => typeof code === 'string' && /^[A-Z]{2}\d{4}$/.test(code)
