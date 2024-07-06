import './ActivityContent.css';

import { Link } from "react-router-dom";
import { DateTime } from 'luxon';
import {ReactComponent as BombIcon} from './svg/bomb.svg';

export default function ActivityContent(props) {
  const format_time_created_at = (value) => {
    // format: 2050-11-20 18:32:47 +0000
    const past = DateTime.fromISO(value)
    const now     = DateTime.now()
    const diff_mins = now.diff(past, 'minutes').toObject().minutes;
    const diff_hours = now.diff(past, 'hours').toObject().hours;

    if (diff_hours > 24.0){
      return past.toFormat("LLL L");
    } else if (diff_hours < 24.0 && diff_hours > 1.0) {
      return `${Math.floor(diff_hours)}h ago`;
    } else if (diff_hours < 1.0) {
      return `${Math.round(diff_mins)}m ago`;
    }
  };

  const format_time_expires_at = (value) => {
    let future;

    // Try to parse as ISO 8601 first
    if (DateTime.fromISO(value).isValid) {
        future = DateTime.fromISO(value);
    } else if (DateTime.fromHTTP(value).isValid) { // Then try to parse as HTTP-date
        future = DateTime.fromHTTP(value);
    } else {
        throw new Error("Invalid date format");
    }

    const now = DateTime.now();
    const diff = future.diff(now, ['days', 'hours', 'minutes']).toObject();

    const diff_days = diff.days;
    const diff_hours = diff.hours;
    const diff_minutes = diff.minutes;

    if (diff_days >= 1.0) {
        return `${Math.floor(diff_days)}d`;
    } else if (diff_hours >= 1.0) {
        return `${Math.floor(diff_hours)}h`;
    } else {
        return `${Math.round(diff_minutes)}m`;
    }
};

  // const format_time_expires_at = (value) => {
  //   // format: 2050-11-20 18:32:47 +0000
  //   const future = DateTime.fromISO(value)
  //   const now     = DateTime.now()
  //   const diff_mins = future.diff(now, 'minutes').toObject().minutes;
  //   const diff_hours = future.diff(now, 'hours').toObject().hours;
  //   const diff_days = future.diff(now, 'days').toObject().days;
  //
  //   if (diff_hours > 24.0){
  //     return `${Math.floor(diff_days)}d`;
  //   } else if (diff_hours < 24.0 && diff_hours > 1.0) {
  //     return `${Math.floor(diff_hours)}h`;
  //   } else if (diff_hours < 1.0) {
  //     return `${Math.round(diff_mins)}m`;
  //   }
  // };

  let expires_at;
  if (props.activity.expires_at) {
    expires_at =  <div className="expires_at" title={props.activity.expires_at}>
                    <BombIcon className='icon' />
                    <span className='ago'>{format_time_expires_at(props.activity.expires_at)}</span>
                  </div>

  }

  return (
    <div className='activity_content_wrap'>
      <div className='activity_avatar'></div>
      <div className='activity_content'>
        <div className='activity_meta'>
          <Link className='activity_identity' to={`/@`+props.activity.handle}>
            <div className='display_name'>{props.activity.display_name}</div>
            <div className="handle">@{props.activity.handle}</div>
          </Link>{/* activity_identity */}
          <div className='activity_times'>
            <div className="created_at" title={props.activity.created_at}>
              <span className='ago'>{format_time_created_at(props.activity.created_at)}</span> 
            </div>
            {expires_at}
          </div>{/* activity_times */}
        </div>{/* activity_meta */}
        <div className="message">{props.activity.message}</div>
      </div>{/* activity_content */}
    </div>
  );
}