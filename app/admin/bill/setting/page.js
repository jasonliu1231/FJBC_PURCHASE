"use client";

import { useContext, useEffect, useState } from "react";
import { Field, Label } from "@/components/fieldset";
import { Radio, RadioField, RadioGroup } from "@/components/radio";
import { Listbox, ListboxLabel, ListboxOption } from "@/components/listbox";
import { Button } from "@/components/button";
import { Input } from "@/components/input";
import { PlusIcon } from "@heroicons/react/16/solid";

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [departmentList, setDepartmentList] = useState([]);
  const [supplierList, setSupplierList] = useState([]);
  const [createData, setCreateData] = useState({
    date: new Date().toISOString().split("T")[0],
    content: "",
    tutoring_id: 0,
    supplier: 0,
    state: false,
    amount: 0,
    invoice: "",
    remark: ""
  });
  const [createDetail, setCreateDetail] = useState([{ content: "", money: 0, quantity: 0, unit: "", remark: "" }]);

  async function getDepartment() {
    const config = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        clientid: `${localStorage.getItem("client_id")}`,
        "Content-Type": "application/json"
      }
    };
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/bill/department?enable=true`, config);
    const res = await response.json();

    if (response.ok) {
      setDepartmentList(res);
    }
  }

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
      setCreateData(res);
      setCreateDetail(res.detail);
    }
  }

  async function submit() {
    if (createData.content == "") {
      alert("請輸入敘述");
      return;
    }

    const detail_amount = createDetail.reduce((amount, item) => amount + item.money, 0);
    if (detail_amount < 0) {
      alert("明細總金額錯誤！");
      return;
    }
    createData.amount = detail_amount;
    createData.detail = createDetail;

    const config = {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        clientid: `${localStorage.getItem("client_id")}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(createData)
    };
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/bill`, config);
    const res = await response.json();
    if (response.ok) {
      alert("修改完成！");
    } else {
    }
  }

  useEffect(() => {
    getDepartment();
    getSupplier();

    const queryString = window.location.search;
    const params = new URLSearchParams(queryString);
    const id = params.get("id");

    getBill(id);
  }, []);

  const detail_amount = createDetail.reduce((amount, item) => amount + item.money, 0);

  return (
    <div className="container mx-auto">
      <div className="text-blue-500 font-bold text-xl m-5">修改零用金</div>
      <div className="border-2 border-gray-300 rounded-md p-10 grid grid-cols-4 gap-2">
        <div>
          <RadioGroup
            name="state"
            value={createData.state}
            onChange={(val) => {
              setCreateData({
                ...createData,
                state: val
              });
            }}
          >
            <RadioField>
              <Radio
                color="sky"
                value={true}
              />
              <Label>收入</Label>
            </RadioField>
            <RadioField>
              <Radio
                color="sky"
                value={false}
              />
              <Label>支出</Label>
            </RadioField>
          </RadioGroup>
        </div>
        <div>
          <Field>
            <Label>單位</Label>
            <Listbox
              name="tutoring_id"
              value={createData.tutoring_id}
              onChange={(val) => {
                setCreateData({
                  ...createData,
                  tutoring_id: val
                });
              }}
            >
              {departmentList.map((department) => (
                <ListboxOption
                  key={department.id}
                  value={department.id}
                >
                  <ListboxLabel>{department.name}</ListboxLabel>
                </ListboxOption>
              ))}
            </Listbox>
          </Field>
        </div>
        <div>
          <Field>
            <Label>供應商</Label>
            <Listbox
              name="supplier"
              value={createData.supplier}
              onChange={(val) => {
                setCreateData({
                  ...createData,
                  supplier: val
                });
              }}
            >
              {supplierList.map((supplier) => (
                <ListboxOption
                  key={supplier.id}
                  value={supplier.id}
                >
                  <ListboxLabel>{supplier.name}</ListboxLabel>
                </ListboxOption>
              ))}
            </Listbox>
          </Field>
        </div>
        <div>
          <Field>
            <Label>時間</Label>
            <Input
              name="date"
              type="date"
              value={createData.date}
              onChange={(e) => {
                setCreateData({
                  ...createData,
                  date: e.target.value
                });
              }}
            />
          </Field>
        </div>
        <div>
          <Field>
            <Label>單據敘述</Label>
            <Input
              name="content"
              value={createData.content}
              onChange={(e) => {
                setCreateData({
                  ...createData,
                  content: e.target.value
                });
              }}
            />
          </Field>
        </div>
        <div>
          <Field>
            <Label>發票</Label>
            <Input
              name="invoice"
              value={createData.invoice}
              onChange={(e) => {
                setCreateData({
                  ...createData,
                  invoice: e.target.value
                });
              }}
            />
          </Field>
        </div>
        <div>
          <Field>
            <Label>
              總金額<span className="text-red-500">(自動填寫)</span>
            </Label>
            <Input
              name="amount"
              value={detail_amount}
              readOnly={true}
            />
          </Field>
        </div>
        <div>
          <Field>
            <Label>備註</Label>
            <Input
              name="remark"
              value={createData.remark}
              onChange={(e) => {
                setCreateData({
                  ...createData,
                  remark: e.target.value
                });
              }}
            />
          </Field>
        </div>
      </div>
      <div className="flex justify-between items-center">
        <div className="text-blue-500 font-bold text-xl m-5">商品明細</div>
        <Button
          color="yellow"
          onClick={() => {
            setCreateDetail([...createData.detail, { content: "", money: 0, quantity: 0, unit: "", remark: "" }]);
          }}
        >
          新增明細
        </Button>
      </div>

      <div className="mt-2">
        {createDetail.map((item, index) => (
          <div
            key={index}
            className="grid grid-cols-12 gap-2 border-2 border-gray-300 rounded-md py-3 px-10 my-1"
          >
            <Field className="col-span-3">
              <Label>商品名稱</Label>
              <Input
                name="content"
                value={item.content}
                onChange={(e) => {
                  setCreateDetail(
                    createDetail.map((i, idx) => {
                      if (index == idx) {
                        return {
                          ...i,
                          content: e.target.value
                        };
                      } else {
                        return i;
                      }
                    })
                  );
                }}
              />
            </Field>
            <Field className="col-span-1">
              <Label>數量</Label>
              <Input
                name="quantity"
                value={item.quantity}
                onChange={(e) => {
                  if (isNaN(Number(e.target.value))) {
                    return;
                  }
                  setCreateDetail(
                    createDetail.map((i, idx) => {
                      if (index == idx) {
                        return {
                          ...i,
                          quantity: Number(e.target.value)
                        };
                      } else {
                        return i;
                      }
                    })
                  );
                }}
              />
            </Field>
            <Field className="col-span-1">
              <Label>單位</Label>
              <Input
                name="unit"
                value={item.unit}
                onChange={(e) => {
                  setCreateDetail(
                    createDetail.map((i, idx) => {
                      if (index == idx) {
                        return {
                          ...i,
                          unit: e.target.value
                        };
                      } else {
                        return i;
                      }
                    })
                  );
                }}
              />
            </Field>
            <Field className="col-span-1">
              <Label>小計</Label>
              <Input
                name="money"
                value={item.money}
                onChange={(e) => {
                  if (isNaN(Number(e.target.value))) {
                    return;
                  }
                  setCreateDetail(
                    createDetail.map((i, idx) => {
                      if (index == idx) {
                        return {
                          ...i,
                          money: Number(e.target.value)
                        };
                      } else {
                        return i;
                      }
                    })
                  );
                }}
              />
            </Field>
            <Field className="col-span-6">
              <Label>備注</Label>
              <Input
                name="remark"
                value={item.remark}
                onChange={(e) => {
                  setCreateDetail(
                    createDetail.map((i, idx) => {
                      if (index == idx) {
                        return {
                          ...i,
                          remark: e.target.value
                        };
                      } else {
                        return i;
                      }
                    })
                  );
                }}
              />
            </Field>
            {/* <Field className="col-span-1 flex justify-center items-center">
              <Button
                color="red"
                onClick={() => {
                  setCreateDetail(createDetail.filter((i, idx) => idx != index));
                }}
              >
                刪除
              </Button>
            </Field> */}
          </div>
        ))}
      </div>
      <div className="flex justify-center items-end m-5">
        {/* <Button
          color="blue"
          onClick={() => {
            setCreateDetail([...createDetail, { content: "", money: 0, quantity: 0, unit: "", remark: "" }]);
          }}
        >
          <PlusIcon />
          新增商品
        </Button> */}
        <Button
          color="green"
          onClick={submit}
        >
          送出
        </Button>
      </div>
    </div>
  );
}
