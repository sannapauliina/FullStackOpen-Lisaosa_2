import { useState } from 'react'

const Blog = ({ blog, onLike, onDelete, user }) => {
  const [visible, setVisible] = useState(false)

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  const showWhenVisible = { display: visible ? '' : 'none' }

  const canDelete =
    blog.user?.username === user.username || blog.user === user.id

  return (
    <div className="blog">
      <div>
        {blog.title} {blog.author}
        <button onClick={toggleVisibility}>{visible ? 'hide' : 'view'}</button>
      </div>

      <div style={showWhenVisible} className="blogDetails">
        <div>{blog.url}</div>
        <div>
          likes {blog.likes}
          <button onClick={onLike}>like</button>
        </div>
        <div>{blog.user?.name}</div>

        {canDelete && <button onClick={onDelete}>remove</button>}
      </div>
    </div>
  )
}

export default Blog
