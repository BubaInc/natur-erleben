import { MouseEventHandler } from "react";

export default function Button({
  onClick,
  className,
  children,
  disabled,
}: {
  onClick?: MouseEventHandler<HTMLButtonElement>;
  className?: string;
  children?: any;
  disabled?: boolean;
}) {
  return (
    <>
      <style jsx>{`
        .button {
          font-family: "Inter";
          font-style: normal;
          font-weight: 400;
          font-size: 20px;
          line-height: 24px;
          text-align: center;
          color: ${disabled ? "#C2C2C2" : "#FFFFFF"};

          background: ${disabled ? "#D8D8D8" : "#68c9ff"};
          border-radius: 50px;
          padding: 10px 30px;
          border: none;
        }

        .button:focus {
          background-color: #3187b6;
        }
      `}</style>
      <button
        disabled={disabled === undefined ? false : disabled}
        onClick={onClick}
        className={className + " " + "button"}
      >
        {children}
      </button>
    </>
  );
}
