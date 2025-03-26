"use client";

import { useContext, useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/table";
import { Button } from "@/components/button";

export default function Home() {
  const [loading, setLoading] = useState(true);
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

  useEffect(() => {
    getBillList();
    getBillAmount();
  }, []);

  return (
    <div className="container mx-auto">
      <div className="flex justify-between items-center">
        <div className="text-blue-500 font-bold text-xl m-5">未審核零用金</div>
        <div>
          <div className="text-pink-600">前期餘額：{billAmount.list_amount.toLocaleString()}</div>
          <div className="text-red-600">當前餘額：{billAmount.current_amount.toLocaleString()}</div>
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
                  <Button color="green">送審</Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
