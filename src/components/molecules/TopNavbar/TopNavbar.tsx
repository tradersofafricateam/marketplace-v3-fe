"use client";

import Container from "@/components/atoms/Container/Container";
import WhatsappBtn from "@/components/atoms/WhatsappBtn/WhatsappBtn";
import NavTopDropdownsWrapper from "../NavTopDropdownsWrapper/NavTopDropdownsWrapper";

const TopNavbar = () => {
  return (
    <div className="w-full bg-primary-foreground">
      <Container>
        <div className="flex items-center justify-between h-10 gap-2">
          <WhatsappBtn />
          <NavTopDropdownsWrapper />
        </div>
      </Container>
    </div>
  );
};

export default TopNavbar;
