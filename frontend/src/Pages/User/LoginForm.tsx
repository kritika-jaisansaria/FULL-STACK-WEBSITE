import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API = 'http://localhost:8080/api/auth';

// ---------- Theme (matches site's gold / maroon jewellery theme) ----------
const colors = {
  maroon: '#3e0f0f',
  gold: '#b8860b',
  goldLight: '#f5f5f5',
  gray: '#494F55',
  border: '#ddd',
  danger: '#c0392b',
};

type View = 'login' | 'signup' | 'signup-otp' | 'login-otp' | 'forgot' | 'reset';

const LoginForm = () => {
  const navigate = useNavigate();

  const [view, setView] = useState<View>('login');

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [otp, setOtp] = useState('');

  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(0);

  // Resend-OTP countdown
  useEffect(() => {
    if (timer <= 0) return;
    const interval = setInterval(() => setTimer((t) => t - 1), 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const resetMessages = () => {
    setError('');
    setInfo('');
  };

  const startTimer = () => setTimer(60);

  const closeModal = () => navigate(-1);

  const goTo = (v: View) => {
    resetMessages();
    setOtp('');
    setView(v);
  };

  const finishLogin = (data: any) => {
    localStorage.setItem('userInfo', JSON.stringify(data));
    localStorage.setItem('token', data.token);
    window.location.href = '/';
  };

  /* ---------------- Handlers ---------------- */

  const handleRegister = async () => {
    resetMessages();
    if (!name || !email || !password) return setError('Please fill in all fields');
    if (password.length < 6) return setError('Password must be at least 6 characters');

    setLoading(true);
    try {
      await axios.post(`${API}/register`, { name, email, password });
      setInfo('OTP sent to your email');
      startTimer();
      setView('signup-otp');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to sign up. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifySignupOtp = async () => {
    resetMessages();
    if (!otp) return setError('Please enter the OTP');

    setLoading(true);
    try {
      const res = await axios.post(`${API}/verify-signup-otp`, { email, otp });
      finishLogin(res.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid or expired OTP');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordLogin = async () => {
    resetMessages();
    if (!email || !password) return setError('Please enter email and password');

    setLoading(true);
    try {
      const res = await axios.post(`${API}/login`, { email, password });
      finishLogin(res.data);
    } catch (err: any) {
      if (err.response?.status === 403) {
        setError('Please verify your email first');
        setInfo('Sending a new verification OTP...');
        try {
          await axios.post(`${API}/resend-otp`, { email, purpose: 'signup' });
          startTimer();
          setView('signup-otp');
          setInfo('OTP sent to your email');
        } catch {
          setInfo('');
        }
      } else {
        setError(err.response?.data?.message || 'Invalid email or password');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSendLoginOtp = async () => {
    resetMessages();
    if (!email) return setError('Please enter your email');

    setLoading(true);
    try {
      await axios.post(`${API}/send-login-otp`, { email });
      setInfo('OTP sent to your email');
      startTimer();
      setView('login-otp');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyLoginOtp = async () => {
    resetMessages();
    if (!otp) return setError('Please enter the OTP');

    setLoading(true);
    try {
      const res = await axios.post(`${API}/login-otp`, { email, otp });
      finishLogin(res.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid or expired OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    resetMessages();
    if (!email) return setError('Please enter your email');

    setLoading(true);
    try {
      await axios.post(`${API}/forgot-password`, { email });
      setInfo('OTP sent to your email');
      startTimer();
      setView('reset');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    resetMessages();
    if (!otp) return setError('Please enter the OTP');
    if (!newPassword || newPassword.length < 6) {
      return setError('Password must be at least 6 characters');
    }

    setLoading(true);
    try {
      await axios.post(`${API}/reset-password`, { email, otp, newPassword });
      setInfo('Password reset! Please log in.');
      setPassword('');
      setNewPassword('');
      setOtp('');
      setView('login');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid or expired OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async (purpose: 'signup' | 'login' | 'reset') => {
    resetMessages();
    setLoading(true);
    try {
      await axios.post(`${API}/resend-otp`, { email, purpose });
      setInfo('OTP resent to your email');
      startTimer();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to resend OTP');
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- Styles ---------------- */

  const overlayStyle: React.CSSProperties = {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.55)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
    fontFamily: "'Inter', sans-serif",
  };

  const cardStyle: React.CSSProperties = {
    background: '#fff',
    width: 420,
    maxWidth: '90vw',
    borderRadius: 10,
    overflow: 'hidden',
    boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
  };

  const headerStyle: React.CSSProperties = {
    background: colors.maroon,
    padding: '22px 28px',
    textAlign: 'center',
  };

  const bodyStyle: React.CSSProperties = {
    padding: '28px 28px 32px',
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '12px 14px',
    marginBottom: 14,
    border: `1px solid ${colors.border}`,
    borderRadius: 6,
    fontSize: 14,
    outline: 'none',
    boxSizing: 'border-box',
  };

  const primaryBtnStyle: React.CSSProperties = {
    width: '100%',
    padding: '12px 14px',
    background: colors.gold,
    color: '#fff',
    border: 'none',
    borderRadius: 6,
    fontSize: 15,
    fontWeight: 600,
    cursor: loading ? 'not-allowed' : 'pointer',
    opacity: loading ? 0.7 : 1,
    letterSpacing: 0.3,
  };

  const linkStyle: React.CSSProperties = {
    color: colors.gold,
    cursor: 'pointer',
    fontWeight: 600,
  };

  const smallTextStyle: React.CSSProperties = {
    fontSize: 13,
    color: colors.gray,
    textAlign: 'center',
    marginTop: 14,
  };

  const errorStyle: React.CSSProperties = {
    color: colors.danger,
    fontSize: 13,
    marginBottom: 12,
    textAlign: 'center',
  };

  const infoStyle: React.CSSProperties = {
    color: colors.gold,
    fontSize: 13,
    marginBottom: 12,
    textAlign: 'center',
  };

  const titles: Record<View, string> = {
    login: 'Welcome Back',
    signup: 'Create Your Account',
    'signup-otp': 'Verify Your Email',
    'login-otp': 'Login with OTP',
    forgot: 'Forgot Password',
    reset: 'Reset Password',
  };

  return (
    <div style={overlayStyle} onClick={closeModal}>
      <div style={cardStyle} onClick={(e) => e.stopPropagation()}>
        <div style={headerStyle}>
          <h2 style={{ color: colors.gold, margin: 0, fontSize: 20, letterSpacing: 1 }}>
            {titles[view]}
          </h2>
        </div>

        <div style={bodyStyle}>
          {error && <p style={errorStyle}>{error}</p>}
          {info && !error && <p style={infoStyle}>{info}</p>}

          {/* -------- LOGIN -------- */}
          {view === 'login' && (
            <>
              <input
                style={inputStyle}
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                style={inputStyle}
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handlePasswordLogin()}
              />
              <button style={primaryBtnStyle} onClick={handlePasswordLogin} disabled={loading}>
                {loading ? 'Please wait...' : 'Login'}
              </button>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 14 }}>
                <span style={linkStyle} onClick={handleSendLoginOtp}>
                  Login with OTP
                </span>
                <span style={linkStyle} onClick={() => goTo('forgot')}>
                  Forgot password?
                </span>
              </div>

              <p style={smallTextStyle}>
                New here?{' '}
                <span style={linkStyle} onClick={() => goTo('signup')}>
                  Create an account
                </span>
              </p>
            </>
          )}

          {/* -------- SIGNUP -------- */}
          {view === 'signup' && (
            <>
              <input
                style={inputStyle}
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <input
                style={inputStyle}
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                style={inputStyle}
                type="password"
                placeholder="Create Password (min. 6 characters)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleRegister()}
              />
              <button style={primaryBtnStyle} onClick={handleRegister} disabled={loading}>
                {loading ? 'Please wait...' : 'Sign Up'}
              </button>

              <p style={smallTextStyle}>
                Already have an account?{' '}
                <span style={linkStyle} onClick={() => goTo('login')}>
                  Log in
                </span>
              </p>
            </>
          )}

          {/* -------- SIGNUP OTP VERIFY -------- */}
          {view === 'signup-otp' && (
            <>
              <p style={{ fontSize: 13, color: colors.gray, marginBottom: 14, textAlign: 'center' }}>
                Enter the 6-digit code sent to <b>{email}</b>
              </p>
              <input
                style={{ ...inputStyle, textAlign: 'center', letterSpacing: 4, fontSize: 18 }}
                placeholder="------"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                onKeyDown={(e) => e.key === 'Enter' && handleVerifySignupOtp()}
              />
              <button style={primaryBtnStyle} onClick={handleVerifySignupOtp} disabled={loading}>
                {loading ? 'Please wait...' : 'Verify & Continue'}
              </button>

              <p style={smallTextStyle}>
                {timer > 0 ? (
                  <>Resend code in {timer}s</>
                ) : (
                  <span style={linkStyle} onClick={() => handleResend('signup')}>
                    Resend OTP
                  </span>
                )}
              </p>
              <p style={smallTextStyle}>
                <span style={linkStyle} onClick={() => goTo('signup')}>
                  ← Back
                </span>
              </p>
            </>
          )}

          {/* -------- LOGIN OTP -------- */}
          {view === 'login-otp' && (
            <>
              <p style={{ fontSize: 13, color: colors.gray, marginBottom: 14, textAlign: 'center' }}>
                Enter the 6-digit code sent to <b>{email}</b>
              </p>
              <input
                style={{ ...inputStyle, textAlign: 'center', letterSpacing: 4, fontSize: 18 }}
                placeholder="------"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                onKeyDown={(e) => e.key === 'Enter' && handleVerifyLoginOtp()}
              />
              <button style={primaryBtnStyle} onClick={handleVerifyLoginOtp} disabled={loading}>
                {loading ? 'Please wait...' : 'Verify & Login'}
              </button>

              <p style={smallTextStyle}>
                {timer > 0 ? (
                  <>Resend code in {timer}s</>
                ) : (
                  <span style={linkStyle} onClick={() => handleResend('login')}>
                    Resend OTP
                  </span>
                )}
              </p>
              <p style={smallTextStyle}>
                <span style={linkStyle} onClick={() => goTo('login')}>
                  ← Back to login
                </span>
              </p>
            </>
          )}

          {/* -------- FORGOT PASSWORD -------- */}
          {view === 'forgot' && (
            <>
              <p style={{ fontSize: 13, color: colors.gray, marginBottom: 14, textAlign: 'center' }}>
                Enter your email and we'll send you a code to reset your password.
              </p>
              <input
                style={inputStyle}
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleForgotPassword()}
              />
              <button style={primaryBtnStyle} onClick={handleForgotPassword} disabled={loading}>
                {loading ? 'Please wait...' : 'Send OTP'}
              </button>

              <p style={smallTextStyle}>
                <span style={linkStyle} onClick={() => goTo('login')}>
                  ← Back to login
                </span>
              </p>
            </>
          )}

          {/* -------- RESET PASSWORD -------- */}
          {view === 'reset' && (
            <>
              <p style={{ fontSize: 13, color: colors.gray, marginBottom: 14, textAlign: 'center' }}>
                Enter the code sent to <b>{email}</b> and choose a new password.
              </p>
              <input
                style={{ ...inputStyle, textAlign: 'center', letterSpacing: 4, fontSize: 18 }}
                placeholder="------"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
              />
              <input
                style={inputStyle}
                type="password"
                placeholder="New Password (min. 6 characters)"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleResetPassword()}
              />
              <button style={primaryBtnStyle} onClick={handleResetPassword} disabled={loading}>
                {loading ? 'Please wait...' : 'Reset Password'}
              </button>

              <p style={smallTextStyle}>
                {timer > 0 ? (
                  <>Resend code in {timer}s</>
                ) : (
                  <span style={linkStyle} onClick={() => handleResend('reset')}>
                    Resend OTP
                  </span>
                )}
              </p>
              <p style={smallTextStyle}>
                <span style={linkStyle} onClick={() => goTo('login')}>
                  ← Back to login
                </span>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
