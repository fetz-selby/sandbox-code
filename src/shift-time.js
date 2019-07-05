import React, { Component } from "react";
import isBlank from "is-blank";
import "./styles.css";

const ESCAPE = 27;
const DOWN_ARROW = 40;
const UP_ARROW = 38;
const ENTER = 13;
const HOUR_NAV_LIMIT = 23;
const MIN_NAV_LIMIT = 60;
const HOUR_TYPE = 0;
const MIN_TYPE = 1;

const get24Hours = (query, startHourFrom) => {
  let i = startHourFrom > 0 ? startHourFrom : 0;
  const hours = [];
  while (i < 24) {
    const hour = i < 10 ? `0${i}` : `${i}`;
    if (query) {
      if (hour.includes(query)) hours.push(hour);
    } else {
      hours.push(hour);
    }
    i++;
  }

  return hours;
};

const getMins = (query, startMinsFrom, minInterval) => {
  let i = startMinsFrom > 0 ? startMinsFrom : 0;
  const mins = [];
  while (i < 60) {
    const min = i < 10 ? `0${i}` : `${i}`;
    if (query) {
      if (min.includes(query)) mins.push(min);
    } else {
      mins.push(min);
    }
    i += minInterval;
  }

  return mins;
};

const ShiftInput = props => (
  <input
    className="input-standard-style"
    style={props.style}
    value={props.value}
    onClick={e => props.onInputClicked(e)}
    onChange={e => props.onInputChanged(e)}
    onFocus={e => props.onInputFocused(e)}
    onKeyUp={e => props.onInputKeyPressed(e)}
  />
);

const Separator = props => <div style={props.style}>:</div>;

const ShiftItem = props => (
  <div
    style={
      (props.itemsStyle,
      props.index === props.navIndex ? highliteItemStyle() : {})
    }
    onClick={e => props.onShiftItemClicked(e, props.label, props.itemType)}
    onMouseOver={e => props.onShiftMouseOver(e, props.index, props.itemType)}
  >
    {props.label}
  </div>
);
const DropDown = props => (
  <div style={props.isShow ? dropdownContainerStyle() : { display: "none" }}>
    {props.items.map((item, index) => (
      <ShiftItem
        itemStyle={props.itemsStyle}
        key={index}
        label={item}
        index={index}
        navIndex={props.navIndex}
        onShiftItemClicked={props.onItemClicked}
        itemType={props.dropType}
        onShiftMouseOver={props.onItemMouseOver}
      />
    ))}
  </div>
);

const separatorStyle = () => {
  const padding = "10px 5px";
  const color = "#bbb";

  return { padding, color };
};

const containterStyle = () => {
  const display = "flex";
  const flexDirection = "row";
  const width = "95px";
  const border = "1px solid #ddd";

  return { display, flexDirection, width, border };
};

const dropdownContainerStyle = () => {
  const display = "block";
  const position = "absolute";
  const backgroundColor = "#f9f9f9";
  const width = "40px";
  const boxShadow = "0px 8px 16px 0px rgba(0,0,0,0.2)";
  const padding = "5px";
  const textAlign = "center";
  const zIndex = "1";

  return {
    display,
    position,
    backgroundColor,
    width,
    boxShadow,
    textAlign,
    padding,
    zIndex
  };
};

const itemStyle = () => {
  const fontSize = "14px";
  const padding = "10px";

  return { fontSize, padding };
};

const highliteItemStyle = () => {
  const backgroundColor = "blue";
  const color = "#fefefe";
  const cursor = "pointer";

  return { backgroundColor, color, cursor };
};

const inputStyle = () => {
  const width = "30px";
  const height = "30px";
  const color = "#999";
  const fontSize = "14px";
  const fontWeight = "500";
  const padding = "5px";
  const letterSpacing = "3px";
  const textAlign = "center";
  const border = "none";

  return {
    width,
    height,
    color,
    fontSize,
    fontWeight,
    padding,
    letterSpacing,
    textAlign,
    border
  };
};

