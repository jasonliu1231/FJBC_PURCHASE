"use client";

import { useContext, useEffect, useState } from "react";
import { Button } from "@/components/button";
import DepartmentSearch from "./departmentsearch";
import DetailSearch from "./detailsearch";
import ItemSearch from "./itemsearch";

const items = ["單位查詢", "明細查詢", "商品查詢"];

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [state, setState] = useState(0);

  return (
    <div className="container mx-auto">
      <div className="flex">
        {items.map((item, index) => (
          <Button
            key={index}
            className="w-full m-2"
            color={`${state == index ? "blue" : "sky"}`}
            onClick={() => {
              setState(index);
            }}
          >
            {item}
          </Button>
        ))}
      </div>
      <div>{state == 0 ? <DepartmentSearch /> : state == 1 ? <DetailSearch /> : state == 2 ? <ItemSearch /> : null}</div>
    </div>
  );
}
