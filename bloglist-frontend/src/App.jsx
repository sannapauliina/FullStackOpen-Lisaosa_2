import { useState, useEffect, useRef } from 'react'

import blogService from './services/blogs'
import loginService from './services/login'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'
import BlogCard from './components/BlogCard'

import { useNotification } from './contexts/NotificationContext'
import { useUser } from './contexts/UserContext'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Users from './components/Users'
import User from './components/User'
import BlogView from './components/BlogView'
import Navigation from './components/Navigation'

import { Container, Box, Title, Button, TextInput } from '@mantine/core'

const App = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const blogFormRef = useRef()

  const { showNotification } = useNotification()
  const { user, dispatch } = useUser()
  const queryClient = useQueryClient()

  const { data: blogs, isLoading } = useQuery({
    queryKey: ['blogs'],
    queryFn: blogService.getAll
  })

  const newBlogMutation = useMutation({
    mutationFn: blogService.create,
    onSuccess: (newBlog) => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] })
      showNotification(
        `a new blog "${newBlog.title}" by ${newBlog.author} added`
      )
      blogFormRef.current.toggleVisibility()
    },
    onError: () => showNotification('failed to add blog', 'error')
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
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['blogs'] }),
    onError: () => showNotification('failed to update likes', 'error')
  })

  const deleteBlogMutation = useMutation({
    mutationFn: (blog) => blogService.remove(blog.id),
    onSuccess: (_, blog) => {
      showNotification(`Deleted "${blog.title}"`)
      queryClient.invalidateQueries({ queryKey: ['blogs'] })
    },
    onError: () => showNotification('failed to delete blog', 'error')
  })

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const loggedUser = await loginService.login({ username, password })

      window.localStorage.setItem(
        'loggedBlogappUser',
        JSON.stringify(loggedUser)
      )
      blogService.setToken(loggedUser.token)

      dispatch({ type: 'SET_USER', payload: loggedUser })

      setUsername('')
      setPassword('')

      showNotification(`Welcome back, ${loggedUser.name}!`)
    } catch {
      showNotification('wrong username/password', 'error')
    }
  }

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const savedUser = JSON.parse(loggedUserJSON)
      blogService.setToken(savedUser.token)
      dispatch({ type: 'SET_USER', payload: savedUser })
    }
  }, [dispatch])

  if (isLoading) return <div>loading blogs...</div>

  if (user === null) {
    return (
      <Container size="sm" py={40}>
        <Title order={2} mb={20}>
          Log in to application
        </Title>

        <Box component="form" onSubmit={handleLogin}>
          <TextInput
            label="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            mb="md"
          />

          <TextInput
            label="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            mb="md"
          />

          <Button type="submit" color="blue">
            login
          </Button>
        </Box>
      </Container>
    )
  }

  return (
    <Router>
      <Container size="md" py={20}>
        <Navigation />

        <Box mt="md">
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <Togglable buttonLabel="create new blog" ref={blogFormRef}>
                    <BlogForm
                      createBlog={(blog) => newBlogMutation.mutate(blog)}
                    />
                  </Togglable>

                  <Title order={2} mt={30} mb={20}>
                    blogs
                  </Title>

                  {blogs
                    .slice()
                    .sort((a, b) => b.likes - a.likes)
                    .map((blog) => (
                      <BlogCard key={blog.id} blog={blog} />
                    ))}
                </>
              }
            />

            <Route path="/users" element={<Users />} />
            <Route path="/users/:id" element={<User />} />
            <Route path="/blogs/:id" element={<BlogView />} />
          </Routes>
        </Box>
      </Container>
    </Router>
  )
}

export default App