class ShiftTime extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showHourPopup: false,
      showMinPopup: false,
      isHourClicked: false,
      hourQuery: "",
      minQuery: "",
      hourNav: -1,
      minNav: -1,
      startHourFrom: 0,
      startMinFrom: 0
    };
  }

  componentWillMount() {
    document.addEventListener("mousedown", this.handleClick.bind(this), false);
  }

  componentWillUnmount() {
    document.removeEventListener(
      "mousedown",
      this.handleClick.bind(this),
      false
    );
  }

  handleClick(e) {
    if (!this.node.contains(e.target)) {
      this.setState({
        showHourPopup: false,
        showMinPopup: false
      });
    }
  }

  onHourInputClicked() {
    this.setState({
      showHourPopup: true,
      showMinPopup: false,
      isHourClicked: true
    });
  }

  onMinInputClicked() {
    this.setState({
      showMinPopup: true,
      showHourPopup: false,
      isHourClicked: false
    });
  }

  onHourInputChanged(e) {
    const value = e.target.value;
    this.setState({
      hourQuery: value,
      showHourPopup: true,
      showMinPopup: false,
      hourNav: -1
    });
  }

  onMinInputChanged(e) {
    const value = e.target.value;
    this.setState({
      minQuery: value,
      showMinPopup: true,
      showHourPopup: false,
      minNav: -1
    });
  }

  onHourInputFocused(e) {
    this.setState({
      showHourPopup: true,
      showMinPopup: false,
      isHourClicked: true
    });
  }

  onMinInputFocused(e) {
    this.setState({
      showMinPopup: true,
      showHourPopup: false,
      isHourClicked: false
    });
  }

  onHourInputKeyPressed(e) {
    const keyCode = e.keyCode;
    const { hourNav, hourQuery } = this.state;
    const { startHourFrom = 7 } = this.props;

    switch (keyCode) {
      case ESCAPE: {
        this.setState({
          showHourPopup: false,
          showMinPopup: false
        });
        return;
      }
      case UP_ARROW: {
        if (hourNav > 0)
          this.setState({
            hourNav: hourNav - 1
          });

        return;
      }

      case DOWN_ARROW: {
        if (hourNav < HOUR_NAV_LIMIT - startHourFrom)
          this.setState({
            hourNav: hourNav + 1
          });

        return;
      }

      case ENTER: {
        const actualValue = get24Hours(hourQuery, startHourFrom)[hourNav];
        const val = isBlank(actualValue)
          ? ""
          : `${actualValue.length === 1 ? "0" + actualValue : actualValue}`;

        this.setState({
          hourQuery: val,
          showHourPopup: false,
          showMinPopup: false
        });

        return;
      }

      default: {
        break;
      }
    }
  }

  onMinInputKeyPressed(e) {
    const keyCode = e.keyCode;
    const { minNav } = this.state;
    const { minInterval = 7 } = this.props;

    switch (keyCode) {
      case ESCAPE: {
        this.setState({
          showMinPopup: false,
          showHourPopup: false
        });
        return;
      }
      case UP_ARROW: {
        if (minNav > 0)
          this.setState({
            minNav: minNav - 1
          });

        return;
      }

      case DOWN_ARROW: {
        if (minNav < Math.floor(MIN_NAV_LIMIT / minInterval))
          this.setState({
            minNav: minNav + 1
          });

        return;
      }

      case ENTER: {
        const { minNav, minQuery } = this.state;
        const { startMinsFrom, minInterval = 7 } = this.props;

        const actualValue = getMins(minQuery, startMinsFrom, minInterval)[
          minNav
        ];
        const val = isBlank(actualValue)
          ? ""
          : `${actualValue.length === 1 ? "0" + actualValue : actualValue}`;

        this.setState({
          minQuery: val,
          showMinPopup: false,
          showHourPopup: false
        });

        return;
      }

      default:
        break;
    }
  }

  onDropItemClicked(e, value, type) {
    type === HOUR_TYPE
      ? this.setState({
          hourQuery: value,
          showHourPopup: false,
          showMinPopup: false
        })
      : this.setState({
          minQuery: value,
          showHourPopup: false,
          showMinPopup: false
        });
  }

  onDropItemMouseOver(e, index, type) {
    type === HOUR_TYPE
      ? this.setState({
          hourNav: index
        })
      : this.setState({
          minNav: index
        });
  }

  render() {
    const {
      showHourPopup,
      showMinPopup,
      isHourClicked,
      hourQuery,
      minQuery,
      hourNav,
      minNav
    } = this.state;
    const {
      startHourFrom = 7,
      startMinsFrom = 0,
      minInterval = 7
    } = this.props;

    return (
      <div ref={node => (this.node = node)}>
        <div style={containterStyle()}>
          <div>
            <ShiftInput
              name="hours"
              style={inputStyle()}
              value={hourQuery}
              onInputClicked={this.onHourInputClicked.bind(this)}
              onInputChanged={this.onHourInputChanged.bind(this)}
              onInputFocused={this.onHourInputFocused.bind(this)}
              onInputKeyPressed={this.onHourInputKeyPressed.bind(this)}
            />
            <DropDown
              itemsStyle={itemStyle()}
              isShow={showHourPopup}
              items={get24Hours(hourQuery, startHourFrom)}
              navIndex={hourNav}
              onItemClicked={this.onDropItemClicked.bind(this)}
              dropType={HOUR_TYPE}
              onItemMouseOver={this.onDropItemMouseOver.bind(this)}
            />
          </div>
          <Separator style={separatorStyle()} />
          <div>
            <ShiftInput
              name="mins"
              style={inputStyle()}
              value={minQuery}
              onInputClicked={this.onMinInputClicked.bind(this)}
              onInputChanged={this.onMinInputChanged.bind(this)}
              onInputFocused={this.onMinInputFocused.bind(this)}
              onInputKeyPressed={this.onMinInputKeyPressed.bind(this)}
            />
            <DropDown
              itemsStyle={itemStyle()}
              isShow={showMinPopup}
              items={getMins(minQuery, startMinsFrom, minInterval)}
              navIndex={minNav}
              onItemClicked={this.onDropItemClicked.bind(this)}
              dropType={MIN_TYPE}
              onItemMouseOver={this.onDropItemMouseOver.bind(this)}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default ShiftTime;
