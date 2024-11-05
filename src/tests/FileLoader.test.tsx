/**
 * @jest-environment jsdom
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { useTranslation } from "react-i18next"
import FileLoader from '../components/GpxRouteMap/FileLoader'
import '@testing-library/jest-dom'

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

test('FileLoader renders the content', () => {
    const onFileLoaded = jest.fn()
    const { container } = render(<FileLoader onFileLoaded={onFileLoaded}/>)
    const input = screen.queryByTitle('inputFile')
    const button = screen.queryByTitle('buttonInputFile')


    expect(input).toBeInTheDocument()
    expect(button).toBeInTheDocument()
})

test('click on button fires click on input', () => {
  const onFileLoaded = jest.fn()
  const { container } = render(<FileLoader onFileLoaded={onFileLoaded}/>)
  const input = screen.queryByTitle('inputFile')!
  const button = screen.queryByTitle('buttonInputFile')!
  const clickEventHandler = jest.fn()

  input.addEventListener('click', clickEventHandler)
  fireEvent.click(button)

  expect(clickEventHandler).toHaveBeenCalled()
})

test('change event on input loads the fileContent and calls the callback', async () => {
  const readAsTextSpy = jest.spyOn(FileReader.prototype, 'readAsText')
  const onFileLoaded = jest.fn()
  const { container } = render(<FileLoader onFileLoaded={onFileLoaded}/>)
  const input = screen.queryByTitle('inputFile')!
  const button = screen.queryByTitle('buttonInputFile')!

  fireEvent.click(button)
  fireEvent.change(input, {
    target: { files: [new File(["gpx file content"], "test.gpx", { type: "plain/text" })] },
  })

  await waitFor(() => {expect(readAsTextSpy).toHaveBeenCalled()});
  await waitFor(() => {expect(onFileLoaded).toHaveBeenCalled()});
})
