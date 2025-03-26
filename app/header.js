"use client";

import { Navbar, NavbarItem, NavbarSection } from "@/components/navbar";
import { useEffect } from "react";
import { Strong, Text, TextLink } from "@/components/text";

const items = [
  {
    id: 1,
    label: "新增表單",
    href: "/admin/bill/create"
  },
  {
    id: 2,
    label: "未審核零用金",
    href: "/admin/bill"
  },
  {
    id: 3,
    label: "部門設定",
    href: "/admin/department"
  },
  {
    id: 4,
    label: "供應商設定",
    href: "/admin/supplier"
  }
];

export default function HeaderPage() {
  useEffect(() => {
    async function getToken() {
      const access_token = localStorage.getItem("access_token");
      const client_id = localStorage.getItem("client_id");

      if (!access_token || !client_id) {
        window.location.href = "/";
      }
    }

    getToken();
  }, []);
  return (
    <Navbar className="bg-yellow-50 dark:bg-gray-700 px-20">
      <NavbarSection className="flex-1">
        {items.map((item) => (
          <NavbarItem
            key={item.id}
            href={item.href}
          >
            {item.label}
          </NavbarItem>
        ))}
      </NavbarSection>
      <NavbarSection>
        <NavbarItem
          onClick={() => {
            localStorage.removeItem("access_token");
            localStorage.removeItem("client_id");

            window.location.href = "/";
          }}
        >
          <Text>登出</Text>
        </NavbarItem>
      </NavbarSection>
    </Navbar>
  );
}
