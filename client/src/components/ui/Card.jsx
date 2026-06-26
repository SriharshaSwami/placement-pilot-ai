export const Card = ({ children, className, ...props }) => {
  return (
    <div className={"Card " + (className || '')} {...props}>
      {children || 'Card Component'}
    </div>
  );
};
