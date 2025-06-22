import { useContext } from 'react';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';

const NavigationBar = () => {
  const { user, logout } = useContext(AuthContext);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const isDark = theme === 'dark';

  const isAdmin = user?.username === 'admin';

  return (
    <Navbar bg={isDark ? 'dark' : 'light'} variant={isDark ? 'dark' : 'light'} expand="lg">
      <Container>
        <Navbar.Brand as={Link} to="/">MyShop</Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse>
          <Nav className="me-auto">
            {isAdmin ? (
              <Nav.Link as={Link} to="/admin">Dashboard</Nav.Link>
            ) : (
              <>
                <Nav.Link as={Link} to="/">Home</Nav.Link>
                <Nav.Link as={Link} to="/cart">Cart</Nav.Link>
              </>
            )}
          </Nav>

          <Nav className="align-items-center">
            {user ? (
              <>
                {!isAdmin && <Nav.Link as={Link} to="/orders">My Orders</Nav.Link>}
                <Navbar.Text className="me-2">Hello, {user.username}</Navbar.Text>
                <Button variant="outline-danger" size="sm" onClick={logout}>Logout</Button>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/login">Login</Nav.Link>
                <Nav.Link as={Link} to="/register">Register</Nav.Link>
              </>
            )}

            <Button
              variant={isDark ? 'outline-light' : 'outline-dark'}
              size="sm"
              className="ms-3"
              onClick={toggleTheme}
              title="Toggle light/dark mode"
            >
              {isDark ? '🌞' : '🌙'}
            </Button>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavigationBar;
