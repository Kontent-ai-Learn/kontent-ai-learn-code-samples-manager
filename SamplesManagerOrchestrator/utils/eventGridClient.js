const getUuid = require('uuid').v4;

function publishEventsCreator(dependencies) {
    return async function (events) {
        const notifierHost = new URL(dependencies.host).host;
        if (!notifierHost) {
            throw 'Host property is not defined';
        }

        return dependencies.eventGridClient.publishEvents(notifierHost, events);
    };
}

function eventComposer(activityTitle, text, mode = 'error') {
    return {
        data: {
            mode,
            activityTitle,
            text,
        },
        dataVersion: '1.0',
        eventTime: new Date(),
        eventType: 'KenticoDocs.Notification.Created',
        id: getUuid(),
        subject: 'Code samples manager notification',
    };
}

module.exports = {
    eventComposer,
    publishEventsCreator,
};
