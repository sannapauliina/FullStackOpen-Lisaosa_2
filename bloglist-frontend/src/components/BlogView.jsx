import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import blogService from '../services/blogs'
import { useUser } from '../contexts/UserContext'
import { useNotification } from '../contexts/NotificationContext'

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

  if (isLoading) return <div>loading blog...</div>

  const blog = blogs.find((b) => b.id === id)

  if (!blog) return null

  const handleDelete = () => {
    if (window.confirm(`Remove blog "${blog.title}" by ${blog.author}?`)) {
      deleteBlogMutation.mutate(blog)
    }
  }

  const isOwner = user && blog.user && user.username === blog.user.username

  return (
    <div>
      <h2>{blog.title}</h2>

      <a href={blog.url}>{blog.url}</a>

      <p>
        {blog.likes} likes
        <button onClick={() => likeBlogMutation.mutate(blog)}>like</button>
      </p>

      <p>added by {blog.user?.name}</p>

      {isOwner && (
        <button
          onClick={handleDelete}
          style={{ background: 'red', color: 'white' }}
        >
          delete
        </button>
      )}

      <h3>add comment</h3>

      <form
        onSubmit={(e) => {
          e.preventDefault()
          const comment = e.target.comment.value
          commentMutation.mutate({ id: blog.id, comment })
          e.target.comment.value = ''
        }}
      >
        <input name="comment" />
        <button type="submit">add comment</button>
      </form>

      <h3>comments</h3>

      <ul>
        {blog.comments && blog.comments.length > 0 ? (
          blog.comments.map((comment, index) => <li key={index}>{comment}</li>)
        ) : (
          <li>No comments yet</li>
        )}
      </ul>
    </div>
  )
}

export default BlogView
