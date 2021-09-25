import React, { Component } from "react";
import { Payment } from "@material-ui/icons";
import { Grid, Button, Typography, ListItemText } from "@material-ui/core";
import { convertToRupiah } from "../../utils/global";
import "./ButtonPay.style.css";
const stylesListComent = {
  inline: {
    display: "inline",
  },
};

export default class TooltipAdd extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: props.title === undefined ? "" : props.title,
      total: props.total === undefined ? "" : props.total,
    };
  }

  componentWillReceiveProps = (props) => {
    this.setState({
      title: props.title === undefined ? "" : props.title,
      total: props.total === undefined ? "" : props.total,
    });
  };

  Submit = () => {
    if (this.props.Submit !== undefined) {
      this.props.Submit();
    }
  };

  render() {
    return (
      <div className="pay-bottom">
        <Grid container justify="center">
          <Grid item xs={6}>
            <ListItemText
              style={{ textAlign: "center" }}
              primary="Total Bill"
              primaryTypographyProps={{
                style: {
                  color: "#000",
                  fontWeight: 500,
                  fontSize: 14,
                },
              }}
              secondary={
                <React.Fragment>
                  <Typography
                    component="span"
                    variant="body2"
                    style={
                      (stylesListComent.inline,
                      { fontSize: 16, color: "red", fontWeight: "bold" })
                    }
                  >
                    {convertToRupiah(this.state.total)}
                  </Typography>
                </React.Fragment>
              }
            />
          </Grid>
          <Grid
            item
            xs={6}
            style={{
              textAlign: "end",
              paddingRight: 10,
            }}
          >
            <Button
              variant="contained"
              color="secondary"
              size="small"
              style={{
                height: 50,
                backgroundColor: "#2e6da4",
              }}
              onClick={() => this.Submit()}
              endIcon={<Payment />}
            >
              <Typography
                variant="button"
                style={{
                  fontSize: 14,
                  color: "#fff",
                  textTransform: "capitalize",
                }}
              >
                {this.state.title}
              </Typography>
            </Button>
          </Grid>
        </Grid>
      </div>
    );
  }
}
