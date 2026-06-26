export const Modal = ({ children, className, ...props }) => {
  return (
    <div className={"Modal " + (className || '')} {...props}>
      {children || 'Modal Component'}
    </div>
  );
};
