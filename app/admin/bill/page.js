"use client";

import { useContext, useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/table";
import { Dialog, DialogActions, DialogBody, DialogDescription, DialogTitle } from "@/components/dialog";
import { Button } from "@/components/button";

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [selectItem, setSelectItem] = useState({});
  const [billList, setBillList] = useState([]);
  const [billAmount, setBillAmount] = useState({
    list_amount: 0,
    current_amount: 0
  });

  async function getBillList() {
    const config = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        clientid: `${localStorage.getItem("client_id")}`,
        "Content-Type": "application/json"
      }
    };
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/bill/system/list`, config);
    const res = await response.json();

    if (response.ok) {
      setBillList(res);
    }
  }

  async function getBillAmount() {
    const config = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        clientid: `${localStorage.getItem("client_id")}`,
        "Content-Type": "application/json"
      }
    };
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/bill/system/amount`, config);
    const res = await response.json();

    if (response.ok) {
      setBillAmount(res);
    }
  }

  async function billReview(id) {
    const config = {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        clientid: `${localStorage.getItem("client_id")}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ bill_id: id })
    };
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/bill`, config);
    const res = await response.json();
    if (response.ok) {
      getBillList();
      getBillAmount();
    }
  }

  async function getBill(id) {
    const config = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        clientid: `${localStorage.getItem("client_id")}`,
        "Content-Type": "application/json"
      }
    };
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/bill/system/${id}`, config);
    const res = await response.json();

    if (response.ok) {
      setIsOpen(true);
      setSelectItem(res);
    }
  }

  useEffect(() => {
    getBillList();
    getBillAmount();
  }, []);

  return (
    <>
      <Dialog
        open={isOpen}
        onClose={setIsOpen}
        size="4xl"
      >
        <DialogTitle>
          {selectItem.date} {selectItem.content}
        </DialogTitle>
        <DialogDescription>
          <span className="mr-4">單位：{selectItem.department_name}</span>
          <span className="mr-4">總支出：{selectItem.amount}</span>
          <span className="mr-4">發票：{selectItem.invoice}</span>
          <span className="mr-4">供應商：{selectItem.supplier_name}</span>
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
                  className="hover:bg-blue-50 dark:hover:bg-gray-700"
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

      <div className="container mx-auto">
        <div className="flex justify-between items-center">
          <div className="text-blue-500 font-bold text-xl m-5">未審核零用金</div>
          <div>
            <div className="text-pink-600">前期餘額：{billAmount.list_amount || 0}</div>
            <div className="text-red-600">當前餘額：{billAmount.current_amount || 0}</div>
          </div>
        </div>

        <Table
          grid
          className="[--gutter:--spacing(6)] sm:[--gutter:--spacing(8)]"
        >
          <TableHead>
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
                className="hover:bg-blue-50 dark:hover:bg-gray-700"
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
                      getBill(bill.bill_id);
                    }}
                  >
                    查看明細
                  </Button>
                  <Button
                    color="orange"
                    className="mx-1"
                    onClick={() => {
                      window.location.href = `/admin/bill/setting?id=${bill.bill_id}`;
                    }}
                  >
                    修改
                  </Button>
                  {bill.review ? (
                    <Button
                      disabled
                      color="red"
                    >
                      已送審
                    </Button>
                  ) : (
                    <Button
                      onClick={() => {
                        billReview(bill.bill_id);
                      }}
                      color="green"
                    >
                      送審
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
