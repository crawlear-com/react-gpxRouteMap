import { i18n, createInstance } from "i18next"
import { initReactI18next } from "react-i18next"
import LanguageDetector from 'i18next-browser-languagedetector'

const i18n = createInstance()
i18n.use(LanguageDetector)
  .use(initReactI18next)
  .init({
  ns: '©',
  supportedLngs: ['es', 'en'],
  fallbackLng: 'en',
  lng: "en",
  interpolation: {
    escapeValue: false
  },
  resources: {
    en: {
      gpxRouteMap: {
        gpxupload: "Upload a GPX file",
        distancia: "Distance",
        velocidad: "Speed",
        tiempo: "Time",
        tiempomovimiento: "Movement time",
        elevacionmin: "Elevation min",
        elevacionmax: "Elevation max",
        errorNotAvailable: "The gelocation privacy permissions don't allow to record your position. Please give the required permissions at the system preferences.",
        errorNotResolved: "The geolocation could not be resolved",
        errorNoWakeLock: "The wake lock mechanism cannot be guarantee, so keep your mobile on to record all the route correctly",
        recbutton: "You can upload a gpx data file from your favorite GPS device or app (using trk format), or you can save a new one using the Rec button:"
      }
    },
    es: {
      gpxRouteMap: {
        gpxupload: "Sube un fichero GPX",
        distancia: "Distancia",
        velocidad: "Velocidad",
        tiempo: "Tiempo",
        tiempomovimiento: "Tiempo en movimiento",
        elevacionmin: "Elevación min",
        elevacionmax: "Elevación max",
        errorNotAvailable: "Los permisos de privacidad en geolocalización no permiten obtener tu posición. Por favor da los permisos necesarios en la configuración del sistema",
        errorNotResolved: "La geolocalización no pudo resolverse",
        errorNoWakeLock: "El mecanismo de bloqueo del mobil no puede farantizarse, así que evita que el móvil se bloquee para poder guardar la ruta correctamente",
        recbutton: "Puedes usar un fichero gpx de tu dispositivo o app GPS favoritos o bien puedes generar una nueva ruta en vivo usabdo el boton de Rec:"
        }
    }
  }
});

export default i18n