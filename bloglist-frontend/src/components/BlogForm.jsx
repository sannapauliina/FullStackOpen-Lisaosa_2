import { useState } from 'react'
import { Card, TextInput, Button, Stack, Text } from '@mantine/core'

const BlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()

    createBlog({
      title,
      author,
      url
    })

    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder mb="lg">
      <Text fw={600} size="lg" mb="sm">
        Create new blog
      </Text>

      <form onSubmit={handleSubmit}>
        <Stack gap="md">
          <TextInput
            label="Title"
            placeholder="Blog title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <TextInput
            label="Author"
            placeholder="Blog author"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            required
          />

          <TextInput
            label="URL"
            placeholder="https://example.com"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            required
          />

          <Button type="submit">Create</Button>
        </Stack>
      </form>
    </Card>
  )
}

export default BlogForm
