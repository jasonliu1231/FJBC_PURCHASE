"use client";

import { useContext, useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/table";
import { Button } from "@/components/button";
import { Dialog, DialogActions, DialogBody, DialogDescription, DialogTitle } from "@/components/dialog";
import { Field, Label } from "@/components/fieldset";
import { Input } from "@/components/input";

export default function Home() {
  const [create, setCreate] = useState({ name: "" });
  const [supplierList, setSupplierList] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  async function getSupplier() {
    const config = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        clientid: `${localStorage.getItem("client_id")}`,
        "Content-Type": "application/json"
      }
    };
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/bill/supplier`, config);
    const res = await response.json();

    if (response.ok) {
      setSupplierList(res);
    }
  }

  async function createSupplier() {
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
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/bill/supplier`, config);
    const res = await response.json();

    if (response.ok) {
      setIsOpen(false);
      setSupplierList(res);
    }
  }

  async function switchSupplier(data) {
    const config = {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        clientid: `${localStorage.getItem("client_id")}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    };
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/bill/Supplier`, config);
    const res = await response.json();

    if (response.ok) {
      setSupplierList(res);
    } else {
      alert(res.detail);
    }
  }

  useEffect(() => {
    getSupplier();
  }, []);

  return (
    <div className="container mx-auto ">
      <Dialog
        open={isOpen}
        onClose={setIsOpen}
      >
        <DialogTitle>新增供應商</DialogTitle>
        <DialogDescription>部門名稱是唯一欄位，請勿重複設定</DialogDescription>
        <DialogBody>
          <Field>
            <Label>供應商名稱</Label>
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
              createSupplier();
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
            <TableHeader>供應商名稱</TableHeader>
            <TableHeader>狀態</TableHeader>
            <TableHeader>設定</TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          {supplierList.map((supplier) => (
            <TableRow
              key={supplier.id}
              className="hover:bg-blue-50 dark:hover:bg-gray-700"
            >
              <TableCell className="font-medium">{supplier.name}</TableCell>
              <TableCell className="font-medium">{supplier.enable ? "啟用中" : "關閉中"}</TableCell>
              <TableCell className="font-medium">
                <Button
                  color={supplier.enable ? "red" : "green"}
                  onClick={() => {
                    switchSupplier({
                      id: supplier.id,
                      enable: !supplier.enable
                    });
                  }}
                >
                  {supplier.enable ? "關閉" : "啟用"}
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
