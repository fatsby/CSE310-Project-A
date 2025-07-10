import LandingHeader from "../components/LandingHeader";

export default function LandingLayout({ children }) {
  return (
    <div>
      <LandingHeader />
      {children}
    </div>
  );
}
