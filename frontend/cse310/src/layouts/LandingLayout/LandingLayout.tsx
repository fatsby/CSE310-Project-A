import LandingHeader from "../../components/LandingHeader";

interface Props {
  children?: React.ReactNode;
}

export default function LandingLayout({ children }: Props) {
  return (
    <div>
      <LandingHeader></LandingHeader>
      {children}
    </div>
  );
}
