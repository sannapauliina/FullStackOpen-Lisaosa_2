import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'
import { vi } from 'vitest'

test('calls createBlog with correct details when form is submitted', async () => {
  const createBlog = vi.fn()

  render(<BlogForm createBlog={createBlog} />)

  const user = userEvent.setup()

  // Haetaan kaikki tekstikentät järjestyksessä
  const inputs = screen.getAllByRole('textbox')

  const titleInput = inputs[0]
  const authorInput = inputs[1]
  const urlInput = inputs[2]

  // Syötetään arvot
  await user.type(titleInput, 'Testing forms')
  await user.type(authorInput, 'Form Author')
  await user.type(urlInput, 'http://example.com')

  // Lähetetään lomake
  const createButton = screen.getByText('create')
  await user.click(createButton)

  // Tarkistetaan, että createBlog kutsuttiin oikeilla tiedoilla
  expect(createBlog).toHaveBeenCalledTimes(1)
  expect(createBlog.mock.calls[0][0]).toEqual({
    title: 'Testing forms',
    author: 'Form Author',
    url: 'http://example.com'
  })
})
