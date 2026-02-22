import { Link } from 'react-router-dom'
import { useUser } from '../contexts/UserContext'

const Navigation = () => {
  const { user, dispatch } = useUser()

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    dispatch({ type: 'CLEAR_USER' })
  }

  const style = {
    padding: 8,
    background: '#ddd',
    marginBottom: 10
  }

  const linkStyle = {
    marginRight: 10
  }

  return (
    <div style={style}>
      <Link to="/" style={linkStyle}>
        blogs
      </Link>
      <Link to="/users" style={linkStyle}>
        users
      </Link>

      {user && (
        <>
          {user.name} logged in
          <button onClick={handleLogout} style={{ marginLeft: 10 }}>
            logout
          </button>
        </>
      )}
    </div>
  )
}

export default Navigation
