import UserHeader from "../components/UserHeader";

export default function UserLayout({ children }) {
  return (
    <div>
      <UserHeader />
      {children}
    </div>
  );
}
