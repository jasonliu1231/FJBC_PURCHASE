"use client";

import { useContext, useEffect, useState } from "react";
import { Button } from "@/components/button";
import { Field, Label } from "@/components/fieldset";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/table";
import { Input, InputGroup } from "@/components/input";
import { MagnifyingGlassIcon } from "@heroicons/react/16/solid";

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [billDetailList, setBillDetailList] = useState([]);
  const [search, setSearch] = useState("");

  async function searchBillDetailList() {
    if (search == "") {
      alert("商品名稱不可以空白");
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
        content: search
      })
    };
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/bill/detail/selected`, config);
    const res = await response.json();

    if (response.ok) {
      setBillDetailList(res);
    }
  }

  return (
    <div className="">
      <div className="grid grid-cols-6 gap-4 my-2">
        <Field className="col-span-5">
          <InputGroup>
            <MagnifyingGlassIcon />
            <Input
              className="w-full"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
              }}
              name="search"
              placeholder="商品名稱或供應商"
              aria-label="Search"
            />
          </InputGroup>
        </Field>
        <Field className="col-span-1">
          <Button
            className="w-full"
            color="green"
            onClick={() => {
              searchBillDetailList();
            }}
          >
            <MagnifyingGlassIcon />
            查詢
          </Button>
        </Field>
      </div>

      <Table
        grid
        className="[--gutter:--spacing(6)] sm:[--gutter:--spacing(8)]"
      >
        <TableHead className="bg-green-100">
          <TableRow>
            <TableHeader>日期</TableHeader>
            <TableHeader>單位</TableHeader>
            <TableHeader>供應商</TableHeader>
            <TableHeader>品名</TableHeader>
            <TableHeader>數量</TableHeader>
            <TableHeader>單位</TableHeader>
            <TableHeader>小計</TableHeader>
            <TableHeader>備註</TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          {billDetailList.map((item) => (
            <TableRow
              key={item.id}
              className="hover:bg-blue-50"
            >
              <TableCell>{item.date}</TableCell>
              <TableCell>{item.department_name}</TableCell>
              <TableCell>{item.supplier_name}</TableCell>
              <TableCell>{item.content}</TableCell>
              <TableCell>{item.quantity}</TableCell>
              <TableCell>{item.unit}</TableCell>
              <TableCell>{item.money}</TableCell>
              <TableCell>{item.remark}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
