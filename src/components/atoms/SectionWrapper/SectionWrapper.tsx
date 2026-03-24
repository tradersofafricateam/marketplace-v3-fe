import Container from "../Container/Container";

const SectionWrapper = ({
  tag = "section",
  className = "lg:py-28 sm:py-20 py-14",
  children,
}: {
  tag?: "section" | "footer";
  className?: string;
  children: React.ReactNode;
}) => {
  const Tag = tag;

  return (
    <Tag className={`${className}`}>
      <Container>{children}</Container>
    </Tag>
  );
};

export default SectionWrapper;
