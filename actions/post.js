import axios from 'axios'
import config from '../app.config.js'
import cookies from 'js-cookie'
import randomString from '../utils/randomString.js'
import hash from 'object-hash'

// actions
import { handleWarn, handleError, handleSuccess } from './app.js'

// models
import * as MODEL from '../models/post.js'

// Common actions
export function findPost(query) {   
   return MODEL.findPost(query)
}

export function getUserPosts(id) {
	return MODEL.getUserPosts(id)
}

export function setLike(token, id) {
   return MODEL.setLike(token, id)
}

export function getRandomAdv(id) {
   return MODEL.getRandomAdv(id)
}

export function updatePost(token, id, post) {
   return MODEL.updatePost(token, id, post)
}

export function setPostField(field, value) {
	return (dispatch) => {
		return new Promise((resolve) => {
			dispatch({
				type: 'SET_POST_FIELD', 
				payload: { field, value }
			})
			resolve()
		})
	}
}

export function setPost(post) {
	return (dispatch) => {
		dispatch({
			type: 'SET_POST', 
			payload: post
		})
	}
}

export function prepareNewPost(type) {
	return (dispatch) => {
	  return Promise.all([
	   	dispatch(setPostField('type', type)),
      dispatch(setPostField('status', 'draft'))
    ])
	}
}

export function pushTag(tag) {
	return (dispatch) => {
		if(tag.length > 0) {
			dispatch({
				type: 'POST_PUSH_TAG', 
				payload: tag
			})
		}
	}
}

export function pullTag(tag) {
	return (dispatch) => {
		dispatch({
			type: 'POST_PULL_TAG', 
			payload: tag
		})
	}
}

export function createPost(token, defaultPost) {
	return (dispatch) => {
		var post = {
			...defaultPost,
			title: defaultPost.title || 'Безымянный' 
		}
		return MODEL.createPost(token, post).then((res) => {
			if(res.data.success) {
	   		dispatch(setPost(res.data.post))
	   		return res.data.post._id;
	   	} else {
	   		dispatch(handleWarn(
					'Ошибка при создании поста', true
				));
	   	}
	   }).then((id) => {
	   	dispatch(handleWarn(
				'Сохранено в черновиках', true
			));
	   	return id
	   })
	}
}

// TODO: return data 
export function savePost(token, post, message) {
	return (dispatch) => {
		return MODEL.updatePost(token, post._id, post).then((res) => {
	   	if(res.data.success) {
	   		dispatch(setPost(post))
	   	} else {
	   		dispatch(handleError(
					'Ошибка при сохранении поста', true
				));
	   	}
	   	return res.data
	   }).then(() => {
	   	dispatch(handleWarn(
				message || 'Сохранено', true
			));
	   })
	}
}

// PostsStorage Actions
export function fetchPosts(key, defaultOptions, skip) {
	const options = {
		...defaultOptions,
		perPage: defaultOptions.perPage || 10
	}
	return (dispatch, getState) => {
		var state = getState()
		if (state.postsStorage[key]) {
			if (!state.postsStorage[key].isHydrating && !state.postsStorage[key].isFull) {
				dispatch(fetchPostsStart(key, options))
				return MODEL.fetchPosts(options, skip).then((res) => {
			   	dispatch(fetchPostsEnd(key, res.data))
			   })
			}
		} else {
			dispatch(handleError(
				'Инстанция не найдена', true
			));
		}
	}
}

export function createPostsInstance(key, options, initialPosts) {
	return {
		type: 'CREATE_POSTS_INSTANCE',
		payload: { key, options, initialPosts }
	}
}


export function pushPost(token, key, post) {
	var postFinal = {
		...post,
		status: 'published'
	}
	return (dispatch) => {
		dispatch(pushPostStart(key))
		return MODEL.createPost(token, postFinal).then((response) => {
			if(response.data.success) {
				dispatch(pushPostEnd(key, response.data.post))
				dispatch(handleSuccess(
					'Пост успешно добавлен', true
				));
			} else {
				dispatch(handleError(
					'Ошибка при добавлении поста', true
				));
			}
			return response;
		})
	}
}

function pushPostStart(key) {
	return {
		type: 'PUSH_POST_START',
		payload: {
			key
		}
	}
}

function pushPostEnd(key, post) {
	return {
		type: 'PUSH_POST_END',
		payload: {
			key, post
		}
	}
}

export function removePost(token, key, id) {
	return (dispatch) => {
		dispatch(removePostStart(key))
		return MODEL.removePost(token, id).then((res) => {
			if(res.data.success) {
				dispatch(removePostEnd(key, id))
				dispatch(handleSuccess(
					'Пост успешно удалён', true
				));
			} else {
				dispatch(handleError(
					'Ошибка при удалении поста', true
				));
			}
		})
	}
}

function removePostStart(key) {
	return { 
		type: 'REMOVE_POST_START',
		payload: {
			isRemoving: true,
			key
		}
	}
}

function removePostEnd(key, id) {
	return { 
		type: 'REMOVE_POST_END',
		payload: {
			key, id
		}
	}
}

function fetchPostsStart(key, options) {
	return {
		type: 'FETCH_POSTS_START',
		payload: {
			key, options
		}
	}
}

function fetchPostsEnd(key, posts) {
	return {
		type: 'FETCH_POSTS_END',
		payload: {
			key, posts
		}
	}
}

// DEPRICATED METHODS
// DANGER ZONE

// TODO: rewrite
export function getPosts(defaultOptions, skip) {
	var options = {
		...defaultOptions,
		perPage: defaultOptions.perPage || 10,
		skip: skip
	}
	return axiosNoAuth({
		url: 'post/entries',
		method: 'GET',
		params: options
   })
}