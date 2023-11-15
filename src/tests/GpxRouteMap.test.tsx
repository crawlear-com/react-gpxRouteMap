/**
 * @jest-environment jsdom
 */

import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import { GpxRouteMap } from '../components';
import '@testing-library/jest-dom'

test('GpxRouteMap renders the content', () => {
    const onFileResolved = jest.fn()
    const { container } = render(<GpxRouteMap onFileResolved={onFileResolved}/>)
    
})
