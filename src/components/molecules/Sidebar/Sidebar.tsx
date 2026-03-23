"use client";

import Link from "next/link";

import { useTranslations } from "next-intl";
import { useAboutUs } from "@/lib/hooks/useAboutUs";
import { useGetAllRoutes } from "@/lib/hooks/useGetAllRoutes";

import { motion } from "framer-motion";
import { LogIn, User, UserPlus } from "lucide-react";

import Container from "@/components/atoms/Container/Container";
import MainSearchbar from "../MainSearchbar/MainSearchbar";

const Sidebar = ({ toggle }: { toggle: () => void }) => {
  const t = useTranslations("Nav");

  const { aboutItems } = useAboutUs();
  const { routes } = useGetAllRoutes();

  const isUserSignedIn = false;

  return (
    <motion.aside
      initial={{ x: 400 }}
      animate={{ x: 0 }}
      exit={{ x: 400 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="md:hidden bg-background border-l border-border max-w-md w-full min-h-screen h-full shadow-lg fixed z-40"
    >
      <Container>
        <div className="py-4">
          <div className="pb-6">
            <MainSearchbar />
          </div>

          <div className="flex flex-col gap-1">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest px-3 pt-2 pb-1">
              {t("about.label")}
            </p>
            {aboutItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={toggle}
                className="px-3 py-2.5 rounded-lg text-sm hover:bg-(--orange-light) hover:text-(--orange) font-medium transition-colors"
              >
                {item.label}
              </Link>
            ))}

            <div className="border-t border-slate-100 my-2" />
            <Link
              href={routes?.becomeSeller}
              onClick={toggle}
              className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm hover:bg-(--orange-light) hover:text-(--orange) font-medium transition-colors"
            >
              {t("sellOnTofa")}
            </Link>
            {isUserSignedIn ? (
              <Link
                href={routes?.overview}
                onClick={toggle}
                className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm hover:bg-(--orange-light) hover:text-(--orange) font-medium transition-colors"
              >
                <User size={16} /> {t("account")}
              </Link>
            ) : (
              <Link
                href={routes?.login}
                onClick={toggle}
                className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm hover:bg-(--orange-light) hover:text-(--orange) font-medium transition-colors"
              >
                <LogIn size={16} /> {t("login")}
              </Link>
            )}

            <div className="border-t border-slate-100 my-2" />

            {!isUserSignedIn ? (
              <Link
                href={routes?.register}
                onClick={toggle}
                className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-(--orange) hover:bg-(--orange-dark) text-white font-semibold text-sm transition-colors"
              >
                <UserPlus size={16} /> {t("join")}
              </Link>
            ) : (
              <button
                onClick={toggle}
                className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm hover:text-red-700 text-red-500 font-medium transition-colors"
              >
                <LogIn size={16} /> {t("logout")}
              </button>
            )}
          </div>
        </div>
      </Container>
    </motion.aside>
  );
};

export default Sidebar;
