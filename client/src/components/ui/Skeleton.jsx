export const Skeleton = ({ children, className, ...props }) => {
  return (
    <div className={"Skeleton " + (className || '')} {...props}>
      {children || 'Skeleton Component'}
    </div>
  );
};
