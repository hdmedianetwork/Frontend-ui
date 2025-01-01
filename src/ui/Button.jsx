import PropTypes from "prop-types";

//this is a reusable button component

export const Button = ({ children, variant = "primary", onClick }) => {
  const baseStyles =
    "px-4 py-2 rounded-lg font-medium transition-colors font-text";
  const variants = {
    primary: "bg-p-color hover:bg-d-color text-bg-color",
    secondary: "bg-s-color hover:bg-d-color text-bg-color",
  };

  return (
    <button className={`${baseStyles} ${variants[variant]}`} onClick={onClick}>
      {children}
    </button>
  );
};

// PropTypes validation
Button.propTypes = {
  children: PropTypes.string.isRequired,
  variant: PropTypes.oneOf(["primary", "secondary"]),
  onClick: PropTypes.func,
};

Button.defaultProps = {
  variant: "primary",
};
