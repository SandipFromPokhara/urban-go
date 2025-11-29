import useLogin from "../../hooks/useLogin";
import useField from "../../hooks/useField";
import "./Login.css";

const Login = () => {
  const emailField = useField("email");
  const passwordField = useField("password");

  const { error, loading, handleLogin } = useLogin(
    emailField.value,
    passwordField.value
  );

  return (
    <div className="container">
      <div className="header">
        <div className="text">Login</div>
        <div className="underline"></div>
      </div>

      <div className="inputs">
        <div className="input">
          <input 
            {...emailField}
            name="email"
            placeholder="Email"
          />
        </div>

        <div className="input">
          <input 
            {...passwordField}
            name="password"
            placeholder="Password"
          />
        </div>

        <div className="forgot-password">
          Forgot Password? <span>Click Here!</span>
        </div>

        {error && <div className="error-text">{error}</div>}

        <div className="submit-container">
          <div 
            className="submit" 
            onClick={handleLogin}
            style={{ opacity: loading ? 0.6 : 1, cursor: loading ? "not-allowed" : "pointer" }}
          >
            {loading ? "Logging in..." : "Login"}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
