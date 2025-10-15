import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Avatar from "@mui/material/Avatar";
import {
  Navbar,
  NavBody,
  NavItems,
  MobileNav,
  NavbarLogo,
  NavbarButton,
  MobileNavHeader,
  MobileNavToggle,
  MobileNavMenu,
} from "../components/ui/resizable-navbar.jsx";
import { useAuth } from "../context/AuthProvider.jsx";

export function NavbarDemo() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { authUser, signOut } = useAuth();

  const navItems = [
    { name: "Home", link: "/" },
    { name: "Mock Interview", link: "/mockInterviewLandingPage" },
    { name: "Quiz", link: "/quiz" },
    { name: "Resume", link: "/resume" },
    { name: "History", link: "/history" },
  ];

  // Remove the separate features array since all features are now in navItems
  const allNavFeatures = navItems;

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <div className="relative w-full z-50">
      <Navbar className="relative z-50 w-full bg-transparent border-0 shadow-none mt-2">
        <NavBody className="bg-transparent dark:bg-transparent rounded-none px-2 py-0 shadow-none">
          <NavbarLogo />
          <NavItems items={navItems} navigate={navigate} />
          <div className="flex items-center gap-4 z-50">
            {/* Login/Logout */}
            {authUser ? (
              <NavbarButton variant="secondary" onClick={handleLogout}>
                Logout
              </NavbarButton>
            ) : (
              <NavbarButton
                variant="secondary"
                className="bg-white/10 hover:bg-white/20 border border-white/10"
                onClick={() => navigate("/auth/login")}
              >
                Login
              </NavbarButton>
            )}

            {/* Avatar */}
            {authUser && (
              <Avatar
                alt="User"
                src={authUser.user_metadata?.avatar_url}
                sx={{ width: 48, height: 48 }}
              />
            )}
          </div>
        </NavBody>

        {/* Mobile Navigation */}
        <MobileNav>
          <MobileNavHeader>
            <NavbarLogo />
            <div className="flex gap-6 flex-row justify-center items-center mr-3">
              <MobileNavToggle
                isOpen={isMobileMenuOpen}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              />
              {authUser && (
                <Avatar
                  alt="User"
                  src={authUser.user_metadata?.avatar_url}
                  sx={{ width: 48, height: 48 }}
                />
              )}
            </div>
          </MobileNavHeader>

          <MobileNavMenu
            isOpen={isMobileMenuOpen}
            onClose={() => setIsMobileMenuOpen(false)}
          >
            {allNavFeatures.map((item, idx) => (
              <a
                key={idx}
                href={item.link}
                onClick={(e) => {
                  e.preventDefault();
                  setIsMobileMenuOpen(false);
                  navigate(item.link);
                }}
                className="relative text-neutral-300 cursor-pointer"
              >
                <span className="block">{item.name}</span>
              </a>
            ))}
            <div className="flex w-full flex-col gap-4">
              {authUser ? (
                <NavbarButton
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    handleLogout();
                  }}
                  variant="primary"
                  className="w-full"
                >
                  Logout
                </NavbarButton>
              ) : (
                <NavbarButton
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    navigate("/auth/login");
                  }}
                  variant="primary"
                  className="w-full"
                >
                  Login
                </NavbarButton>
              )}
            </div>
          </MobileNavMenu>
        </MobileNav>
      </Navbar>
    </div>
  );
}
