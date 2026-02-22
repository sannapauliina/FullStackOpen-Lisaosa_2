import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'

import { useNotification } from './contexts/NotificationContext'
import { useUser } from './contexts/UserContext'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import Users from './components/Users'
import User from './components/User'

const App = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const blogFormRef = useRef()

  const { showNotification } = useNotification()
  const { user, dispatch } = useUser()
  const queryClient = useQueryClient()

  // Fetch blogs React Query
  const { data: blogs, isLoading } = useQuery({
    queryKey: ['blogs'],
    queryFn: blogService.getAll
  })

  console.log('BLOGS FROM QUERY:', blogs)

  // Create blog mutation
  const newBlogMutation = useMutation({
    mutationFn: blogService.create,
    onSuccess: (newBlog) => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] })
      showNotification(
        `a new blog "${newBlog.title}" by ${newBlog.author} added`
      )
      blogFormRef.current.toggleVisibility()
    },
    onError: () => {
      showNotification('failed to add blog', 'error')
    }
  })

  // Like blog mutation
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
    },
    onError: () => {
      showNotification('failed to update likes', 'error')
    }
  })

  // Delete blog mutation
  const deleteBlogMutation = useMutation({
    mutationFn: (blog) => blogService.remove(blog.id),
    onSuccess: (_, blog) => {
      showNotification(`Deleted "${blog.title}"`)
      queryClient.invalidateQueries({ queryKey: ['blogs'] })
    },
    onError: () => {
      showNotification('failed to delete blog', 'error')
    }
  })

  // Login logic
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

  // Load logged user from localStorage
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const savedUser = JSON.parse(loggedUserJSON)
      blogService.setToken(savedUser.token)
      dispatch({ type: 'SET_USER', payload: savedUser })
    }
  }, [dispatch])

  if (isLoading) {
    return <div>loading blogs...</div>
  }

  // Login view
  if (user === null) {
    return (
      <div>
        <Notification />

        <h2>Log in to application</h2>
        <form onSubmit={handleLogin}>
          <div>
            username
            <input
              value={username}
              onChange={({ target }) => setUsername(target.value)}
            />
          </div>
          <div>
            password
            <input
              type="password"
              value={password}
              onChange={({ target }) => setPassword(target.value)}
            />
          </div>
          <button type="submit">login</button>
        </form>
      </div>
    )
  }

  // Logged in view
  return (
    <Router>
      <div>
        <Notification />

        <p>
          {user.name} logged in
          <button
            onClick={() => {
              window.localStorage.removeItem('loggedBlogappUser')
              dispatch({ type: 'CLEAR_USER' })
            }}
          >
            logout
          </button>
        </p>

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

                <h2>blogs</h2>
                {blogs
                  .slice()
                  .sort((a, b) => b.likes - a.likes)
                  .map((blog) => (
                    <Blog
                      key={blog.id}
                      blog={blog}
                      onLike={() => likeBlogMutation.mutate(blog)}
                      onDelete={() => deleteBlogMutation.mutate(blog)}
                    />
                  ))}
              </>
            }
          />

          <Route path="/users" element={<Users />} />
          <Route path="/users/:id" element={<User />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
