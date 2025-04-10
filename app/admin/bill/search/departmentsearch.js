"use client";

import { useContext, useEffect, useState } from "react";
import { Button } from "@/components/button";
import { Field, Label } from "@/components/fieldset";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/table";
import { Dialog, DialogActions, DialogBody, DialogDescription, DialogTitle } from "@/components/dialog";
import { Input } from "@/components/input";
import { MagnifyingGlassIcon } from "@heroicons/react/16/solid";

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [selectItem, setSelectItem] = useState({});
  const [departmentList, setDepartmentList] = useState([]);
  const [billList, setBillList] = useState([]);
  const [date, setDate] = useState({
    start_date: "",
    end_date: ""
  });
  const [selectDepartment, setSelectDepartment] = useState([]);

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

  async function searchBillList() {
    if (date.start_date == "" || date.end_date == "") {
      alert("日期區間請勿空白");
      return;
    }
    if (selectDepartment.length == 0) {
      alert("請選擇單位");
      return;
    }

    const config = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        clientid: `${localStorage.getItem("client_id")}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        ...date,
        departmentList: selectDepartment
      })
    };
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/bill/system/departmentsearch`, config);
    const res = await response.json();

    if (response.ok) {
      setBillList(res);
    }
  }

  useEffect(() => {
    getDepartment();
  }, []);

  return (
    <div className="">
      <Dialog
        open={isOpen}
        onClose={setIsOpen}
        size="4xl"
      >
        <DialogTitle>
          {selectItem.date} {selectItem.content}
        </DialogTitle>
        <DialogDescription>
          <div>單位：{selectItem.department_name}</div>
          <div>總支出：{selectItem.amount}</div>
          <div>發票：{selectItem.invoice}</div>
          <div>供應商：{selectItem.supplier_name}</div>
        </DialogDescription>
        <DialogBody>
          <Table
            grid
            className="[--gutter:--spacing(6)] sm:[--gutter:--spacing(8)]"
          >
            <TableHead className="bg-green-100">
              <TableRow>
                <TableHeader>品名</TableHeader>
                <TableHeader>數量</TableHeader>
                <TableHeader>單位</TableHeader>
                <TableHeader>小計</TableHeader>
                <TableHeader>備註</TableHeader>
              </TableRow>
            </TableHead>
            <TableBody>
              {selectItem.detail?.map((item) => (
                <TableRow
                  key={item.id}
                  className="hover:bg-blue-50"
                >
                  <TableCell>{item.content}</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>{item.unit}</TableCell>
                  <TableCell>{item.money}</TableCell>
                  <TableCell>{item.remark}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </DialogBody>
        <DialogActions>
          <Button
            plain
            onClick={() => setIsOpen(false)}
          >
            關閉
          </Button>
        </DialogActions>
      </Dialog>

      <div className="grid grid-cols-7 gap-8 border-b-4 p-2">
        <div className="col-span-1 row-span-2">
          <Field>
            <Label>起始日期</Label>
            <Input
              value={date.start_date}
              onChange={(e) => {
                setDate({
                  ...date,
                  start_date: e.target.value
                });
              }}
              name="full_name"
              type="date"
            />
          </Field>
          <Field>
            <Label>結束日期</Label>
            <Input
              value={date.end_date}
              onChange={(e) => {
                setDate({
                  ...date,
                  end_date: e.target.value
                });
              }}
              name="full_name"
              type="date"
            />
          </Field>
        </div>
        <div className="col-span-5 grid grid-cols-5 gap-2 items-center">
          {departmentList.map((item, index) => (
            <Button
              key={index}
              color={selectDepartment.some((id) => id == item.id) ? "pink" : "white"}
              className="w-full"
              onClick={() => {
                const check = selectDepartment.some((id) => id == item.id);
                if (check) {
                  setSelectDepartment(selectDepartment.filter((id) => id != item.id));
                } else {
                  setSelectDepartment([...selectDepartment, item.id]);
                }
              }}
            >
              {item.name}
            </Button>
          ))}
        </div>
        <div className="col-span-1">
          <Button
            color="green"
            className="w-full"
            onClick={() => {
              searchBillList();
            }}
          >
            <MagnifyingGlassIcon />
            查詢
          </Button>
        </div>
      </div>
      <Table
        grid
        className="[--gutter:--spacing(6)] sm:[--gutter:--spacing(8)]"
      >
        <TableHead className="bg-green-100">
          <TableRow>
            <TableHeader>日期</TableHeader>
            <TableHeader>單位</TableHeader>
            <TableHeader>明細敘述</TableHeader>
            <TableHeader>供應商</TableHeader>
            <TableHeader>狀態</TableHeader>
            <TableHeader>總計</TableHeader>
            <TableHeader>發票</TableHeader>
            <TableHeader>備註</TableHeader>
            <TableHeader>設定</TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          {billList.map((bill) => (
            <TableRow
              key={bill.bill_id}
              className="hover:bg-blue-50"
            >
              <TableCell>{bill.date}</TableCell>
              <TableCell>{bill.department_name}</TableCell>
              <TableCell>{bill.content}</TableCell>
              <TableCell>{bill.supplier_name}</TableCell>
              <TableCell className={`${bill.state ? "text-green-500" : "text-red-500"}`}>{bill.state ? "收入" : "支出"}</TableCell>
              <TableCell>{bill.amount}</TableCell>
              <TableCell>{bill.invoice}</TableCell>
              <TableCell>{bill.remark}</TableCell>
              <TableCell>
                <Button
                  color="cyan"
                  className="mx-1"
                  onClick={() => {
                    setSelectItem(bill);
                    setIsOpen(true);
                  }}
                >
                  查看明細
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
