import React from 'react';
import styles from './styles.module.css';

//Google Icon
import GoogleIcon from '../../assets/google_icon.svg';

//Firebase
import { auth, provider} from '../../configs/firebase-config.js';
import { signInWithPopup } from 'firebase/auth';

//Navigate
import { Navigate } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

//Cookies
import Cookies from 'universal-cookie';
const cookies = new Cookies();

const Auth = (props) => {
  const { setIsAuth } = props;

  const navigate = useNavigate();

  const signInWithGoogle = async () => {
    try {
      const response = await signInWithPopup(auth, provider);
      cookies.set("auth-token", response.user.refreshToken);
      setIsAuth(true);
    } catch(err) {
      console.error(err);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.auth}>
        <p className={styles.title}>Welcome!</p>
        <p className={styles.contentText}>Sign with Google to continue</p>
        <button className={styles.authBtn} onClick={() => signInWithGoogle()}><img src={GoogleIcon} alt="Google Icon" className={styles.googleIcon}/></button>
      </div>
    </div>
  );
}

export default Auth;