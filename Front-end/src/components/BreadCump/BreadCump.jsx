import React from "react";

export default function BreadCump({ datas }) {
  return (
    <div className="breadcrumbs text-sm">
      <ul>
      <li>{datas.val1}</li>
      <li>Shah</li>
      </ul>
    </div>
  );
}
