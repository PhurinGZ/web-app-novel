import React from "react";
import { Select, SelectItem } from "@nextui-org/react";

interface Props {
  onFilter: (filterOption: string) => void;
}

export default function App({ onFilter }: Props) {
  return (
    <Select
      label="Fillter"
      placeholder="Select an animal"
      startContent={""}
      defaultSelectedKeys={["ทั้งหมด"]}
      // className="max-w-xs"
    >
      <SelectItem key="ทั้งหมด">ทั้งหมด</SelectItem>
      <SelectItem key="จบแล้ว">จบแล้ว</SelectItem>
      <SelectItem key="แบบร่าง">แบบร่าง</SelectItem>
      <SelectItem key="กำลังเผยแร่">กำลังเผยแร่</SelectItem>
    </Select>
  );
}
