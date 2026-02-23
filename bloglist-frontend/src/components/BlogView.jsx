import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import blogService from '../services/blogs'
import { useUser } from '../contexts/UserContext'
import { useNotification } from '../contexts/NotificationContext'

import {
  Card,
  Text,
  Button,
  Group,
  Stack,
  TextInput,
  Divider,
  List
} from '@mantine/core'

const BlogView = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { user } = useUser()
  const { showNotification } = useNotification()

  const { data: blogs, isLoading } = useQuery({
    queryKey: ['blogs'],
    queryFn: blogService.getAll
  })

  const likeBlogMutation = useMutation({
    mutationFn: async (blog) => {
      const updatedBlog = {
        ...blog,
        likes: blog.likes + 1,
        user: blog.user.id
      }
      return blogService.update(blog.id, updatedBlog)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] })
    }
  })

  const commentMutation = useMutation({
    mutationFn: ({ id, comment }) => blogService.addComment(id, comment),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] })
    }
  })

  const deleteBlogMutation = useMutation({
    mutationFn: (blog) => blogService.remove(blog.id),
    onSuccess: (_, blog) => {
      showNotification(`Deleted "${blog.title}"`)
      queryClient.invalidateQueries({ queryKey: ['blogs'] })
      navigate('/')
    }
  })

  if (isLoading) return <Text>loading blog...</Text>

  const blog = blogs.find((b) => b.id === id)
  if (!blog) return null

  const isOwner = user && blog.user && user.username === blog.user.username

  const handleDelete = () => {
    if (window.confirm(`Remove blog "${blog.title}" by ${blog.author}?`)) {
      deleteBlogMutation.mutate(blog)
    }
  }

  const handleComment = (e) => {
    e.preventDefault()
    const comment = e.target.comment.value
    commentMutation.mutate({ id: blog.id, comment })
    e.target.comment.value = ''
  }

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Stack>
        <Text fw={700} size="xl">
          {blog.title}
        </Text>

        <Text component="a" href={blog.url} c="blue" target="_blank">
          {blog.url}
        </Text>

        <Group>
          <Text>{blog.likes} likes</Text>
          <Button size="xs" onClick={() => likeBlogMutation.mutate(blog)}>
            like
          </Button>
        </Group>

        <Text c="dimmed">added by {blog.user?.name}</Text>

        {isOwner && (
          <Button
            color="red"
            size="xs"
            onClick={handleDelete}
            style={{ alignSelf: 'flex-start' }}
          >
            delete
          </Button>
        )}

        <Divider my="sm" />

        <Text fw={600}>Add comment</Text>

        <form onSubmit={handleComment}>
          <Group align="flex-end">
            <TextInput
              name="comment"
              placeholder="Write a comment..."
              style={{ flexGrow: 1 }}
            />
            <Button type="submit">add</Button>
          </Group>
        </form>

        <Divider my="sm" />

        <Text fw={600}>Comments</Text>

        {blog.comments && blog.comments.length > 0 ? (
          <List spacing="xs">
            {blog.comments.map((comment, index) => (
              <List.Item key={index}>{comment}</List.Item>
            ))}
          </List>
        ) : (
          <Text c="dimmed">No comments yet</Text>
        )}
      </Stack>
    </Card>
  )
}

export default BlogView
