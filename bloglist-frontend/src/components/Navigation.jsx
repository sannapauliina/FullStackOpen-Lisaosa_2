import { Link as RouterLink } from 'react-router-dom'
import { useUser } from '../contexts/UserContext'
import { Box, Flex, Anchor, Button } from '@mantine/core'

const Navigation = () => {
  const { user, dispatch } = useUser()

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    dispatch({ type: 'CLEAR_USER' })
  }

  return (
    <Box
      px="md"
      py="sm"
      mb="lg"
      style={{
        background: '#f1f3f5',
        borderRadius: 8,
        width: '100%'
      }}
    >
      <Flex justify="space-between" align="center">
        {/* Left side links */}
        <Flex gap="lg" align="center">
          <Anchor component={RouterLink} to="/" underline="never">
            blogs
          </Anchor>

          <Anchor component={RouterLink} to="/users" underline="never">
            users
          </Anchor>
        </Flex>

        {/* Right side user info */}
        {user && (
          <Flex gap="md" align="center">
            <span>{user.name} logged in</span>
            <Button color="red" size="xs" onClick={handleLogout}>
              logout
            </Button>
          </Flex>
        )}
      </Flex>
    </Box>
  )
}

export default Navigation
