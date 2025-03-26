"use client";

import { useContext, useState } from "react";
import { Field, Label } from "@/components/fieldset";
import { Input } from "@/components/input";
import { Button } from "@/components/button";
import { Strong, Text, TextLink } from "@/components/text";

export default function Home() {
  const [loginData, setLoginData] = useState({
    username: "",
    password: ""
  });
  const [loginLoading, setLoginLoading] = useState(false);

  async function login() {
    setLoginLoading(true);

    if (loginData.username == "" || loginData.password == "") {
      alert("請輸入帳號密碼！");
      return;
    }

    const randomSixDigit = Math.floor(100000 + Math.random() * 900000);
    const config = {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: new URLSearchParams({
        ...loginData,
        client_id: randomSixDigit
      })
    };
    let response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_8100}/fjbc_login_api/auth/login`, config);
    const data = await response.json();
    if (response.ok) {
      localStorage.setItem("access_token", data.access_token);
      localStorage.setItem("client_id", randomSixDigit);

      window.location.href = "/admin/bill";
    } else {
      if (response.status == 403) {
        alert(data.detail["zh-TW"]);
      } else {
        alert("系統錯誤！");
        setLoginLoading(false);
      }
    }
  }

  return (
    <div className="container mx-auto flex justify-center">
      <div className="w-md mt-40">
        <div className="text-blue-500 font-bold text-2xl m-5 text-center">採購明細</div>
        <Field>
          <Label>帳號</Label>
          <Input
            name="username"
            onChange={(e) => {
              setLoginData({
                ...loginData,
                username: e.target.value
              });
            }}
          />
        </Field>
        <Field>
          <Label>密碼</Label>
          <Input
            name="password"
            onChange={(e) => {
              setLoginData({
                ...loginData,
                password: e.target.value
              });
            }}
          />
        </Field>
        <div className="m-5 flex justify-center">
          {loginLoading ? (
            <Button
              color="red"
              disabled
            >
              登入中...
            </Button>
          ) : (
            <Button
              color="green"
              onClick={login}
            >
              登入
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
