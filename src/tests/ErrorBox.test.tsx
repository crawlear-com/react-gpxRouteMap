/**
 * @jest-environment jsdom
 */

import React from 'react';
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import { useTranslation } from "react-i18next"
import ErrorBox from '../components/ErrorBox';


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

test('initial render', () => {
    render(<ErrorBox error={0}/>)
    const errorText = screen.queryByRole('alert')

    expect(errorText).not.toBeInTheDocument()
})

test('render error 1', () => {
    render(<ErrorBox error={-1}/>)
    const errorText = screen.getByRole('alert')

    expect(errorText).toBeInTheDocument()
    expect(errorText?.innerHTML).toBe("errorNotAvailable")
    expect(errorText.className).toBe("errorBox")
})

test('render error 2', () => {
    render(<ErrorBox error={-2}/>)
    const errorText = screen.getByRole('alert')

    expect(errorText).toBeInTheDocument()
    expect(errorText?.innerHTML).toBe("errorNotResolved")
})