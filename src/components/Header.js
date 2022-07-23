function Header({ logo, userData, loggedIn }) {

  console.log(userData);

  return (
    <header className="header">
      <img src={logo} alt="логотип" className="header__logo"/>
      {loggedIn && <p className="header__email">{userData.email}</p>}
      {loggedIn && <button className="header__btn">Выйти</button>}
    </header>
  );

}

export default Header;
