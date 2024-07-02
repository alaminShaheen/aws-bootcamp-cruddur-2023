import './SigninPage.css';
import React from "react";
import {ReactComponent as Logo} from '../components/svg/logo.svg';
import {Link, useNavigate} from "react-router-dom";

import {fetchAuthSession, signIn} from 'aws-amplify/auth'


export default function SigninPage() {

	const [email, setEmail] = React.useState('');
	const [password, setPassword] = React.useState('');
	const [errors, setErrors] = React.useState('');
	const navigate = useNavigate();

	const onsubmit = async (event) => {
		event.preventDefault();
		setErrors('');
		try {
			const userInfo = await signIn({
				username: email,
				password: password,
			})
			if (userInfo.isSignedIn && userInfo.nextStep.signInStep === "DONE") {
				const session = await fetchAuthSession();
				console.log(session);
				navigate('/');
			}
		} catch (error) {
			if (error.message) {
				setErrors(error.message);
			} else {
				setErrors("An unexpected error occurred");
			}
		}
	}

	const email_onchange = (event) => {
		setEmail(event.target.value);
	}
	const password_onchange = (event) => {
		setPassword(event.target.value);
	}

	return (
		<article className="signin-article">
			<div className='signin-info'>
				<Logo className='logo'/>
			</div>
			<div className='signin-wrapper'>
				<form
					className='signin_form'
					onSubmit={onsubmit}
				>
					<h2>Sign into your Cruddur account</h2>
					<div className='fields'>
						<div className='field text_field username'>
							<label>Email</label>
							<input
								type="text"
								value={email}
								onChange={email_onchange}
							/>
						</div>
						<div className='field text_field password'>
							<label>Password</label>
							<input
								type="password"
								value={password}
								onChange={password_onchange}
							/>
						</div>
					</div>
					{errors && <div className="errors">{errors}</div>}
					<div className='submit'>
						<Link to="/forgot" className="forgot-link">Forgot Password?</Link>
						<button type='submit'>Sign In</button>
					</div>

				</form>
				<div className="dont-have-an-account">
          <span>
            Don't have an account?
          </span>
					<Link to="/signup">Sign up!</Link>
				</div>
			</div>

		</article>
	);
}