import React from "react";
import PropTypes from "prop-types";

const styles = {
  root: {
    height: 14,
    width: 14,
    cursor: "pointer",
    border: 0,
    background: "none",
    padding: 0,
  },
  dot: {
    backgroundColor: "#2e6da4",
    borderWidth: 3,
    height: 10,
    width: 10,
    borderRadius: 6,
    margin: 3,
    opacity: 0.5,
  },
  active: {
    backgroundColor: "#ffff",
    opacity: 0.5,
  },
};

class PaginationDot extends React.Component {
  handleClick = (event) => {
    this.props.onClick(event, this.props.index);
  };

  render() {
    const { active } = this.props;

    let styleDot;

    if (active) {
      styleDot = Object.assign({}, styles.dot, styles.active);
    } else {
      styleDot = styles.dot;
    }

    return (
      <button type="button" style={styles.root} onClick={this.handleClick}>
        <div style={styleDot} />
      </button>
    );
  }
}

PaginationDot.propTypes = {
  active: PropTypes.bool.isRequired,
  index: PropTypes.number.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default PaginationDot;
