import React from 'react';
import { CurrentUserContext } from '../contexts/CurrentUserContext';
import { Route, Switch, Redirect, useHistory } from 'react-router-dom';
import Header from './Header';
import Main from './Main';
import Footer from './Footer';
import logo from '../images/logo.svg';
import ImagePopup from './ImagePopup';
import api from '../utils/api.js';
import EditProfilePopup from './EditProfilePopup';
import EditAvatarPopup from './EditAvatarPopup';
import AddPlacePopup from './AddPlacePopup';
import Login from './Login';
import Register from './Register';
import ProtectedRoute from './ProtectedRoute';
import * as mestoAuth from '../mestoAuth.js';

function App() {
  const [cards, setCards] = React.useState([]);
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = React.useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = React.useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = React.useState(false);
  const [selectedCard, setSelectedCard] = React.useState({});
  const [currentUser, setCurrentUser] = React.useState({});
  const [userData, setUserData] = React.useState({});
  const [loggedIn, setLoggedIn] = React.useState(false);
  const history = useHistory();


  // console.log(userData)

  // const auth = async (jwt) => {
  //   const content = await mestoAuth.getContent(jwt).then((res) => {
  //     if (res) {
  //       const { email, username } = res;
  //       setLoggedIn(true);
  //       setUserData({
  //         username,
  //         email
  //       })
  //     }
  //   })
  //   return content;
  // }

  function handleEditAvatarClick() {
    setIsEditAvatarPopupOpen(true);
  };

  function handleEditProfileClick() {
    setIsEditProfilePopupOpen(true);
  };

  function handleAddPlaceClick() {
    setIsAddPlacePopupOpen(true);
  };

  function handleCardClick(card) {
    setSelectedCard(card)
  }

  function closeAllPopups() {
    setIsEditProfilePopupOpen(false);
    setIsEditAvatarPopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setSelectedCard({})
  }

  function handleAddPlaceSubmit(newCard) {
    api.postCard(newCard)
      .then((data) => {
        setCards([data, ...cards]);
        closeAllPopups();
      })
      .catch(err => console.log(err));
  }

  function handleUpdateUser(userInfo) {
    api.patchProfile(userInfo)
      .then((data) => {
        setCurrentUser(data);
        closeAllPopups();
      })
      .catch(err => console.log(err));
  }

  function handleUpdateAvatar(avatarLink) {
    api.patchAvatar(avatarLink)
      .then((data) => {
        setCurrentUser(data);
        closeAllPopups();
      })
      .catch(err => console.log(err));
  }

  function handleCardLike(card) {
    const isLiked = card.likes.some(i => i._id === currentUser._id);

    api.changeLikeCardStatus(card._id, !isLiked)
      .then((newCard) => {
          setCards((state) => state.map((c) => c._id === card._id ? newCard : c));
      })
      .catch(err => console.log(err));
  }

  function handleCardDelete(card) {
    api.deleteCard(card._id)
      .then(() => {
        setCards((state) => state.filter((c) => c._id !== card._id));
      })
      .catch(err => console.log(err));
  }

  React.useEffect(() => {
    // Загрузка информации о пользователе
    api.getProfile()
      .then((data) => {
        setCurrentUser(data)
      })
      .catch(err => console.log(err));
    // Загрузка информации о пользователе
  }, []);

  React.useEffect(() => {
    // Загрузка карточек
    api.getInitialCards()
      .then((data) => {
        setCards(data)
      })
      .catch(err => console.log(err));
    // Загрузка карточек
  }, []);

  React.useEffect(() => {
    tokenCheck();
    // const jwt = localStorage.getItem('jwt');
    // if (jwt) {
    //   auth(jwt);
    // }
  }, [loggedIn]);

  React.useEffect(() => {
    if (loggedIn) {
      history.push('/main');
    }
  }, [loggedIn])

  const onRegister = ({ password, email }) => {
    return mestoAuth.register(password, email).then((res) => {
      if (!res || res.statusCode === 400) throw new Error('некорректно заполнено одно из полей');
      return res;
    });
  }

  const handleLogin = () => {
    setLoggedIn(true);
  }

  const tokenCheck = () => {
    const jwt = localStorage.getItem('jwt');

    if (jwt) {
      mestoAuth.getContent(jwt)
      .then((res) => {
        if (res) {
          const { email, id } = res;

          setLoggedIn(true);
          setUserData({
            email,
            id
          });
          history.push('/main');
        }
      })
    }
  }

  // const onLogin = ({ password, email }) => {
  //   return mestoAuth.authorize(password, email)
  //     .then((data) => {
  //       if (data.token) {
  //         localStorage.setItem('jwt', data.token);
  //         setLoggedIn(true);
  //       }
  //     });
  // }

  return (
    <div className="page">
      <div className="page__container">
        <CurrentUserContext.Provider value={currentUser}>
            <Header logo={logo} userData={userData} loggedIn={loggedIn}/>
            <Switch>
              <ProtectedRoute
                exact
                path="/main"
                component={Main}
                cards={cards}
                onCardLike={handleCardLike}
                onCardDelete={handleCardDelete}
                onEditProfile={handleEditProfileClick}
                onAddPlace ={handleAddPlaceClick}
                onEditAvatar={handleEditAvatarClick}
                onCardClick={handleCardClick}
                loggedIn={loggedIn}
                />
              <Route path="/sign-in">
                <div className="loginContainer">
                  <Login handleLogin={handleLogin} />
                </div>
              </Route>
              <Route path="/sign-up">
                <div className="registerContainer">
                  <Register onRegister={onRegister} />
                </div>
              </Route>
              <Route>
                {loggedIn ? <Redirect to="/main" /> : <Redirect to="/sign-in" />}
              </Route>
            </Switch>
            <EditProfilePopup isOpen={isEditProfilePopupOpen} onClose={closeAllPopups} onUpdateUser={handleUpdateUser}/>
            <EditAvatarPopup isOpen={isEditAvatarPopupOpen} onClose={closeAllPopups} onUpdateAvatar={handleUpdateAvatar}/>
            <AddPlacePopup isOpen={isAddPlacePopupOpen} onClose={closeAllPopups} onAddPlace={handleAddPlaceSubmit} />
            <ImagePopup card={selectedCard} onClose={closeAllPopups}/>
            <Footer/>
        </CurrentUserContext.Provider>
      </div>
    </div>
  );
}

export default App;
