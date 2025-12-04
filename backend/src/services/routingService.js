// backend/src/services/routingService.js

const getRoutes = async (fromCoords, toCoords, dateTime) => {
  let dateArg = "";
  if (dateTime) {
    const dt = new Date(dateTime);
    const dateStr = dt.toISOString().split("T")[0]; // yyyy-mm-dd
    const timeStr = dt.toTimeString().split(" ")[0]; // HH:mm:ss
    dateArg = `date: "${dateStr}", time: "${timeStr}", arriveBy: false`;
  }

  const query = `{
    plan(
      from: { lat: ${fromCoords.lat}, lon: ${fromCoords.lon} }
      to: { lat: ${toCoords.lat}, lon: ${toCoords.lon} }
      numItineraries: 5
      ${dateArg}
    ) {
      itineraries {
        duration
        walkDistance
        legs {
          mode
          distance
          duration
          startTime
          endTime
          realTime

          from {
            name
            lat
            lon
            stop {
              code
              name
              platformCode
              zoneId
              lat
              lon
            }
          }
          to {
            name
            lat
            lon
            stop {
              code
              name
              platformCode
              zoneId
              lat
              lon
            }
          }

          route {
            shortName
            longName
          }

          intermediatePlaces {
            name
            stop {
              name
              code
              lat
              lon
              platformCode
            }
          }
        }
      }
    }
  }`;

  const transportUrl = process.env.TRANSPORT_URL;
  const transportUrlResponse = await fetch(transportUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "digitransit-subscription-key": process.env.TRANSPORT_KEY,
    },
    body: JSON.stringify({ query }),
  });

  const json = await transportUrlResponse.json();
  return json?.data?.plan?.itineraries || [];
};

module.exports = { getRoutes };
