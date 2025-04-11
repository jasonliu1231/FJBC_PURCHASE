"use client";

import { useContext, useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/table";
import { Button } from "@/components/button";
import { Dialog, DialogActions, DialogBody, DialogDescription, DialogTitle } from "@/components/dialog";
import { Field, Label } from "@/components/fieldset";
import { Input } from "@/components/input";

export default function Home() {
  const [create, setCreate] = useState({ name: "" });
  const [departmentList, setDepartmentList] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  async function getDepartment() {
    const config = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        clientid: `${localStorage.getItem("client_id")}`,
        "Content-Type": "application/json"
      }
    };
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/bill/department`, config);
    const res = await response.json();

    if (response.ok) {
      setDepartmentList(res);
    }
  }

  async function createDepartment() {
    if (create.name == "") {
      return;
    }
    const config = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        clientid: `${localStorage.getItem("client_id")}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(create)
    };
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/bill/department`, config);
    const res = await response.json();

    if (response.ok) {
      setIsOpen(false);
      setDepartmentList(res);
    }
  }

  async function switchDepartment(data) {
    const config = {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        clientid: `${localStorage.getItem("client_id")}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    };
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/bill/department`, config);
    const res = await response.json();

    if (response.ok) {
      setDepartmentList(res);
    } else {
      alert(res.detail);
    }
  }

  useEffect(() => {
    getDepartment();
  }, []);

  return (
    <div className="container mx-auto ">
      <Dialog
        open={isOpen}
        onClose={setIsOpen}
      >
        <DialogTitle>新增部門</DialogTitle>
        <DialogDescription>部門名稱是唯一欄位，請勿重複設定</DialogDescription>
        <DialogBody>
          <Field>
            <Label>部門名稱</Label>
            <Input
              name="name"
              placeholder="請輸入名稱"
              onChange={(e) => {
                setCreate({
                  ...create,
                  name: e.target.value
                });
              }}
            />
          </Field>
        </DialogBody>
        <DialogActions>
          <Button
            plain
            onClick={() => setIsOpen(false)}
          >
            取消
          </Button>
          <Button
            color="green"
            onClick={() => {
              createDepartment();
            }}
          >
            送出
          </Button>
        </DialogActions>
      </Dialog>

      <div className="flex justify-end mt-5">
        <Button
          type="button"
          color="green"
          onClick={() => setIsOpen(true)}
        >
          新增
        </Button>
      </div>

      <Table
        grid
        className="[--gutter:--spacing(6)] sm:[--gutter:--spacing(8)]"
      >
        <TableHead>
          <TableRow>
            <TableHeader>部門名稱</TableHeader>
            <TableHeader>狀態</TableHeader>
            <TableHeader>設定</TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          {departmentList.map((department) => (
            <TableRow
              key={department.id}
              className="hover:bg-blue-50 dark:hover:bg-gray-700"
            >
              <TableCell className="font-medium">{department.name}</TableCell>
              <TableCell className="font-medium">{department.enable ? "啟用中" : "關閉中"}</TableCell>
              <TableCell className="font-medium">
                <Button
                  color={department.enable ? "red" : "green"}
                  onClick={() => {
                    switchDepartment({
                      id: department.id,
                      enable: !department.enable
                    });
                  }}
                >
                  {department.enable ? "關閉" : "啟用"}
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
