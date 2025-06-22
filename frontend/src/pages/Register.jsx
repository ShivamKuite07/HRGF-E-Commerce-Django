import { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import {
  Form,
  Button,
  Container,
  Row,
  Col,
  Card,
  InputGroup
} from 'react-bootstrap';

const Register = () => {
  const { register } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);
  const isDark = theme === 'dark';

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);

  const handleSubmit = e => {
    e.preventDefault();
    register(username, email, password);
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: isDark
          ? 'linear-gradient(135deg, #121212, #1f1f1f)'
          : '#f4f6f9',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '30px',
        color: isDark ? '#fff' : '#000',
        transition: 'all 0.3s ease'
      }}
    >
      <Container>
        <Row className="justify-content-center">
          <Col md={6} lg={5}>
            <Card
              style={{
                border: 'none',
                borderRadius: '15px',
                boxShadow: '0 8px 20px rgba(0,0,0,0.2)',
                background: isDark ? 'rgba(255, 255, 255, 0.05)' : '#fff',
                backdropFilter: isDark ? 'blur(8px)' : 'none',
                color: isDark ? '#fff' : '#000',
                transition: 'all 0.3s ease'
              }}
            >
              <Card.Body>
                <h2 className="text-center mb-3">Create Account ✨</h2>
                <p
                  className="text-center mb-4"
                  style={{ fontSize: '14px', color: isDark ? '#ccc' : '#666' }}
                >
                  Sign up to get started
                </p>

                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3" controlId="username">
                    <Form.Label>Username</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter your username"
                      value={username}
                      onChange={e => setUsername(e.target.value)}
                      required
                      autoComplete="username"
                    />
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="email">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      required
                      autoComplete="email"
                    />
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="password">
                    <Form.Label>Password</Form.Label>
                    <InputGroup>
                      <Form.Control
                        type={showPwd ? 'text' : 'password'}
                        placeholder="Enter your password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        required
                        autoComplete="new-password"
                      />
                      <Button
                        variant={isDark ? 'outline-light' : 'outline-secondary'}
                        onClick={() => setShowPwd(prev => !prev)}
                      >
                        {showPwd ? 'Hide' : 'Show'}
                      </Button>
                    </InputGroup>
                  </Form.Group>

                  <div className="d-grid mt-4">
                    <Button
                      type="submit"
                      variant={isDark ? 'light' : 'primary'}
                      size="lg"
                    >
                      Register
                    </Button>
                  </div>
                </Form>

                <p
                  className="text-center mt-4 mb-0"
                  style={{ fontSize: '13px', color: isDark ? '#ccc' : '#666' }}
                >
                  Already have an account?{' '}
                  <a href="/login" style={{ color: isDark ? '#0dcaf0' : '#0d6efd' }}>
                    Login here
                  </a>
                </p>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Register;
