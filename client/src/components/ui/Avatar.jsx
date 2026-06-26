export const Avatar = ({ children, className, ...props }) => {
  return (
    <div className={"Avatar " + (className || '')} {...props}>
      {children || 'Avatar Component'}
    </div>
  );
};
