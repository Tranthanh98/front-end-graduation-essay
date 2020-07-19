import React from "react";
import { withStyles, createMuiTheme } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";

const styleModal = (theme) => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  paper: {
    height: "90vh",
    width: "80vw",
    backgroundColor: "rgba(255, 255, 255, 1);",
    boxShadow: theme.shadows[5],
    borderRadius: "10px",
    padding: 0,
    overflowY: "auto",
  },
});

class CustomModal extends React.Component {
  render() {
    const { classes } = this.props;
    const theme = createMuiTheme();
    // console.log("test modal : ", this.props.content)
    return (
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={this.props.open}
        onClose={this.props.onClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={this.props.open}>
          <div className={classes.paper}>{this.props.content}</div>
        </Fade>
      </Modal>
    );
  }
}

export default withStyles(styleModal)(CustomModal);
