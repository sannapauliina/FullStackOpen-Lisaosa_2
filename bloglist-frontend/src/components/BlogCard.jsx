import { Card, Text, Group } from '@mantine/core'
import { Link } from 'react-router-dom'

const BlogCard = ({ blog }) => {
  return (
    <Card
      component={Link}
      to={`/blogs/${blog.id}`}
      shadow="sm"
      padding="lg"
      radius="md"
      withBorder
      mb="md"
      style={{ textDecoration: 'none' }}
    >
      <Group justify="space-between" mb="xs">
        <Text fw={600} size="lg">
          {blog.title}
        </Text>
        <Text size="sm" c="dimmed">
          {blog.author}
        </Text>
      </Group>

      <Text size="sm" c="dimmed">
        {blog.likes} likes
      </Text>
    </Card>
  )
}

export default BlogCard
