import React from 'react';

export default class Todo extends React.Component {
  render() {
    const {
      caption,
      isCompleted,
    } = this.props;

    return (
      <li type="none">
        {caption}
      </li>
    );
  }
}
