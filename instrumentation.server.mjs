import * as Sentry from "@sentry/remix";

Sentry.init({
    dsn: "https://ac1f85ada3fc826224bb13d9d254b3c9@o4507845330141184.ingest.de.sentry.io/4507845333680208",
    tracesSampleRate: 1,
    autoInstrumentRemix: true
})