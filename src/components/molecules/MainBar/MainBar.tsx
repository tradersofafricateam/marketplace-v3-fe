import Container from "@/components/atoms/Container/Container";
import Logo from "@/components/atoms/Logo/Logo";
import MainSearchbar from "../MainSearchbar/MainSearchbar";
import NavbarActionWrapper from "../NavbarActionWrapper/NavbarActionWrapper";

export default function MainBar({ mobileOpen, toggle, accountControl, onNavigate }: { mobileOpen: boolean; toggle: () => void; accountControl: React.ReactNode; onNavigate: () => void }) {
  return (
    <Container>
      <div className="flex h-18 items-center justify-between gap-4 md:h-20 md:gap-8 lg:gap-12">
        <Logo width={96} height={48} />
        <div className="hidden min-w-0 flex-1 md:block"><MainSearchbar onNavigate={onNavigate} /></div>
        <NavbarActionWrapper mobileOpen={mobileOpen} toggle={toggle} accountControl={accountControl} />
      </div>
      <div className="pb-4 md:hidden"><MainSearchbar onNavigate={onNavigate} /></div>
    </Container>
  );
}
