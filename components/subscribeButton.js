import React from 'react';
import { connect } from 'react-redux';
import { subscribeToEntry } from '../actions/app'
import cookies from 'js-cookie'

// This.props.entryID = Id пользователя, на которого оформляется подписка
// This.token = токен активного пользователя
// This.props.user.profile = Профиль активного пользователя

class SubscribeButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    	isSubscribed: false
    }
    this.token = cookies.get('x-access-token');
    this.currentUser = this.props.user.profile;
  }

  componentWillMount() {
    if(this.isSubscribed(this.props.entryID, this.props.entryType)) {
      this.set(true)
    } else {
      this.set(false)
    }
  }

  componentWillReceiveProps(nextProps) {
    if(this.isSubscribed(nextProps.entryID, nextProps.entryType)) {
      this.set(true)
    } else {
      this.set(false)
    }
  }

  isSubscribed(entryID, entryType) {
    if(this.currentUser) {
      if(this.currentUser.userSubscriptions[entryType + 's'].indexOf(entryID) != -1) {
        return true
      } else {
        return false
      }
    }
  }

  set(value) {
    this.setState({isSubscribed: value})
  }

  handleSubscription(token, entryType, entryID) {
    subscribeToEntry(token, entryType, entryID).then((res) => {
      console.log(res.data)
      this.set(!this.state.isSubscribed)
    })
  }

  render() {
  	if(!this.state.isSubscribed) {
  		return (
  			<a onClick={() => {this.handleSubscription(this.token, this.props.entryType, this.props.entryID)}} className={`button circular ui primary ${this.props.additionalClasses}`}>
		        {(this.props.subscribeText) ? this.props.subscribeText : 'Подписаться на автора'}
		    </a>	
      	)
  	} else {
	    return (
			<a onClick={() => {this.handleSubscription(this.token, this.props.entryType, this.props.entryID)}} className={`button circular ui ${this.props.additionalClasses}`}>
				    {(this.props.unsubscribeText) ? this.props.unsubscribeText : 'Отписаться от автора'}
			</a>	
	    )
	}
  }
}

export default connect((store) => store)(SubscribeButton)

