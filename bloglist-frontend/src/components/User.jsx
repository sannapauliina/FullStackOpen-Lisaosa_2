import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import userService from '../services/users'
import { Card, Title, Text, List, Divider } from '@mantine/core'

const User = () => {
  const { id } = useParams()

  const { data: users, isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: userService.getAll
  })

  if (isLoading) return <Text>loading user...</Text>

  const user = users.find((u) => u.id === id)
  if (!user) return null

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Title order={2} mb="md">
        {user.name}
      </Title>

      <Divider mb="md" />

      <Title order={4} mb="sm">
        Added blogs
      </Title>

      {user.blogs.length > 0 ? (
        <List spacing="xs">
          {user.blogs.map((blog) => (
            <List.Item key={blog.id}>{blog.title}</List.Item>
          ))}
        </List>
      ) : (
        <Text c="dimmed">This user has not added any blogs</Text>
      )}
    </Card>
  )
}

export default User
