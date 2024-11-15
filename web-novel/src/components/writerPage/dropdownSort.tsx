import React from "react";
import { Select, SelectItem } from "@nextui-org/react";

interface Props {
  onSort: (sortOption: string) => void;
}

export default function App({ onSort }: Props) {
  return (
    <Select
      label="เรียงลำดับ"
      placeholder="Select an animal"
      startContent={""}
      defaultSelectedKeys={["อัปเดตล่าสุด"]}
      // className="max-w-xs"
    >
      <SelectItem key="อัปเดตล่าสุด">อัปเดตล่าสุด</SelectItem>
      <SelectItem key="ยอดนิยม">ยอดนิยม</SelectItem>
      <SelectItem key="วันที่่เผยแพร่">วันที่่เผยแพร่</SelectItem>
      <SelectItem key="วันที่สร้าง">วันที่สร้าง</SelectItem>
    </Select>
  );
}
