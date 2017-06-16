import React from 'react';
import { getAllUsers } from '../../../actions/user.js'
import Loader from '../../loader.js'
import TimeAgo from 'timeago-react';
import SubscribeButton from '../../subscribeButton.js'
import Avatar from 'react-avatar'
import Link from 'next/link'
import { connect } from 'react-redux'
import BlogList from '../../blogList.js'

// Clever Component. Accepts nothing and retrieving all users from DB

class Blogs extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    	entries: [],
    	isLoaded: false
    }
  }

  componentWillMount() {
    console.log(this.props)
  	this.setState({
      entries: this.state.entries.concat(this.props.app.pageData.blog)
    })
  }

  componentDidMount() {
  	this.setState({
  		isLoaded: true
  	})
  }

  render() {
    	if(this.state.isLoaded) {
  	    return (
  	      <div className="ui three column grid">
            <BlogList blogs={this.state.entries} size="block" />
          </div>
  	    )
  	  } else {
    		return (<Loader />)
    	}
    }
}

export default connect((store) => store)(Blogs)