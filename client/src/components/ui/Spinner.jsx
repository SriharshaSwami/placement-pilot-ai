export const Spinner = ({ children, className, ...props }) => {
  return (
    <div className={"Spinner " + (className || '')} {...props}>
      {children || 'Spinner Component'}
    </div>
  );
};
