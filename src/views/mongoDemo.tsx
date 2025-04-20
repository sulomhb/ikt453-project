import { useEffect, useRef, useState } from "react";

export const MongoClinical = ({ data }: { data: any }) => {
  return (
    <div>
      <pre>{JSON.stringify(data, null, 2)}</pre> {/* Replace with MongoDB queries */}
    </div>
  );
};