/**
 * @jest-environment jsdom
 */

import React from 'react';
import { render, screen } from '@testing-library/react'
import { GpxRouteMap } from '../components';
import 'leaflet-gpx'
import * as L from 'leaflet'
import '@testing-library/jest-dom'
import { useTranslation } from "react-i18next"
import FileLoader from '../components/GpxRouteMap/FileLoader';

const fitWorld = jest.fn()
const addToMap = jest.fn()
const fitBounds = jest.fn()

jest.mock('../i18n', () => {
  return {}
})
jest.mock('../components/GpxRouteMap/FileLoader')
//Note as leaflet-gpx adds defines L.GPX, the mock order must to not change
jest.mock('leaflet-gpx')
jest.mock('leaflet', () => {
  return {
    map: jest.fn().mockImplementation(() => {
      return { 
        fitWorld: fitWorld,
        fitBounds: fitBounds
      }
    }),
    tileLayer: jest.fn().mockImplementation(() => {
      return { addTo: addToMap }
    }),
    FeatureGroup: {
      extend: jest.fn()
    },
    GPX: jest.fn().mockImplementation(() => {
      return {
        on: jest.fn().mockImplementation(() => {
          return { addTo: jest.fn() }
        })
      }
    }),
    icon: jest.fn().mockImplementation(() => {
      return { }
    })
  }
})

jest.mock('react-i18next', () => ({
  useTranslation: () => {
      return {
          t: (str: string) => str,
          i18n: {
              changeLanguage: () => new Promise(() => {}),
          }
      };
  }
}));

test('GpxRouteMap renders the content without FileLoader', () => {
  const onFileResolved = jest.fn()
  const { container } = render(<GpxRouteMap />)
  const div = screen.queryByTitle('routeMap')

  expect(FileLoader).not.toHaveBeenCalled()
  expect(div).toBeInTheDocument()
})

test('GpxRouteMap renders the content with FileLoader', () => {
  const onFileResolved = jest.fn()
  const { container } = render(<GpxRouteMap onFileResolved={() => {}}/>)

  expect(FileLoader).toHaveBeenCalled()
})

test('GpxRouteMap inits without gpx', () => {
    const onFileResolved = jest.fn()
    const { container } = render(<GpxRouteMap onFileResolved={onFileResolved}/>)

    expect(L.map).toHaveBeenCalledWith('map')
    expect(L.map('map').fitWorld).toHaveBeenCalled()
    expect(L.tileLayer).toHaveBeenCalledWith('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap'
    })
    expect(addToMap).toHaveBeenCalled()
    //clean gpx
    expect(L.GPX).not.toHaveBeenCalled()
    expect(L.GPX).not.toHaveBeenCalledWith("<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"no\" ?><gpx xmlns=\"http://www.topografix.com/GPX/1/1\" xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xsi:schemaLocation=\"http://www.topografix.com/GPX/1/1 http://www.topografix.com/GPX/1/1/gpx.xsd\" version=\"1.1\" creator=\"murbit GPX Tracker\"><trk><trkseg></trkseg></trk></gpx>", {"async": true, "marker_options": {"endIconUrl": "/marker-icon-end.png", "shadowUrl": "/marker-shadow.png", "startIconUrl": "/marker-icon-start.png", "wptIconUrls": {"": "/marker-icon.png"}}})
})

test('GpxRouteMap inits with gpx', () => {
  const gpxData = '<?xml version="1.0" encoding="UTF-8" standalone="no" ?><gpx xmlns="http://www.topografix.com/GPX/1/1" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.topografix.com/GPX/1/1 http://www.topografix.com/GPX/1/1/gpx.xsd" version="1.1" creator="murbit GPX Tracker"><trk><trkseg><trkpt lon="2.232451676089" lat="41.464365645549"><ele>109.162894217297</ele><time>2023-11-11T10:23:03+01:00</time><magvar>329.741264</magvar><hdop>13.311291</hdop><vdop>9.892030</vdop><speed>0.000000</speed></trkpt><trkpt lon="2.232451676089" lat="41.464365645549"><ele>109.162894217297</ele><time>2023-11-11T10:23:03+01:00</time><magvar>329.741264</magvar><hdop>13.311291</hdop><vdop>9.892030</vdop><speed>0.000000</speed></trkpt></trkseg></trk></gpx>'
  const onFileResolved = jest.fn()
  const { container } = render(<GpxRouteMap gpx={gpxData} onFileResolved={onFileResolved}/>)

  expect(L.GPX).toHaveBeenCalledWith(gpxData, {
    async: true,
    marker_options: {
      wptIconUrls: { '': '/marker-icon.png' },
      startIconUrl: '/marker-icon-start.png',
      endIconUrl: '/marker-icon-end.png',
      shadowUrl: '/marker-shadow.png'
    }})
})