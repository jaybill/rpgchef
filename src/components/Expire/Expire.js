import React from 'react';

var Expire = React.createClass({
  getDefaultProps: function() {
    return {
      delay: 1000
    };
  },
  getInitialState: function() {
    return {
      visible: true
    };
  },
  componentWillReceiveProps: function(nextProps) {
    // reset the timer if children are changed
    if (nextProps.children !== this.props.children) {
      this.setTimer();
      this.setState({
        visible: true
      });
    }
  },
  componentDidMount: function() {
    this.setTimer();
  },
  setTimer: function() {
    // clear any existing timer
    if (this._timer != null) {
      window.clearTimeout(this._timer);
    }

    // hide after `delay` milliseconds
    this._timer = window.setTimeout(function() {
      this.setState({
        visible: false
      });
      this._timer = null;
    }.bind(this), this.props.delay);
  },
  render: function() {
    return this.state.visible
      ? <div>
          { this.props.children }
        </div>
      : <span />;
  }
});

export default Expire;
