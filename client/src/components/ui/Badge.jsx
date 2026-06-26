export const Badge = ({ children, className, ...props }) => {
  return (
    <div className={"Badge " + (className || '')} {...props}>
      {children || 'Badge Component'}
    </div>
  );
};
