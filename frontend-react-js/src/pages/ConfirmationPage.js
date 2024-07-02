import './ConfirmationPage.css';
import React from "react";
import {useNavigate, useParams, useSearchParams} from 'react-router-dom';
import {ReactComponent as Logo} from '../components/svg/logo.svg';

import {confirmSignUp, resendSignUpCode, autoSignIn} from 'aws-amplify/auth';


export default function ConfirmationPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [email, setEmail] = React.useState(() => searchParams.get("email") || "");
  const [username, setUsername] = React.useState(() => searchParams.get("username") || "");
  const [code, setCode] = React.useState('');
  const [errors, setErrors] = React.useState('');
  const [codeSent, setCodeSent] = React.useState(false);



  const params = useParams();

  const code_onchange = (event) => {
    setCode(event.target.value);
  }

  const resend_code = async (event) => {
    try {
      setErrors("");
      const data = await resendSignUpCode({username});
      setCodeSent(true);
      console.log(data);
    } catch (error) {
      console.log(error);
      setErrors(error.message);
    }
  }

  const onsubmit = async (event) => {
    try {
      event.preventDefault();
      setErrors("");
      const { isSignUpComplete, nextStep } = await confirmSignUp({
        username: email,
        confirmationCode: code
      });
      if (nextStep.signUpStep === "COMPLETE_AUTO_SIGN_IN") {
        const data = await autoSignIn();
        if (data.isSignedIn && data.nextStep.signInStep === "DONE") {
          navigate("/");
        }
      }
    } catch (error) {
      console.log(error);
      setErrors(error.message);
    }
  }


  let code_button;
  if (codeSent){
    code_button = <div className="sent-message">A new activation code has been sent to the email: {email}</div>
  } else {
    code_button = <button className="resend" onClick={resend_code}>Resend Activation Code</button>;
  }


  return (
    <article className="confirm-article">
      <div className='recover-info'>
        <Logo className='logo' />
      </div>
      <div className='recover-wrapper'>
        <form
          className='confirm_form'
          onSubmit={onsubmit}
        >
          <h2>Confirm your Email</h2>
          <div style={{color: "white", textAlign: "center"}}>A confirmation code has been sent to your email at: {email}</div>
          <div className='fields'>
            <div className='field text_field code'>
              <label>Confirmation Code</label>
              <input
                type="text"
                value={code}
                onChange={code_onchange}
              />
            </div>
          </div>
          {errors && <div className="errors">{errors}</div>}
          <div className='submit'>
            <button type='submit'>Confirm Email</button>
          </div>
        </form>
      </div>
      {code_button}
    </article>
  );
}