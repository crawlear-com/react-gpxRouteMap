import { i18n, createInstance } from "i18next"
import { initReactI18next } from "react-i18next"
import LanguageDetector from 'i18next-browser-languagedetector'

const i18n = createInstance({
  ns: 'gpxRouteMap',
  resources: {
    en: {
      translation: {
        gpxupload: "Upload a GPX file",
        distancia: "Distance",
        velocidad: "Speed",
        tiempo: "Time",
        tiempomovimiento: "Movement time",
        elevacionmin: "Elevation min",
        elevacionmax: "Elevation max",
      }
    },
    es: {
      translation: {
          gpxupload: "Sube un fichero GPX",
          distancia: "Distancia",
          velocidad: "Velocidad",
          tiempo: "Tiempo",
          tiempomovimiento: "Tiempo en movimiento",
          elevacionmin: "Elevación min",
          elevacionmax: "Elevación max"  
        }
    }
  },
  lng: "en", 
  fallbackLng: "en",

  interpolation: {
    escapeValue: false
  }
});

i18n.init();