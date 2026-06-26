export const Input = ({ children, className, ...props }) => {
  return (
    <div className={"Input " + (className || '')} {...props}>
      {children || 'Input Component'}
    </div>
  );
};
