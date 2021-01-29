import React from 'react';

export default function YesNoBool(props) {
  const { bool, extraClasses } = props;
  const yesOrNo = bool === true ? 'yes' : 'no';
  let classNames = [yesOrNo];
  if (extraClasses && extraClasses[yesOrNo]) {
    classNames = [...classNames, ...extraClasses[yesOrNo]];
  }
  return <span className={classNames.join(' ')}>{yesOrNo.toUpperCase()}</span>;
}
