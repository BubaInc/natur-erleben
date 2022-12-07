import { MouseEventHandler } from "react";

export default function Button({
  onClick,
  className,
  children,
  disabled,
  red,
  onlyDisabledColoring,
  disabledWithoutColoring,
  small,
  fitContent,
}: {
  onClick?: MouseEventHandler<HTMLButtonElement>;
  className?: string;
  children?: any;
  disabled?: boolean;
  red?: boolean;
  onlyDisabledColoring?: boolean;
  disabledWithoutColoring?: boolean;
  small?: boolean;
  fitContent?: boolean;
}) {
  const isDisabled = () => {
    if (disabled == undefined && disabledWithoutColoring == undefined)
      return false;
    return disabled || disabledWithoutColoring;
  };

  const calculatedDisabled = isDisabled();

  const calculateBackground = () => {
    if (red) return "red";
    else if (small) return "#3bbf51";
    else {
      if (disabled || onlyDisabledColoring) return "#D8D8D8";
      else return "#68c9ff";
    }
  };

  const calculatedBackground = calculateBackground();

  return (
    <>
      <style jsx>{`
        .button {
          font-family: "Inter";
          font-style: normal;
          font-weight: 400;
          font-size: ${small ? "17px" : "20px"};
          line-height: 24px;
          text-align: center;
          color: ${disabled || onlyDisabledColoring ? "#C2C2C2" : "#FFFFFF"};
          ${fitContent ? "width: fit-content;" : ""}

          background: ${calculatedBackground};
          border-radius: ${small ? "40px" : "50px"};
          ${small ? "width: fit-content;" : ""}
          padding: ${small ? "3px 10px" : "10px 30px"};
          border: none;
        }

        .button:focus {
          background-color: #3187b6;
        }
      `}</style>
      <button
        disabled={calculatedDisabled}
        onClick={onClick}
        className={className + " " + "button"}
      >
        {children}
      </button>
    </>
  );
}
