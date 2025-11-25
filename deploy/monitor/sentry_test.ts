import * as Sentry from '@sentry/node';
// Example of using the configured alias
// import pkg from '@jade/package.json'; 

const dsn = process.env.SENTRY_DSN || 'http://fa85f75f4ed84766a4e84639f9d611d6@localhost:8000/1';

Sentry.init({
    dsn: dsn,
    tracesSampleRate: 1.0,
});

async function testSentry() {
    console.log(`Testing Sentry with DSN: ${dsn}`);

    try {
        Sentry.captureMessage("Test message from Node.js to local Sentry!");
        throw new Error("Test error thrown to Sentry local server!");
    } catch (e) {
        Sentry.captureException(e);
        console.log("Error captured.");
    }

    // Flush to ensure events are sent before the process exits
    console.log("Flushing events...");
    await Sentry.close(2000);
    console.log("Done.");
}

testSentry();
