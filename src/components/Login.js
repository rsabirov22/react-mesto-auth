import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import * as mestoAuth from '../mestoAuth.js';

function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // const [message, setMessage] = useState('');
  const history = useHistory();
  const resetForm = () => {
    setEmail('');
    setPassword('');
    // setMessage('');
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    onLogin({ password, email })
    .then(() => history.push('/'))
    .then(() => resetForm());
  }

  return (
    <div className="auth">
      <p className="auth__title">
        Вход
      </p>
      <form onSubmit={handleSubmit} className="auth__form">
        <input
          id="email"
          required
          name="email"
          type="email"
          className="auth__input"
          placeholder="Email"
          value={email}
          onChange={({ target }) => setEmail(target.value)}
        />
        <input
          id="password"
          required
          name="password"
          type="password"
          className="auth__input"
          placeholder="Пароль"
          value={password}
          onChange={({ target }) => setPassword(target.value)}
        />
        <button type="submit" className="auth__btn">Войти</button>
      </form>
    </div>
  );

}

export default Login;