/**
 * @jest-environment jsdom
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react'
import { MapPointPicker } from '../components';
import 'leaflet-gpx'
import * as L from 'leaflet'
import '@testing-library/jest-dom'

let fnCallbackToTest: Function

const fitBounds = () => {
  return { 
    on: jest.fn().mockImplementation((eventType: string, callback: Function) => {
      fnCallbackToTest = callback
    }),
    off: jest.fn(),
    fitBounds: jest.fn(),
    getBounds: jest.fn(),
    remove: jest.fn()
   }
}

//Note as leaflet-gpx adds defines L.GPX, the mock order must to not change
jest.mock('leaflet-gpx')
jest.mock('leaflet', () => {
  return {
    map: jest.fn().mockImplementation(() => {
      return {
        fitWorld: jest.fn(),
        fitBounds: fitBounds,
        on: jest.fn(),
        remove: jest.fn()
      }
    }),
    tileLayer: jest.fn().mockImplementation(() => {
      return { addTo: jest.fn() }
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
    }),
    marker: jest.fn().mockImplementation(() => {
      return {
        addTo: jest.fn().mockImplementation(() => {
          return { remove: jest.fn() }
        }),
        bindPopup: jest.fn().mockImplementation(() => {
          return { openPopup: jest.fn().mockImplementation(() => {
            return { addTo: jest.fn() }
          }) }
        })
      }
    }),
    circle: jest.fn().mockImplementation(() => {
      return {
        addTo: jest.fn().mockImplementation(() => {
          return { remove: jest.fn() }
        })
      }
    })
  }
})

afterEach(() => {
  jest.clearAllMocks()
});

test('MapPointPicker renders the content', () => {
  const mapClick = jest.fn()
  const points:Array<any> = [ { point: { lat: 0, lon: 0}, content: '' }]
  const { container } = render(<MapPointPicker onMapClick={mapClick} points={points} />)
  const div = screen.queryByTitle('mapPointPicker')

  expect(div).toBeInTheDocument()
  expect(div?.getAttribute('id')).toEqual('mappicker')
  expect(L.map).toHaveBeenCalledWith('mappicker')
  expect(L.tileLayer).toHaveBeenCalledWith('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19, attribution: '© OpenStreetMap'
  })
})

test('MapPointPicker click event draws a circle', () => {
  const mapClick = jest.fn()
  const points:Array<any> = []
  const { container } = render(<MapPointPicker onMapClick={mapClick} points={points} />)

  fnCallbackToTest({ latlng: { lat: 12, lng: 12 }})
  expect(L.circle).toHaveBeenCalledWith([12, 12], {
    color: '#444',
    fillColor: '#447',
    "fillOpacity": 0.2,
    "radius": NaN
  })
})