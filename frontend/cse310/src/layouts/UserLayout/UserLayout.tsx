import UserHeader from "../../components/UserHeader";

interface Props {
  children?: React.ReactNode;
}

export default function UserLayout({ children }: Props) {
  return (
    <div>
      <UserHeader></UserHeader>
      {children}
    </div>
  );
}
