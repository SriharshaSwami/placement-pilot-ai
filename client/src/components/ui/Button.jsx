export const Button = ({ children, className, ...props }) => {
  return (
    <div className={"Button " + (className || '')} {...props}>
      {children || 'Button Component'}
    </div>
  );
};
