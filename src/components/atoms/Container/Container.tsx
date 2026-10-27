const Container = ({
  children,
  className = "xl:px-14",
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={`mx-auto w-full 2xl:max-w-350 px-4 sm:px-6 ${className}`}>
      {children}
    </div>
  );
};

export default Container;
