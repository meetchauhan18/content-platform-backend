import React from "react";

export const CommonButton = (props) => {
  const { buttonName, onClick, disabled, style } = props;

  let defaultStyle = "px-4 py-2 rounded-md bg-blue-500 text-white";

  let buttonStyle = defaultStyle + " " + style;

  return (
    <button onClick={onClick} disabled={disabled} style={buttonStyle}>
      {buttonName}
    </button>
  );
};
