require("dotenv/config");
const { google } = require("googleapis");
const { OAuth2 } = google.auth;

const oAuth2Client = new OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET
);

oAuth2Client.setCredentials({
  refresh_token: process.env.REFRESH_TOKEN,
});

const createEvent = async (auth) => {
  const calendar = google.calendar({ version: "v3", auth });

  const eventToCreate = {
    calendarId: "primary",
    conferenceDataVersion: 1,

    supportsAttachments: true,
    resource: {
      start: {
        dateTime: "2021-04-10T18:35:00",
        timeZone: "America/Sao_Paulo",
      },
      end: {
        dateTime: "2021-04-10T18:45:00",
        timeZone: "America/Sao_Paulo",
      },
      conferenceData: {
        createRequest: {
          conferenceSolutionKey: {
            type: "hangoutsMeet",
          },
          requestId: "random-string123",
        },
      },
      summary: "Title of the Event",
      description: "Some description",
      // Attendees with the same domain of the creator are able to enter the Meet without permission
      attendees: [{ email: "johndoe@gmail.com" }],
      reminders: {
        useDefault: "useDefault",
      },
      attachments: [
        {
          fileUrl: "https://docs.google.com/document/d/some-google-docs-id",
          title: "Document Title",
          // Full Drive mimeTypes here: https://developers.google.com/drive/api/v3/mime-types
          mimeType: "application/vnd.google-apps.document",
        },
      ],
    },
  };

  calendar.events.insert(eventToCreate, (err, res) => {
    if (err) return console.log("The API returned an error: " + err);
    const meeting = res.data;
    if (meeting) {
      console.log(meeting);
    }
  });
};

const readEvents = async (auth) => {
  const calendar = google.calendar({ version: "v3", auth });
  calendar.events.list(
    {
      calendarId: "primary",
      timeMin: new Date().toISOString(),
      maxResults: 10,
      singleEvents: true,
      orderBy: "startTime",
    },
    (err, res) => {
      if (err) return console.log("The API returned an error: " + err);
      const events = res.data.items;
      if (events.length) {
        console.log("Upcoming 10 events:");
        events.map((event) => {
          console.log(event);
        });
      } else {
        console.log("No upcoming events found.");
      }
    }
  );
};

const updateEvent = async (auth, eventId) => {
  const calendar = google.calendar({ version: "v3", auth });

  const eventToUpdate = {
    calendarId: "primary",
    eventId: eventId,
    conferenceDataVersion: 1,
    supportsAttachments: true,
    resource: {
      start: {
        dateTime: "2021-04-10T18:35:00",
        timeZone: "America/Sao_Paulo",
      },
      end: {
        dateTime: "2021-04-10T18:45:00",
        timeZone: "America/Sao_Paulo",
      },
      conferenceData: {
        createRequest: {
          conferenceSolutionKey: {
            type: "hangoutsMeet",
          },
          requestId: "random-string123",
        },
      },
      summary: "Update Title of the Event",
      description: "Some description",
      // Attendees with the same domain of the creator are able to enter the Meet without permission
      attendees: [{ email: "johndoe@gmail.com" }],
      reminders: {
        useDefault: "useDefault",
      },
      attachments: [
        {
          fileUrl: "https://docs.google.com/document/d/some-google-docs-id",
          title: "Document Title",
          // Full Drive mimeTypes here: https://developers.google.com/drive/api/v3/mime-types
          mimeType: "application/vnd.google-apps.document",
        },
      ],
    },
  };

  calendar.events.patch(eventToUpdate, (err, res) => {
    if (err) return console.log("The API returned an error: " + err);
    const meeting = res.data;
    if (meeting) {
      console.log(meeting);
    }
  });
};

const deleteEvent = async (auth, eventId) => {
  const calendar = google.calendar({ version: "v3", auth });

  try {
    const response = await calendar.events.delete({
      calendarId: "primary",
      eventId: eventId,
    });

    if (response.data === "") {
      console.log(`Event with id ${eventId} deleted successfully`);
    }
  } catch (error) {
    console.log(error);
  }
};

const readEventById = async (auth, eventId) => {
  const calendar = google.calendar({ version: "v3", auth });
  calendar.events.get(
    {
      calendarId: "primary",
      eventId: eventId,
    },
    (err, res) => {
      if (err) {
        return console.log("The API returned an error: " + err);
      }

      const event = res.data;
      if (event) {
        console.log(event);
      } else {
        console.log("No event found.");
      }
    }
  );
};

// createEvent(oAuth2Client);
// readEvents(oAuth2Client);
// updateEvent(oAuth2Client, "some-id");
// deleteEvent(oAuth2Client, "some-id");
// readEventById(oAuth2Client, "some-id");
