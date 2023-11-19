import i18n from "i18next"
import { initReactI18next } from "react-i18next"

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: {
          gpxupload: "Use a GPX file to generate the route map",
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
            gpxupload: "Usa un fichero GPX para generar la ruta",
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
})