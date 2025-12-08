require("dotenv").config();
const { parseStringPromise } = require("xml2js");

const WFS_URL = process.env.WEATHER_URL;

const getWeatherCondition = ({ temp, precipitation }) => {
  if (precipitation >= 1) return temp <= 0 ? "snow" : "rain";
  if (precipitation > 0.1) return "drizzle";
  if (temp <= -1) return "freezing";
  if (temp < 5) return "cloudy";
  return "clear";
};

const getWeather = async (lat, lon) => {
  const starttime = new Date().toISOString();
  const endtime = new Date(Date.now() + 60 * 60 * 1000).toISOString(); // +1h
  const params = "Temperature,Precipitation1h,WindSpeedMS";

  const url = `${WFS_URL}?service=WFS&version=2.0.0&request=GetFeature&storedquery_id=ecmwf::forecast::surface::obsstations::simple&latlon=${lat},${lon}&starttime=${starttime}&endtime=${endtime}&parameters=${params}`;

  try {
    const res = await fetch(url);
    const xml = await res.text();
    const json = await parseStringPromise(xml, { explicitArray: false });

    console.log("FMI keys:", Object.keys(json));
    console.log(
      "FeatureCollection:",
      json["wfs:FeatureCollection"]
        ? Object.keys(json["wfs:FeatureCollection"])
        : "MISSING"
    );

    if (json['ExceptionReport']) {
      console.error("FMI ExceptionReport:", JSON.stringify(json['ExceptionReport'], null, 2));
      return null;
    }

    const members = json["wfs:FeatureCollection"]?.["wfs:member"];
    if (!members) return null;

    // Flatten members into an array
    const memberArray = Array.isArray(members) ? members : [members];

    const values = {};

    memberArray.forEach((member) => {
      const elements = member["BsWfs:BsWfsElement"];
      if (!elements) return;

      // Some members have multiple BsWfsElements
      const elemsArray = Array.isArray(elements) ? elements : [elements];

      elemsArray.forEach((el) => {
        const paramName = el["BsWfs:ParameterName"];
        const paramValue = parseFloat(el["BsWfs:ParameterValue"]);
        if (!isNaN(paramValue)) {
          values[paramName] = paramValue;
        }
      });
    });

    const weather = {
      temp: values.Temperature ?? null,
      wind: values.WindSpeedMS ?? 0,
      precipitation: values.Precipitation1h ?? 0,
    };

    console.log("Parsed weather values:", weather);

    return {
      ...weather,
      condition: getWeatherCondition(weather),
    };
  } catch (err) {
    console.error("Weather fetch failed:", err);
    return null;
  }
};

module.exports = { getWeather };
