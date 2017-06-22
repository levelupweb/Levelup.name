// Important
import React from 'react';
import cookies from 'js-cookie'
import { connect } from 'react-redux'

// Actions
import { getPostComments } from '../../../actions/comment.js'
import { setLikeById } from '../../../actions/post.js'

// Components
import TimeAgo from 'timeago-react';
import Loader from '../../isomorphic/loader.js'
import Note from './views/note.js'
import Blog from '../../isomorphic/blog.js'
import Link from 'next/link'
import User from '../../isomorphic/user.js'
import Default from './views/default.js'
import Blank from './views/blank.js'

class Item extends React.Component {
  constructor(props) {
    super(props);
    this.currentUser = this.props.currentUser;
  }

  render() {
    var post = this.props.article;
    if (post) { 
      switch(post.postType) {
        case 'note':
        return <Note post={post} />
        default:
        return <Default currentUser={this.currentUser} post={post} />
      }
    } else {
      return (<Blank />)
    }
  }
}


export default connect((store) => store)(Item)