import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import * as mestoAuth from '../mestoAuth.js';

function Register({ onRegister }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const history = useHistory();

  const handleSubmit = (e) => {
    e.preventDefault();

    onRegister({ password, email })
    .then(() => history.push('/sign-in'))
      // .catch((err) => setMessage(err.message || 'некорректно заполнено одно из полей'));
  }

  return (
    <div className="auth">
      <p className="auth__title">
        Регистрация
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
        <button type="submit" className="auth__btn">Зарегистрироваться</button>
      </form>
      <div className="auth__signup">
        <p className="auth__phrase">Уже зарегистрированы?</p>
        <Link to="/sign-in" className="auth__link">Войти</Link>
      </div>
    </div>
  );

}

export default Register;
