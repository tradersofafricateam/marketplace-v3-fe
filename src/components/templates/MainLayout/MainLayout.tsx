import Navbar from "@/components/organisms/Navbar/Navbar";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen relative w-full bg-primary-foreground text-primary">
      <Navbar />
      <main>{children}</main>
    </div>
  );
};

export default MainLayout;
