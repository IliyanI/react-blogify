import remote from "../../helpers/remote";
const ALL_POSTS_ENDPOINT = "http://localhost:5000/post/all";
const USER_POSTS_ENDPOINT = "http://localhost:5000/user/data";

export default dispatch => {
  return {
    getPosts: () => {
      dispatch({
        type: "GET_POSTS",
        payload: new Promise((res, rej) => {
          remote
            .get(ALL_POSTS_ENDPOINT)
            .then(data => data.json())
            .then(posts => res(posts))
            .catch(err => rej(err));
        })
      });
    },
    getUserPosts: id => {
      dispatch({
        type: "GET_USER_POSTS",
        payload: new Promise((res, rej) => {
          remote
            .post(USER_POSTS_ENDPOINT, { id })
            .then(data => data.json())
            .then(data => res(data))
            .catch(err => rej(err));
        })
      });
    },
    sortPostsByDate: () => {
      dispatch({
        type: "SORT_POSTS_DATE"
      });
    },
    sortPostsByLikes: () => {
      dispatch({
        type: "SORT_POSTS_LIKES"
      });
    }
  };
};
