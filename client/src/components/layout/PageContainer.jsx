export const PageContainer = ({ children }) => {
  return (
    <main className="py-8">
      <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {children}
      </div>
    </main>
  );
};
