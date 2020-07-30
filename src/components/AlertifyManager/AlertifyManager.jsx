import React from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import cx from "classnames";
class AlertifyManager extends React.Component {
  constructor(props) {
    super(props);
    this.state = { notifications: [] };
    this._self = this;
    this.addNewAlertify = (content, type) => {
      this.state.notifications.unshift({
        content: content,
        type: type,
      });
      this.setState({ notifications: this.state.notifications });
      setTimeout(() => {
        if (this.state.notifications.length > 0) {
          console.log("settimeout");
          this.state.notifications.pop();
          this.setState({});
        }
      }, 4000);
    };
  }
  render() {
    const { classes } = this.props;
    const { notifications } = this.state;
    return (
      <div className={classes.root}>
        {notifications.map((n, i) => {
          var notificationClassName = cx({
            [classes.notification]: true,
            [classes[n.type]]: true,
          });
          return (
            <p key={"alertifi" + i} className={notificationClassName}>
              {n.content}
            </p>
          );
        })}
      </div>
    );
  }
}

export default withStyles({
  root: {
    position: "fixed",
    bottom: "30px",
    right: "30px",
    width: "fit-content",
    height: "fit-content",
    zIndex: 99999,
  },
  notification: {
    width: "250px",
    padding: "16px",
    marginTop: "8px",
    color: "#fff",
    borderRadius: "5px",
    backgroundColor: "#aaa",
  },
  success: {
    backgroundColor: "#5cb860",
  },
  error: {
    backgroundColor: "#f55a4e",
  },
  warning: {
    backgroundColor: "#ffa21a",
  },
})(AlertifyManager);
