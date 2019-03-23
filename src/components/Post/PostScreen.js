import React, { Component, Fragment } from "react";
import CommentArea from "../user-components/CommentArea";
import remote from "../../helpers/remote";
import { Redirect, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import notificationActions from "../../redux/actions/notificationActions";
import serverEndpoints from "../../helpers/serverEndpoints";
import Loading from "../Loading";
import "./PostScreen.css";

class PostScreen extends Component {
  state = {
    redirect: false,
    route: "",
    loading: false,
    post: {},
    test: ""
  };

  componentDidMount() {
    remote
      .get(serverEndpoints.POST_GET + this.props.match.params.id)
      .then(data => data.json())
      .then(data => {
        this.setState({
          loading: false,
          post: {
            ...data,
            content: decodeURI(data.content)
          }
        });
      });
  }

  handleLike = e => {
    e.preventDefault();
    const likes = this.state.post.likes + 1;
    this.setState({ post: { ...this.state.post, likes: likes } });
    remote.post(serverEndpoints.POST_LIKE + this.state.post._id);
  };

  handleDelete = () => {
    remote
      .delete(serverEndpoints.POST_DELETE + this.state.post._id)
      .then(data => data.json())
      .then(data => {
        if (data.success) {
          this.props.notifySuccess(data.message);
          this.setState({ redirect: true, route: "/" });
        } else {
          this.props.notifyError(data.message);  
        }
      });
  };

  handleEdit = () => {
    this.setState({
      redirect: true,
      route: "/post/edit/" + this.state.post._id
    });
  };

  isAuthor = () => {
    if (sessionStorage.getItem("username") === this.state.post.author)
      return true;
    return false;
  };

  handleComment = () => {
    this.setState({ redirect: true, route: this.props.location.path });
  };

  render() {
    const {
      title,
      description,
      author,
      content,
      readTime,
      likes,
      _id,
      comments
    } = this.state.post;

    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec"
    ];

    const date = new Date(this.state.post.dateCreated);
    const dateCreated = monthNames[date.getMonth()] + " " + date.getDate();
    if (this.state.redirect) {
      return <Redirect to={this.state.route} />;
    }
    return (
      <React.Fragment>
        {this.state.loading && <Loading />}
        <div className="post-screen">
          <h1>{title}</h1>
          <h3>{description}</h3>
          {this.isAuthor() ||
          sessionStorage.getItem("user_role") === "Admin" ? (
            <Fragment>
              <button className="edit-post" onClick={this.handleEdit}>
                Edit
              </button>
              <button className="delete-post" onClick={this.handleDelete}>
                Delete
              </button>
            </Fragment>
          ) : null}

          <p className="author">
            Written by{" "}
            <i>
              <b>{author}</b>
            </i>
          </p>

          <p className="read-time">
            {dateCreated} &#8226; {readTime} min read.
          </p>

          <div
            className="content"
            dangerouslySetInnerHTML={{ __html: content }}
          >
            {/* {content && content.map(el => el)} */}
          </div>
          <div className="like-button">
            <a href="#" onClick={this.handleLike}>
              &#x1f44d; {likes} likes.
            </a>
          </div>
        </div>
        {title && <CommentArea comments={comments} postId={_id} />}
      </React.Fragment>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return notificationActions(dispatch);
};

export default withRouter(
  connect(
    null,
    mapDispatchToProps
  )(PostScreen)
);
