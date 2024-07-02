import './HomeFeedPage.css';
import React from "react";
import {getCurrentUser, fetchUserAttributes, fetchAuthSession} from 'aws-amplify/auth';


import DesktopNavigation from '../components/DesktopNavigation';
import DesktopSidebar from '../components/DesktopSidebar';
import ActivityFeed from '../components/ActivityFeed';
import ActivityForm from '../components/ActivityForm';
import ReplyForm from '../components/ReplyForm';

export default function HomeFeedPage() {
	const [activities, setActivities] = React.useState([]);
	const [popped, setPopped] = React.useState(false);
	const [poppedReply, setPoppedReply] = React.useState(false);
	const [replyActivity, setReplyActivity] = React.useState({});
	const [user, setUser] = React.useState(null);
	const dataFetchedRef = React.useRef(false);

	const loadData = async () => {
		try {
			const sessionData = await fetchAuthSession();
			console.log(sessionData.tokens.accessToken.toString());
			const backend_url = `${process.env.REACT_APP_BACKEND_URL}/api/activities/home`
			const res = await fetch(backend_url, {
				method: "GET",
				headers: {
					Authorization: `Bearer ${sessionData.tokens.accessToken.toString()}`,
				}
			});
			let resJson = await res.json();
			if (res.status === 200) {
				setActivities(resJson)
			} else {
				console.log(res)
			}
		} catch (err) {
			console.log(err);
		}
	};

	// check if we are authenticated
	const checkAuth = async () => {
		try {
			const user = await getCurrentUser({bypassCache: true});
			if (user) {
				const userAttributes = await fetchUserAttributes();
				setUser({
					display_name: userAttributes.name,
					handle: userAttributes.preferred_username
				})
			}
		} catch (e) {
			console.log(e);
		}
	};

	React.useEffect(() => {
		//prevents double call
		if (dataFetchedRef.current) return;
		dataFetchedRef.current = true;

		loadData();
		checkAuth();
	}, [])

	return (
		<article>
			<DesktopNavigation user={user} active={'home'} setPopped={setPopped}/>
			<div className='content'>
				<ActivityForm
					popped={popped}
					setPopped={setPopped}
					setActivities={setActivities}
				/>
				<ReplyForm
					activity={replyActivity}
					popped={poppedReply}
					setPopped={setPoppedReply}
					setActivities={setActivities}
					activities={activities}
				/>
				<ActivityFeed
					title="Home"
					setReplyActivity={setReplyActivity}
					setPopped={setPoppedReply}
					activities={activities}
				/>
			</div>
			<DesktopSidebar user={user}/>
		</article>
	);
}